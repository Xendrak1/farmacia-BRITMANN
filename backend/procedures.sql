-- Procedimiento para obtener productos con stock bajo
DELIMITER //
CREATE PROCEDURE ObtenerProductosBajoStock(IN umbral INT)
BEGIN
    SELECT 
        p.ID,
        p.Nombre,
        p.Descripcion,
        p.Stock,
        c.Nombre AS Categoria,
        m.Nombre AS Marca,
        p.Precio_Compra,
        p.Precio_Venta
    FROM 
        Producto p
        INNER JOIN Categoria c ON p.CategoriaID = c.ID
        INNER JOIN Marca m ON p.MarcaID = m.ID
    WHERE 
        p.Stock <= umbral
    ORDER BY 
        p.Stock ASC;
END //
DELIMITER ;

-- Procedimiento para registrar una venta
DELIMITER //
CREATE PROCEDURE RegistrarVenta(
    IN p_id INT,
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_monto_total DECIMAL(10,2),
    IN p_descuento DECIMAL(10,2),
    IN p_usuario_id INT,
    IN p_cliente_id INT,
    OUT p_factura_id INT
)
BEGIN
    DECLARE bitacora_id INT;
    
    -- Obtener el próximo ID para la bitácora
    SELECT COALESCE(MAX(ID), 0) + 1 INTO bitacora_id FROM Bitacora;
    
    -- Insertar la factura
    INSERT INTO Factura (ID, Fecha, Hora, Monto_Total, Descuento, UsuarioID, ClienteID)
    VALUES (p_id, p_fecha, p_hora, p_monto_total, p_descuento, p_usuario_id, p_cliente_id);
    
    SET p_factura_id = p_id;
    
    -- Registrar en bitácora
    INSERT INTO Bitacora (ID, Fecha, Hora, Accion, UsuarioID)
    VALUES (bitacora_id, p_fecha, p_hora, CONCAT('Venta registrada con ID: ', p_factura_id), p_usuario_id);
END //
DELIMITER ;

-- Procedimiento para estadísticas de ventas mensuales
DELIMITER //
CREATE PROCEDURE EstadisticasVentasMensuales(IN mes INT, IN anio INT)
BEGIN
    SELECT 
        MONTH(f.Fecha) AS Mes,
        YEAR(f.Fecha) AS Anio,
        COUNT(f.ID) AS TotalVentas,
        SUM(f.Monto_Total) AS MontoTotalVentas,
        AVG(f.Monto_Total) AS PromedioVenta,
        MAX(f.Monto_Total) AS VentaMaxima,
        SUM(f.Descuento) AS DescuentoTotal
    FROM 
        Factura f
    WHERE 
        MONTH(f.Fecha) = mes AND YEAR(f.Fecha) = anio
    GROUP BY 
        MONTH(f.Fecha), YEAR(f.Fecha);
        
    -- Productos más vendidos
    SELECT 
        p.ID,
        p.Nombre,
        SUM(dnv.Cantidad) AS CantidadVendida,
        SUM(dnv.Total) AS MontoTotal
    FROM 
        Detalle_Nota_Venta dnv
        INNER JOIN Producto p ON dnv.ProductoID = p.ID
        INNER JOIN Factura f ON dnv.FacturaID = f.ID
    WHERE 
        MONTH(f.Fecha) = mes AND YEAR(f.Fecha) = anio
    GROUP BY 
        p.ID, p.Nombre
    ORDER BY 
        CantidadVendida DESC
    LIMIT 10;
END //
DELIMITER ;

-- Procedimiento para reporte de clientes frecuentes
DELIMITER //
CREATE PROCEDURE ReporteClientesFrecuentes(IN periodo_meses INT)
BEGIN
    SELECT 
        c.ID AS ClienteID,
        c.Nombre AS NombreCliente,
        c.Telefono,
        c.Email,
        COUNT(f.ID) AS NumeroCompras,
        SUM(f.Monto_Total) AS MontoTotal,
        AVG(f.Monto_Total) AS PromedioCompra,
        MAX(f.Fecha) AS UltimaCompra
    FROM 
        Cliente c
        INNER JOIN Factura f ON c.ID = f.ClienteID
    WHERE 
        f.Fecha >= DATE_SUB(CURDATE(), INTERVAL periodo_meses MONTH)
    GROUP BY 
        c.ID, c.Nombre, c.Telefono, c.Email
    HAVING 
        COUNT(f.ID) >= 3
    ORDER BY 
        NumeroCompras DESC, MontoTotal DESC;
END //
DELIMITER ; 