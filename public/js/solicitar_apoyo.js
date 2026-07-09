//<!-- Encargado de la página de solicitar ayuda:  Mary Paz-->
document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formAyuda");

    formulario.addEventListener("submit", function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const tipoAyuda = document.getElementById("tipoAyuda").value;
        const prioridad = document.getElementById("prioridad").value;
        const personas = document.getElementById("personas").value;
        const provincia = document.getElementById("provincia").value;
        const direccion = document.getElementById("direccion").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (
            nombre === "" ||
            cedula === "" ||
            correo === "" ||
            telefono === "" ||
            tipoAyuda === "" ||
            personas === "" ||
            direccion === "" ||
            descripcion === ""
        ) {

            alert("Debe completar todos los campos.");

            return;

        }

        let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

        const nuevaSolicitud = {

            id: solicitudes.length + 1,

            nombre,

            cedula,

            correo,

            telefono,

            tipoAyuda,

            prioridad,

            personas,

            provincia,

            direccion,

            descripcion,

            fecha: new Date().toLocaleDateString(),

            estado: "Pendiente"

        };

        solicitudes.push(nuevaSolicitud);

        localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

        const modal = new bootstrap.Modal(document.getElementById("modalSolicitud"));

        modal.show();

        formulario.reset();

    });

});