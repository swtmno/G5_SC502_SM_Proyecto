<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ]);
    exit;
}

$correo = trim($_POST['correo'] ?? '');
$password = $_POST['password'] ?? '';

if ($correo === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Correo y contraseña son obligatorios.'
    ]);
    exit;
}

try {

    $consulta = $conexion->prepare(
        "SELECT id_usuario, nombre, correo, password_hash, rol, estado
         FROM usuarios
         WHERE correo = :correo
         LIMIT 1"
    );

    $consulta->execute([
        ':correo' => $correo
    ]);

    $usuario = $consulta->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Correo o contraseña incorrectos.'
        ]);
        exit;
    }

    if ($usuario['estado'] !== 'ACTIVO') {
        echo json_encode([
            'success' => false,
            'message' => 'La cuenta no está activa.'
        ]);
        exit;
    }

    session_regenerate_id(true);

    $_SESSION['id_usuario'] = $usuario['id_usuario'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['correo'] = $usuario['correo'];
    $_SESSION['rol'] = $usuario['rol'];

    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión correcto.',
        'usuario' => [
            'nombre' => $usuario['nombre'],
            'rol' => $usuario['rol']
        ]
    ]);

} catch (PDOException $e) {

    echo json_encode([
        'success' => false,
        'message' => 'No se pudo iniciar sesión.'
    ]);
}
