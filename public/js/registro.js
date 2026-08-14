// Encargado de la página de registro js: Nicole Montenegro

const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (nombre === "") {
        alert("Debe ingresar su nombre.");
        return;
    }

    if (correo === "") {
        alert("Debe ingresar un correo electrónico.");
        return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    if (password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (confirmPassword === "") {
        alert("Debe confirmar la contraseña.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const datos = new FormData();

    datos.append("nombre", nombre);
    datos.append("correo", correo);
    datos.append("password", password);

    try {

        const respuesta = await fetch("../../api/registro.php", {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (resultado.success) {

            alert(resultado.message);

            window.location.href = "login.html";

        } else {

            alert(resultado.message);

        }

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});
