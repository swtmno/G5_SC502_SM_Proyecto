// Encargado de la página de login js: Nicole Montenegro -->

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function(event){

    // Evita que el formulario se envíe
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validar correo vacío
    if(correo === ""){
        alert("Debe ingresar un correo electrónico.");
        return;
    }

    // Validar formato del correo
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!formatoCorreo.test(correo)){
        alert("Ingrese un correo electrónico válido.");
        return;
    }

    // Validar contraseña
    if(password === ""){
        alert("Debe ingresar la contraseña.");
        return;
    }

    // Todo correcto
    alert("Inicio de sesión correcto.");

});
