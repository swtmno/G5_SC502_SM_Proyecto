<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

try {

    $consulta = $conexion->query(
        "SELECT id_solicitud, nombre_solicitante, identificacion, correo, telefono,
                tipo_ayuda, prioridad, cantidad_personas, provincia, direccion_exacta,
                descripcion_situacion, estado,
                DATE_FORMAT(fecha_solicitud, '%Y-%m-%d %H:%i') AS fecha_solicitud
         FROM solicitudes_ayuda
         ORDER BY fecha_solicitud DESC"
    );

    $solicitudes = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $solicitudes
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener las solicitudes: ' . $e->getMessage()
    ]);
}