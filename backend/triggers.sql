-- Trigger para actualizar stock después de una venta
DELIMITER //
CREATE TRIGGER ActualizarStockDespuesVenta
AFTER INSERT ON Detalle_Nota_Venta
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;
    DECLARE nombre_producto VARCHAR(100);
    DECLARE bitacora_id INT;
    
    -- Actualizar el stock del producto
    UPDATE Producto
    SET Stock = Stock - NEW.Cantidad
    WHERE ID = NEW.ProductoID;
    
    -- Obtener stock actual y nombre del producto
    SELECT Stock, Nombre INTO stock_actual, nombre_producto 
    FROM Producto 
    WHERE ID = NEW.ProductoID;
    
    -- Obtener nuevo ID para bitácora
    SELECT COALESCE(MAX(ID), 0) + 1 INTO bitacora_id FROM Bitacora;
    
    -- Registrar la actualización del stock en la bitácora
    INSERT INTO Bitacora (ID, Fecha, Hora, Accion, UsuarioID)
    VALUES (
        bitacora_id,
        CURDATE(), 
        CURTIME(), 
        CONCAT('Stock actualizado: Producto [', nombre_producto, '] - Cantidad vendida: ', 
               NEW.Cantidad, ' - Stock restante: ', stock_actual),
        (SELECT UsuarioID FROM Factura WHERE ID = NEW.FacturaID)
    );
    
    -- Verificar si el producto ha llegado a un nivel de stock crítico
    IF stock_actual < 5 THEN
        -- Obtener nuevo ID para bitácora de alerta
        SELECT COALESCE(MAX(ID), 0) + 1 INTO bitacora_id FROM Bitacora;
        
        -- Insertar alerta en la bitácora
        INSERT INTO Bitacora (ID, Fecha, Hora, Accion, UsuarioID)
        VALUES (
            bitacora_id,
            CURDATE(), 
            CURTIME(), 
            CONCAT('⚠️ ALERTA: Stock bajo para [', nombre_producto, '] - Quedan solo ', 
                  stock_actual, ' unidades - Realizar pedido urgente'),
            (SELECT UsuarioID FROM Factura WHERE ID = NEW.FacturaID)
        );
    END IF;
END //
DELIMITER ;

-- Trigger para validar stock antes de una venta
DELIMITER //
CREATE TRIGGER ValidarStockSuficiente
BEFORE INSERT ON Detalle_Nota_Venta
FOR EACH ROW
BEGIN
    DECLARE stock_disponible INT;
    
    -- Obtener el stock actual del producto
    SELECT Stock INTO stock_disponible 
    FROM Producto 
    WHERE ID = NEW.ProductoID;
    
    -- Verificar si hay suficiente stock
    IF stock_disponible < NEW.Cantidad THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No hay suficiente stock disponible para este producto';
    END IF;
END //
DELIMITER ;

-- Trigger para validar precios de venta
DELIMITER //
CREATE TRIGGER ValidarPrecioVenta
BEFORE UPDATE ON Producto
FOR EACH ROW
BEGIN
    -- Verificar que el precio de venta sea mayor al precio de compra
    IF NEW.Precio_Venta <= NEW.Precio_Compra THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El precio de venta debe ser mayor al precio de compra';
    END IF;
    
    -- Registrar cambio de precio en bitácora si hubo cambio
    IF OLD.Precio_Venta != NEW.Precio_Venta THEN
        INSERT INTO Bitacora (ID, Fecha, Hora, Accion, UsuarioID)
        VALUES (
            (SELECT COALESCE(MAX(ID), 0) + 1 FROM Bitacora),
            CURDATE(), 
            CURTIME(), 
            CONCAT('Cambio de precio en producto ID: ', NEW.ID, 
                   ' - Anterior: ', OLD.Precio_Venta, 
                   ' - Nuevo: ', NEW.Precio_Venta),
            NULL
        );
    END IF;
END //
DELIMITER ; 