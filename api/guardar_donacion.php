<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

$id_usuario = !empty($input['id_usuario']) ? intval($input['id_usuario']) : null;
$nombre_donador = trim($input['nombre_donador'] ?? '');
$correo_donador = trim($input['correo_donador'] ?? '');
$categoria = trim($input['categoria'] ?? 'Monetaria');
$tipo_frecuencia = trim($input['tipo_frecuencia'] ?? 'Única');
$metodo_pago = trim($input['metodo_pago'] ?? 'Tarjeta');
$monto = floatval($input['monto'] ?? 0);
$plan_mensual = trim($input['plan_mensual'] ?? 'N/A');

if ($monto <= 0) {
    echo json_encode(['success' => false, 'message' => 'El monto debe ser mayor a 0.']);
    exit;
}

try {
    $insertar = $conexion->prepare(
        "INSERT INTO donaciones (id_usuario, nombre_donador, correo_donador, categoria, tipo_frecuencia, metodo_pago, monto, plan_mensual)
         VALUES (:id_usuario, :nombre_donador, :correo_donador, :categoria, :tipo_frecuencia, :metodo_pago, :monto, :plan_mensual)"
    );

    $insertar->execute([
        ':id_usuario' => $id_usuario,
        ':nombre_donador' => empty($nombre_donador) ? null : $nombre_donador,
        ':correo_donador' => empty($correo_donador) ? null : $correo_donador,
        ':categoria' => $categoria,
        ':tipo_frecuencia' => $tipo_frecuencia,
        ':metodo_pago' => $metodo_pago,
        ':monto' => $monto,
        ':plan_mensual' => $plan_mensual
    ]);

    echo json_encode(['success' => true, 'message' => 'Donación registrada con éxito.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar donación: ' . $e->getMessage()]);
}
