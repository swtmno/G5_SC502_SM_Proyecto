// Encargado de la página de registro js: Nicole Montenegro -->

const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", function(event){

    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if(correo === ""){
        alert("Debe ingresar un correo electrónico.");
        return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!formatoCorreo.test(correo)){
        alert("Ingrese un correo electrónico válido.");
        return;
    }


    if(password.length < 8){
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if(confirmPassword === ""){
        alert("Debe confirmar la contraseña.");
        return;
    }

    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden.");
        return;
    }

    alert("Cuenta creada correctamente.");
    window.location.href = "../../index.html";

    //registro falso, datos serán enviados al server con el backend 

});
