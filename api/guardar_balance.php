<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true) ?? [];

// NOTA: El ID Responsable debe ser un número entero (id_usuario de la BD).
$id_responsable = intval($input['id_responsable'] ?? 0);
$recolectados_kg = floatval($input['recolectados_kg'] ?? 0);
$entregados_kg = floatval($input['entregados_kg'] ?? 0);
$desperdiciados_kg = floatval($input['desperdiciados_kg'] ?? 0);

if ($id_responsable <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de responsable inválido. Debe ingresar un ID numérico de la BD.']);
    exit;
}

try {
    $insertar = $conexion->prepare(
        "INSERT INTO balance_alimentos (id_responsable, recolectados_kg, entregados_kg, desperdiciados_kg)
         VALUES (:id_responsable, :recolectados_kg, :entregados_kg, :desperdiciados_kg)"
    );

    $insertar->execute([
        ':id_responsable' => $id_responsable,
        ':recolectados_kg' => $recolectados_kg,
        ':entregados_kg' => $entregados_kg,
        ':desperdiciados_kg' => $desperdiciados_kg
    ]);

    echo json_encode(['success' => true, 'message' => 'Balance registrado con éxito.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar balance. Es posible que el ID de usuario no exista.']);
}
