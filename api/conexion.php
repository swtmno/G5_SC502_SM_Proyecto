<?php

$host = "localhost";
$puerto = "3306";
$usuario = "root";
$password = "HambreCero2026!";
$base_datos = "hambre_cero";

try {
    $conexion = new PDO(
        "mysql:host=$host;port=$puerto;dbname=$base_datos;charset=utf8mb4",
        $usuario,
        $password
    );

    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Error de conexión.");
}
?>
