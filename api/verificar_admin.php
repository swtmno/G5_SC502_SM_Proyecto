<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'ADMIN') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado. Esta acción requiere una cuenta de administrador.'
    ]);
    exit;
}