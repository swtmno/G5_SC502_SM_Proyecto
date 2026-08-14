// Encargado de la página de login js: Nicole Montenegro

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    if (correo === "") {
        alert("Debe ingresar un correo electrónico.");
        return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    if (password === "") {
        alert("Debe ingresar la contraseña.");
        return;
    }

    const datos = new FormData();

    datos.append("correo", correo);
    datos.append("password", password);

    try {

        const respuesta = await fetch("../../api/login.php", {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (resultado.success) {

            alert(resultado.message);

            window.location.href = "../../index.html";

        } else {

            alert(resultado.message);

        }

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});
