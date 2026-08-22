<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

try {

    $consulta = $conexion->query(
        "SELECT id_voluntario, nombre, correo, telefono, tipo_apoyo,
                disponibilidad, mensaje, estado,
                DATE_FORMAT(fecha_registro, '%Y-%m-%d') AS fecha_registro
         FROM voluntarios
         ORDER BY fecha_registro DESC"
    );

    $voluntarios = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $voluntarios
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los voluntarios: ' . $e->getMessage()
    ]);
}