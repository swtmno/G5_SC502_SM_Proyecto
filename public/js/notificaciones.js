document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.getElementById("listaNotificaciones");
    const base = window.API_BASE || "../api/";

    function iconoTipo(tipo) {
        if (tipo === "CAMPANA") return "bi-megaphone-fill text-warning";
        if (tipo === "HORARIO") return "bi-clock-fill text-info";
        if (tipo === "INFO") return "bi-info-circle-fill text-primary";
        return "bi-bell-fill text-success";
    }

    try {
        const res = await fetch(base + "obtener_notificaciones.php");
        const json = await res.json();

        if (!json.logueado) {
            contenedor.innerHTML = `
                <p class="text-secondary fs-5 mt-5 fw-normal text-center">
                    Las notificaciones son reflejadas a usuarios con cuenta.
                    <a href="perfil/login.html">Inicia sesión</a> o
                    <a href="perfil/registro.html">crea una cuenta</a> para verlas.
                </p>
            `;
            return;
        }

        if (!json.success || json.data.length === 0) {
            contenedor.innerHTML = `<p class="text-secondary fs-4 mt-5 fw-normal texto-vacio text-center">Aún no cuentas con notificaciones</p>`;
            return;
        }

        contenedor.innerHTML = json.data.map(n => `
            <div class="card shadow-sm mb-3">
                <div class="card-body d-flex gap-3">
                    <i class="bi ${iconoTipo(n.tipo)} fs-3"></i>
                    <div>
                        <h6 class="fw-bold mb-1">${n.titulo}</h6>
                        <p class="mb-1">${n.mensaje}</p>
                        <small class="text-muted">${n.fecha_creacion}</small>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        contenedor.innerHTML = `<p class="text-danger text-center mt-5">Error al conectar con el servidor</p>`;
    }

});