<?php

require_once 'verificar_admin.php';
require_once 'conexion.php';

try {

    $consulta = $conexion->query(
        "SELECT id_usuario, nombre, correo, rol, estado,
                DATE_FORMAT(fecha_registro, '%Y-%m-%d') AS fecha_registro
         FROM usuarios
         ORDER BY fecha_registro DESC"
    );

    $usuarios = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $usuarios
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener los usuarios: ' . $e->getMessage()
    ]);
}