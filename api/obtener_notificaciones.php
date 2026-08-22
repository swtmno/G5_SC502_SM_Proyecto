<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'logueado' => false,
        'message' => 'Las notificaciones son exclusivas para usuarios con cuenta.'
    ]);
    exit;
}

$idUsuario = $_SESSION['id_usuario'];

try {

    $consulta = $conexion->prepare(
        "SELECT id_notificacion, titulo, mensaje, tipo, leida,
                DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i') AS fecha_creacion
         FROM notificaciones
         WHERE id_usuario = :id_usuario OR id_usuario IS NULL
         ORDER BY fecha_creacion DESC"
    );

    $consulta->execute([':id_usuario' => $idUsuario]);

    $notificaciones = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'logueado' => true,
        'data' => $notificaciones
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener las notificaciones: ' . $e->getMessage()
    ]);
}