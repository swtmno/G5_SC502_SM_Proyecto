<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

try {

    $totalUsuarios = $conexion->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
    $totalDonaciones = $conexion->query("SELECT COUNT(*) FROM donaciones")->fetchColumn();
    $totalSolicitudes = $conexion->query("SELECT COUNT(*) FROM solicitudes_ayuda")->fetchColumn();

    $completadas = $conexion->query(
        "SELECT COUNT(*) FROM solicitudes_ayuda WHERE estado = 'COMPLETADA'"
    )->fetchColumn();

    $porcentajeEntregas = $totalSolicitudes > 0
        ? round(($completadas / $totalSolicitudes) * 100)
        : 0;

    echo json_encode([
        'success' => true,
        'data' => [
            'usuarios' => (int) $totalUsuarios,
            'donaciones' => (int) $totalDonaciones,
            'solicitudes' => (int) $totalSolicitudes,
            'porcentaje_entregas' => $porcentajeEntregas
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener el resumen: ' . $e->getMessage()
    ]);
}