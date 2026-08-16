<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$id_usuario = !empty($input['id_usuario']) ? intval($input['id_usuario']) : null;
$nombre_solicitante = trim($input['nombre_solicitante'] ?? '');
$identificacion = trim($input['identificacion'] ?? '');
$correo = trim($input['correo'] ?? '');
$telefono = trim($input['telefono'] ?? '');
$tipo_ayuda = trim($input['tipo_ayuda'] ?? '');
$prioridad = trim($input['prioridad'] ?? '');
$cantidad_personas = intval($input['cantidad_personas'] ?? 0);
$provincia = trim($input['provincia'] ?? '');
$direccion_exacta = trim($input['direccion_exacta'] ?? '');
$descripcion_situacion = trim($input['descripcion_situacion'] ?? '');

if (empty($nombre_solicitante) || empty($identificacion) || empty($telefono) || empty($tipo_ayuda) || empty($prioridad) || empty($provincia) || empty($direccion_exacta) || empty($descripcion_situacion)) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios.']);
    exit;
}

try {
    $insertar = $conexion->prepare(
        "INSERT INTO solicitudes_ayuda (id_usuario, nombre_solicitante, identificacion, correo, telefono, tipo_ayuda, prioridad, cantidad_personas, provincia, direccion_exacta, descripcion_situacion)
         VALUES (:id_usuario, :nombre_solicitante, :identificacion, :correo, :telefono, :tipo_ayuda, :prioridad, :cantidad_personas, :provincia, :direccion_exacta, :descripcion_situacion)"
    );

    $insertar->execute([
        ':id_usuario' => $id_usuario,
        ':nombre_solicitante' => $nombre_solicitante,
        ':identificacion' => $identificacion,
        ':correo' => empty($correo) ? null : $correo,
        ':telefono' => $telefono,
        ':tipo_ayuda' => $tipo_ayuda,
        ':prioridad' => $prioridad,
        ':cantidad_personas' => $cantidad_personas,
        ':provincia' => $provincia,
        ':direccion_exacta' => $direccion_exacta,
        ':descripcion_situacion' => $descripcion_situacion
    ]);

    echo json_encode(['success' => true, 'message' => 'Solicitud registrada con éxito.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar solicitud: ' . $e->getMessage()]);
}
