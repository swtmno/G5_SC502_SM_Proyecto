document.addEventListener('DOMContentLoaded', function () {

    const formRegistro = document.getElementById('formRegistro');
    const mensajeExito = document.getElementById('mensajeExito');
    const base = window.API_BASE || "../api/";

    if (formRegistro) {
        formRegistro.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nombre = document.getElementById('nombreInput').value.trim();
            const correo = document.getElementById('correoInput').value.trim();
            const telefono = document.getElementById('telefonoInput').value.trim();
            const tipoApoyo = document.getElementById('tipoApoyoInput').value;
            const disponibilidad = document.getElementById('disponibilidadInput').value.trim();
            const mensaje = document.getElementById('mensajeInput').value.trim();

            try {
                const respuesta = await fetch(base + "guardar_voluntario.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre,
                        correo,
                        telefono,
                        tipo_apoyo: tipoApoyo,
                        disponibilidad,
                        mensaje
                    })
                });

                const resultado = await respuesta.json();

                if (resultado.success) {
                    formRegistro.classList.add('d-none');
                    mensajeExito.classList.remove('d-none');
                } else {
                    alert(resultado.message);
                }

            } catch (error) {
                alert("No se pudo conectar con el servidor.");
            }
        });
    }

});