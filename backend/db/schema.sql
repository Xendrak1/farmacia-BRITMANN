-- 1. Personal
CREATE TABLE IF NOT EXISTS Personal (
    ID INT NOT NULL AUTO_INCREMENT,
    CI VARCHAR(20),
    Nombre VARCHAR(100),
    Sexo VARCHAR(10),
    Telefono VARCHAR(20),
    Correo VARCHAR(100),
    Domicilio VARCHAR(150),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Rol
CREATE TABLE IF NOT EXISTS Rol (
    ID INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(50),
    Descripcion VARCHAR(150),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Privilegio
CREATE TABLE IF NOT EXISTS Privilegio (
    ID INT NOT NULL AUTO_INCREMENT,
    Descripcion VARCHAR(150),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Usuario (requiere Rol)
CREATE TABLE IF NOT EXISTS Usuario (
    ID INT NOT NULL AUTO_INCREMENT,
    Usuario VARCHAR(50),
    Contraseña VARCHAR(100),
    PersonalID INT UNIQUE,
    RolID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (PersonalID) REFERENCES Personal(ID),
    FOREIGN KEY (RolID) REFERENCES Rol(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Permiso (junction Rol–Privilegio)
CREATE TABLE IF NOT EXISTS Permiso (
   RolID INT,
   PrivilegioID INT,
   Fecha DATE,
   PRIMARY KEY (PrivilegioID, RolID),
   FOREIGN KEY (PrivilegioID) REFERENCES Privilegio(ID),
   FOREIGN KEY (RolID) REFERENCES Rol(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Bitácora
CREATE TABLE IF NOT EXISTS Bitacora (
    ID INT NOT NULL AUTO_INCREMENT,
    Fecha DATE,
    Hora TIME,
    Accion VARCHAR(150),
    UsuarioID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Proveedor
CREATE TABLE IF NOT EXISTS Proveedor (
    ID INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100),
    Dirección VARCHAR(150),
    Telefono VARCHAR(20),
    E_mail VARCHAR(100),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Nota_compra
CREATE TABLE IF NOT EXISTS Nota_compra (
    ID INT NOT NULL AUTO_INCREMENT,
    Fecha DATE,
    Hora TIME,
    Monto_Total DECIMAL(10,2),
    UsuarioID INT,
    ProveedorID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(ID),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedor(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Producto (requiere Marca y Categoria)
CREATE TABLE IF NOT EXISTS Categoria (
    ID INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Marca (
    ID INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Producto (
    ID INT NOT NULL AUTO_INCREMENT,
    Descripcion VARCHAR(200),
    Forma_Farmaceutica VARCHAR(100),
    Concentracion VARCHAR(100),
    Via_Administracion VARCHAR(100),
    Nombre VARCHAR(100),
    Oferta BOOLEAN,
    Precio_Compra DECIMAL(10,2),
    Precio_Venta DECIMAL(10,2),
    Stock INT,
    Receta BOOLEAN,
    MarcaID INT,
    CategoriaID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (MarcaID) REFERENCES Marca(ID),
    FOREIGN KEY (CategoriaID) REFERENCES Categoria(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Detalles de compra y salida
CREATE TABLE IF NOT EXISTS Detalle_Nota_Compra (
    NotaCompraID INT,
    ProductoID INT,
    Cantidad INT,
    Costo DECIMAL(10,2),
    Importe DECIMAL(10,2),
    PRIMARY KEY (NotaCompraID, ProductoID),
    FOREIGN KEY (NotaCompraID) REFERENCES Nota_compra(ID),
    FOREIGN KEY (ProductoID) REFERENCES Producto(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Nota_de_Salida (
    ID INT NOT NULL AUTO_INCREMENT,
    Fecha DATE,
    Hora TIME,
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Detalle_Nota_Salida (
    NotaSalidaID INT,
    ProductoID INT,
    Cantidad INT,
    PRIMARY KEY (NotaSalidaID, ProductoID),
    FOREIGN KEY (NotaSalidaID) REFERENCES Nota_de_Salida(ID),
    FOREIGN KEY (ProductoID) REFERENCES Producto(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Cliente y Venta
CREATE TABLE IF NOT EXISTS Cliente (
    ID INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100),
    Telefono VARCHAR(20),
    Domicilio VARCHAR(150),
    Email VARCHAR(100),
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Factura (
    ID INT NOT NULL AUTO_INCREMENT,
    Fecha DATE,
    Hora TIME,
    Monto_Total DECIMAL(10,2),
    Descuento DECIMAL(10,2),
    UsuarioID INT,
    ClienteID INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(ID),
    FOREIGN KEY (ClienteID) REFERENCES Cliente(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Detalle_Nota_Venta (
    FacturaID INT,
    ProductoID INT,
    Cantidad INT,
    Precio DECIMAL(10,2),
    Total DECIMAL(10,2),
    PRIMARY KEY (FacturaID, ProductoID),
    FOREIGN KEY (FacturaID) REFERENCES Factura(ID),
    FOREIGN KEY (ProductoID) REFERENCES Producto(ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Metodo_Pago (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) UNIQUE
);

ALTER TABLE Factura
ADD COLUMN Metodo_PagoID INT,
ADD FOREIGN KEY (Metodo_PagoID) REFERENCES Metodo_Pago(ID);
INSERT INTO Metodo_Pago (Nombre) VALUES ('Efectivo'), ('QR'), ('Tarjeta'), ('Transferencia'),('Mixto');