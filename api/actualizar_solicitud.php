<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$idSolicitud = intval($input['id_solicitud'] ?? 0);
$nuevoEstado = trim($input['estado'] ?? '');

$estadosPermitidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA'];

if ($idSolicitud <= 0 || !in_array($nuevoEstado, $estadosPermitidos)) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
    exit;
}

try {

    $actualizar = $conexion->prepare(
        "UPDATE solicitudes_ayuda SET estado = :estado WHERE id_solicitud = :id"
    );

    $actualizar->execute([
        ':estado' => $nuevoEstado,
        ':id' => $idSolicitud
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Solicitud actualizada correctamente.'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar la solicitud: ' . $e->getMessage()
    ]);
}