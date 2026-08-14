<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ]);
    exit;
}

$nombre = trim($_POST['nombre'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$password = $_POST['password'] ?? '';

if ($nombre === '' || $correo === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos son obligatorios.'
    ]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'El correo electrónico no es válido.'
    ]);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode([
        'success' => false,
        'message' => 'La contraseña debe tener al menos 8 caracteres.'
    ]);
    exit;
}

try {

    $consulta = $conexion->prepare(
        "SELECT id_usuario FROM usuarios WHERE correo = :correo"
    );

    $consulta->execute([
        ':correo' => $correo
    ]);

    if ($consulta->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Este correo ya está registrado.'
        ]);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insertar = $conexion->prepare(
        "INSERT INTO usuarios
        (nombre, correo, password_hash, rol, estado)
        VALUES
        (:nombre, :correo, :password_hash, 'DONANTE', 'ACTIVO')"
    );

    $insertar->execute([
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':password_hash' => $passwordHash
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Cuenta creada correctamente.'
    ]);

} catch (PDOException $e) {

    echo json_encode([
        'success' => false,
        'message' => 'No se pudo crear la cuenta.'
    ]);
}
