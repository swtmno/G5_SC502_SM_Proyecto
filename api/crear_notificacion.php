<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$titulo = trim($input['titulo'] ?? '');
$mensaje = trim($input['mensaje'] ?? '');
$tipo = trim($input['tipo'] ?? 'CAMPANA');

$tiposPermitidos = ['SISTEMA', 'CAMPANA', 'HORARIO', 'INFO'];
if (!in_array($tipo, $tiposPermitidos)) {
    $tipo = 'CAMPANA';
}

if ($titulo === '' || $mensaje === '') {
    echo json_encode(['success' => false, 'message' => 'El título y el mensaje son obligatorios.']);
    exit;
}

try {

    // id_usuario = NULL -> notificación general, visible para todos los usuarios con cuenta
    $insertar = $conexion->prepare(
        "INSERT INTO notificaciones (id_usuario, titulo, mensaje, tipo)
         VALUES (NULL, :titulo, :mensaje, :tipo)"
    );

    $insertar->execute([
        ':titulo' => $titulo,
        ':mensaje' => $mensaje,
        ':tipo' => $tipo
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Notificación enviada a todos los usuarios.'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al crear la notificación: ' . $e->getMessage()
    ]);
}