<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

try {
    $consulta = $conexion->query(
        "SELECT b.id_balance, b.id_responsable, b.recolectados_kg, b.entregados_kg, b.desperdiciados_kg, DATE_FORMAT(b.fecha_registro, '%Y/%m/%d') AS fecha_registro
         FROM balance_alimentos b
         ORDER BY b.fecha_registro DESC"
    );

    $balances = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $balances]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al obtener balances: ' . $e->getMessage()]);
}
