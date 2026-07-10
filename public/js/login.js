// Encargado de la página de login js: Nicole Montenegro -->

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function(event){


    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if(correo === ""){
        alert("Debe ingresar un correo electrónico.");
        return;
    }


    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!formatoCorreo.test(correo)){
        alert("Ingrese un correo electrónico válido.");
        return;
    }


    if(password === ""){
        alert("Debe ingresar la contraseña.");
        return;
    }

 
    alert("Inicio de sesión correcto.");

});
