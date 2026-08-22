<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$nombre = trim($input['nombre'] ?? '');
$correo = trim($input['correo'] ?? '');
$telefono = trim($input['telefono'] ?? '');
$tipoApoyo = trim($input['tipo_apoyo'] ?? '');
$disponibilidad = trim($input['disponibilidad'] ?? '');
$mensaje = trim($input['mensaje'] ?? '');

$tiposPermitidos = ['Voluntariado', 'Donación de Alimentos', 'Donación Monetaria', 'Organización'];

if ($nombre === '' || $correo === '' || $telefono === '' || !in_array($tipoApoyo, $tiposPermitidos)) {
    echo json_encode(['success' => false, 'message' => 'Completa todos los campos obligatorios.']);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'El correo electrónico no es válido.']);
    exit;
}

// Si hay una sesión activa, vinculamos el registro a esa cuenta automáticamente
$idUsuario = $_SESSION['id_usuario'] ?? null;

try {

    $insertar = $conexion->prepare(
        "INSERT INTO voluntarios
        (id_usuario, nombre, correo, telefono, tipo_apoyo, disponibilidad, mensaje)
        VALUES
        (:id_usuario, :nombre, :correo, :telefono, :tipo_apoyo, :disponibilidad, :mensaje)"
    );

    $insertar->execute([
        ':id_usuario' => $idUsuario,
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':telefono' => $telefono,
        ':tipo_apoyo' => $tipoApoyo,
        ':disponibilidad' => $disponibilidad !== '' ? $disponibilidad : null,
        ':mensaje' => $mensaje !== '' ? $mensaje : null
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Solicitud enviada correctamente.'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar la solicitud: ' . $e->getMessage()
    ]);
}