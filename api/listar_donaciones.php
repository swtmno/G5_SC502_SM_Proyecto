<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

try {

    $consulta = $conexion->query(
        "SELECT d.id_donacion, d.nombre_donador, u.nombre AS nombre_usuario,
                d.categoria, d.metodo_pago, d.monto, d.plan_mensual,
                DATE_FORMAT(d.fecha_donacion, '%Y-%m-%d') AS fecha_donacion
         FROM donaciones d
         LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
         ORDER BY d.fecha_donacion DESC
         LIMIT 10"
    );

    $donaciones = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $donaciones
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener las donaciones: ' . $e->getMessage()
    ]);
}