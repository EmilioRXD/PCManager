CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    procesador VARCHAR(150) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    almacenamiento VARCHAR(150) NOT NULL,
    tarjeta_grafica VARCHAR(150),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url TEXT,
    descripcion TEXT,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_equipos_categoria_id ON equipos(categoria_id);
CREATE INDEX idx_equipos_marca ON equipos(marca);
CREATE INDEX idx_equipos_precio ON equipos(precio);

CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_imagenes_equipo_id ON imagenes(equipo_id);

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Laptops', 'Computadoras portátiles para oficina, estudio y hogar'),
    ('Desktops', 'Computadoras de escritorio para oficina y productividad'),
    ('Gaming', 'Equipos de alto rendimiento para videojuegos y diseño'),
    ('Workstation', 'Estaciones de trabajo para profesionales'),
    ('All-in-One', 'Computadoras todo en uno con diseño compacto');

INSERT INTO usuarios (nombre, email, password_hash) VALUES
    ('Administrador', 'admin@pcmanager.com', '$2a$10$sR2Jv6jDFO9XJdZFWFk7U.lWs9eIuqlUSpWTgOk6KxysXqiaxW8xS');

INSERT INTO equipos (marca, modelo, procesador, ram, almacenamiento, tarjeta_grafica, precio, stock, imagen_url, descripcion, categoria_id) VALUES
    ('Dell', 'Inspiron 15 3520', 'Intel Core i5-1235U', '16 GB DDR4', '512 GB SSD NVMe', 'Intel Iris Xe Graphics', 899.99, 15, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop', 'Laptop versátil ideal para trabajo y estudio. Pantalla Full HD de 15.6", batería de larga duración.', 1),
    ('HP', 'Pavilion x360', 'Intel Core i7-1255U', '16 GB DDR4', '1 TB SSD NVMe', 'Intel Iris Xe Graphics', 1099.99, 10, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600&h=400&fit=crop', 'Laptop convertible 2-en-1 con pantalla táctil de 14". Perfecta para creatividad y productividad.', 1),
    ('Lenovo', 'ThinkPad X1 Carbon Gen 11', 'Intel Core i7-1365U', '32 GB LPDDR5', '1 TB SSD NVMe', 'Intel Iris Xe Graphics', 1799.99, 8, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop', 'Ultrabook empresarial premium. Peso ligero de 1.12 kg, pantalla 2.8K OLED de 14".', 1),
    ('MacBook', 'Air M3', 'Apple M3', '16 GB', '512 GB SSD', 'GPU 10 núcleos', 1299.99, 12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop', 'Increíblemente delgado y rápido. Chip M3, pantalla Liquid Retina de 13.6", batería 18h.', 1),
    ('HP', 'EliteDesk 800 G6', 'Intel Core i7-10700', '32 GB DDR4', '512 GB SSD + 1 TB HDD', 'Intel UHD Graphics 630', 1199.99, 6, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop', 'Desktop empresarial de alto rendimiento. Diseño compacto SFF, seguridad HP Wolf Pro.', 2),
    ('Dell', 'OptiPlex 7000', 'Intel Core i9-12900', '64 GB DDR5', '1 TB SSD NVMe + 2 TB HDD', 'NVIDIA T1000 8 GB', 2499.99, 4, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop', 'Workstation desktop de máxima potencia. Ideal para diseño CAD y análisis de datos.', 2),
    ('Lenovo', 'IdeaCentre AIO 5i', 'Intel Core i7-13620H', '16 GB DDR5', '1 TB SSD NVMe', 'Intel Iris Xe Graphics', 999.99, 9, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=600&h=400&fit=crop', 'Todo en uno con pantalla táctil de 27" QHD. Parlantes Harman Kardon, webcam 5MP.', 5),
    ('ASUS', 'ROG Strix G16', 'Intel Core i9-13980HX', '32 GB DDR5', '1 TB SSD NVMe', 'NVIDIA RTX 4070 8 GB', 2199.99, 7, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&h=400&fit=crop', 'Laptop gaming de alto rendimiento. Pantalla 16" QHD 240Hz, teclado RGB por tecla.', 3),
    ('MSI', 'Raider GE78 HX', 'Intel Core i9-14900HX', '64 GB DDR5', '2 TB SSD NVMe RAID 0', 'NVIDIA RTX 4090 16 GB', 4499.99, 3, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=400&fit=crop', 'La máxima potencia gaming. Pantalla 17" UHD 144Hz, NVIDIA RTX 4090, refrigeración Cooler Boost 5.', 3),
    ('Alienware', 'Aurora R16', 'Intel Core i9-14900KF', '64 GB DDR5', '2 TB SSD + 4 TB HDD', 'NVIDIA RTX 4090 24 GB', 5499.99, 2, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop', 'Desktop gaming de élite. Chasis de flujo optimizado, refrigeración líquida AlienFX.', 3),
    ('Lenovo', 'ThinkStation P3 Ultra', 'Intel Xeon W-3400', '128 GB DDR5 ECC', '4 TB SSD NVMe', 'NVIDIA RTX A6000 48 GB', 12999.99, 1, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop', 'Workstation profesional definitiva. Certificada ISV, para renderizado 3D, IA y simulaciones.', 4),
    ('HP', 'Z8 Fury G5', 'Dual Intel Xeon Gold 6430', '256 GB DDR5 ECC', '8 TB SSD NVMe RAID', 'NVIDIA RTX 6000 Ada 48 GB', 24999.99, 1, 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop', 'La workstation más potente del mercado. Doble procesador, para deep learning y VFX profesionales.', 4);

INSERT INTO imagenes (equipo_id, url, orden) VALUES
    (1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop', 1),
    (1, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop', 2),
    (1, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 3),
    (2, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 1),
    (2, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 2),
    (2, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 3),
    (3, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 1),
    (3, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 2),
    (3, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&h=600&fit=crop', 3),
    (4, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 1),
    (4, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 2),
    (4, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 3),
    (5, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', 1),
    (5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 2),
    (5, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 3),
    (6, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop', 1),
    (6, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', 2),
    (6, 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop', 3),
    (7, 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&h=600&fit=crop', 1),
    (7, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', 2),
    (7, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 3),
    (8, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&h=600&fit=crop', 1),
    (8, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 2),
    (8, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 3),
    (9, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 1),
    (9, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&h=600&fit=crop', 2),
    (9, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 3),
    (10, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop', 1),
    (10, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 2),
    (10, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 3),
    (11, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 1),
    (11, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 2),
    (11, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 3),
    (12, 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop', 1),
    (12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 2),
    (12, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 3);
