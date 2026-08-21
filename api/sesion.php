<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'success' => false,
        'logueado' => false,
        'message' => 'No hay sesión activa.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'logueado' => true,
    'usuario' => [
        'id_usuario' => $_SESSION['id_usuario'],
        'nombre' => $_SESSION['nombre'],
        'correo' => $_SESSION['correo'],
        'rol' => $_SESSION['rol']
    ]
]);