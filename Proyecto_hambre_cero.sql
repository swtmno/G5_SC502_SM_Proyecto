--  HAMBRE CERO - Base de Datos Relacional
--  Grupo 5 - SC-502 Ambiente Web Cliente/Servidor

--  Contexto:
--   1) usuarios.rol: se agregó 'SOLICITANTE' (la persona que pide
--      ayuda también puede registrarse, según lo describe el equipo).
--   2) solicitudes_ayuda: se agregó id_usuario (NULL permitido) con
--      su llave foránea, para poder vincular la solicitud a una
--      cuenta cuando el solicitante SÍ se registró. Si no se
--      registra, la solicitud se guarda igual que antes (anónima).
--   3) Charset utf8mb4 explícito, para evitar problemas con tildes
--      y ñ dentro de los ENUM (José, Limón, etc.).
--   4) ON DELETE SET NULL en las llaves opcionales, para que borrar
--      una cuenta no borre el historial de donaciones/solicitudes.

-- Eliminar la base de datos si ya existe para evitar errores en pruebas
DROP DATABASE IF EXISTS hambre_cero;

-- Crear la base de datos
CREATE DATABASE hambre_cero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hambre_cero;

-- ------------------------------------------------------------
-- 1. USUARIOS
--    El registro es libre/opcional para cualquier rol. Donantes,
--    solicitantes, voluntarios y organizaciones pueden usar el
--    sitio sin cuenta; si se registran, quedan aquí.
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    correo          VARCHAR(100) UNIQUE,
    password_hash   VARCHAR(255),
    rol             ENUM('DONANTE', 'SOLICITANTE', 'VOLUNTARIO', 'ORGANIZACION', 'ADMIN') DEFAULT 'DONANTE',
    estado          ENUM('PENDIENTE', 'ACTIVO', 'INACTIVO') DEFAULT 'PENDIENTE',
    fecha_registro  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. SOLICITUDES_AYUDA
--    id_usuario es NULL si la persona no se registró (flujo
--    anónimo normal). Si se registró, apunta a su cuenta.
-- ------------------------------------------------------------
CREATE TABLE solicitudes_ayuda (
    id_solicitud            INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario              INT NULL,
    nombre_solicitante      VARCHAR(100) NOT NULL,
    identificacion          VARCHAR(50) NOT NULL,
    correo                  VARCHAR(100),
    telefono                VARCHAR(20) NOT NULL,
    tipo_ayuda              ENUM('Alimentos', 'Donación Monetaria', 'Canasta Básica', 'Productos de Higiene') NOT NULL,
    prioridad               ENUM('Baja', 'Media', 'Alta', 'Urgente') NOT NULL,
    cantidad_personas       INT NOT NULL,
    provincia               ENUM('San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón') NOT NULL,
    direccion_exacta        TEXT NOT NULL,
    descripcion_situacion   TEXT NOT NULL,
    veracidad_confirmada    BOOLEAN DEFAULT TRUE,
    estado                  ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA') DEFAULT 'PENDIENTE',
    fecha_solicitud         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- 3. DONACIONES
--    id_usuario opcional + datos de invitado
--    (nombre_donador/correo_donador) para donaciones anónimas.
-- ------------------------------------------------------------
CREATE TABLE donaciones (
    id_donacion       INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario        INT NULL,
    nombre_donador    VARCHAR(100) NULL,
    correo_donador    VARCHAR(100) NULL,
    categoria         ENUM('Alimentaria', 'Monetaria', 'Canasta Básica', 'Productos de Higiene') NOT NULL,
    tipo_frecuencia   ENUM('Única', 'Mensual') DEFAULT 'Única',
    metodo_pago       ENUM('Tarjeta', 'Transferencia', 'SINPE Móvil', 'Especie') NOT NULL,
    monto             DECIMAL(10,2) NULL,
    plan_mensual      ENUM('Kit Básico', 'Nutrición Mensual', 'Sustento Familiar', 'Monto Libre', 'N/A') DEFAULT 'N/A',
    fecha_donacion    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- 4. BALANCE_ALIMENTOS
--    id_responsable siempre es un usuario registrado (admin u
--    organización) que reporta el balance de kg.
-- ------------------------------------------------------------
CREATE TABLE balance_alimentos (
    id_balance          INT AUTO_INCREMENT PRIMARY KEY,
    id_responsable      INT NOT NULL,
    recolectados_kg     DECIMAL(10,2) DEFAULT 0.00,
    entregados_kg       DECIMAL(10,2) DEFAULT 0.00,
    desperdiciados_kg   DECIMAL(10,2) DEFAULT 0.00,
    fecha_registro      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_responsable) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
);