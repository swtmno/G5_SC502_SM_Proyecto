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

        const payload = {
            nombre_solicitante: nombre,
            identificacion: cedula,
            correo: correo,
            telefono: telefono,
            tipo_ayuda: tipoAyuda,
            prioridad: prioridad,
            cantidad_personas: parseInt(personas),
            provincia: provincia,
            direccion_exacta: direccion,
            descripcion_situacion: descripcion
        };

        const btnSubmit = formulario.querySelector('button[type="submit"]');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Enviando...';
        }

        fetch('../api/guardar_solicitud.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Enviar Solicitud';
            }
            if (data.success) {
                const modal = new bootstrap.Modal(document.getElementById("modalSolicitud"));
                modal.show();
                formulario.reset();
            } else {
                alert(data.message || 'Error al enviar la solicitud.');
            }
        })
        .catch(err => {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Enviar Solicitud';
            }
            alert('Error de conexión con el servidor.');
        });

    });

});