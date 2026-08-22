// Encargado de la página: Mary Paz (adaptado para conexión con MySQL)

document.addEventListener("DOMContentLoaded", () => {

    const tabla = document.getElementById("tablaSolicitudes");
    const buscarInput = document.getElementById("buscarSolicitud");
    const listaUsuarios = document.getElementById("listaUsuarios");
    const listaDonaciones = document.getElementById("listaDonaciones");
    const btnActualizar = document.getElementById("btnActualizarPanel");

    const elUsuarios = document.getElementById("usuarios");
    const elDonaciones = document.getElementById("donaciones");
    const elSolicitudes = document.getElementById("solicitudes");
    const elPorcentaje = document.getElementById("entregasPorcentaje");

    let solicitudes = [];
    let solicitudSeleccionada = null;

    const base = window.API_BASE || "../api/";

    function badgeEstado(estado) {
        if (estado === "APROBADA" || estado === "COMPLETADA") return "bg-success";
        if (estado === "RECHAZADA") return "bg-danger";
        return "bg-warning";
    }

    // --- Cargar resumen (tarjetas superiores) ---
    async function cargarResumen() {
        try {
            const res = await fetch(base + "resumen_admin.php");
            const json = await res.json();

            if (json.success) {
                elUsuarios.textContent = json.data.usuarios;
                elDonaciones.textContent = json.data.donaciones;
                elSolicitudes.textContent = json.data.solicitudes;
                elPorcentaje.textContent = json.data.porcentaje_entregas + "%";
            }
        } catch (error) {
            console.error("Error al cargar el resumen:", error);
        }
    }

    // --- Cargar solicitudes de ayuda ---
    async function cargarSolicitudes() {
        try {
            const res = await fetch(base + "listar_solicitudes.php");
            const json = await res.json();

            if (!json.success) {
                tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted">${json.message}</td></tr>`;
                return;
            }

            solicitudes = json.data;
            renderizarTabla(solicitudes);

        } catch (error) {
            tabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al conectar con el servidor</td></tr>`;
        }
    }

    function renderizarTabla(lista) {
        tabla.innerHTML = "";

        if (lista.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay solicitudes registradas.</td></tr>`;
            return;
        }

        lista.forEach((s) => {
            tabla.innerHTML += `
                <tr>
                    <td>#${s.id_solicitud}</td>
                    <td>${s.nombre_solicitante}</td>
                    <td>${s.tipo_ayuda}</td>
                    <td>${s.provincia}</td>
                    <td><span class="badge ${badgeEstado(s.estado)}">${s.estado}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-sm verSolicitud" data-id="${s.id_solicitud}">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // --- Cargar usuarios registrados ---
    async function cargarUsuarios() {
        try {
            const res = await fetch(base + "listar_usuarios.php");
            const json = await res.json();

            if (!json.success) {
                listaUsuarios.innerHTML = `<li class="list-group-item text-muted">${json.message}</li>`;
                return;
            }

            if (json.data.length === 0) {
                listaUsuarios.innerHTML = `<li class="list-group-item text-muted">No hay usuarios registrados.</li>`;
                return;
            }

            listaUsuarios.innerHTML = json.data.map(u => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${u.nombre} <small class="text-muted">(${u.rol})</small></span>
                    <span class="badge ${u.estado === 'ACTIVO' ? 'bg-success' : u.estado === 'PENDIENTE' ? 'bg-warning' : 'bg-secondary'}">
                        ${u.estado}
                    </span>
                </li>
            `).join("");

        } catch (error) {
            listaUsuarios.innerHTML = `<li class="list-group-item text-danger">Error al conectar con el servidor</li>`;
        }
    }

    // --- Cargar últimas donaciones ---
    async function cargarDonaciones() {
        try {
            const res = await fetch(base + "listar_donaciones.php");
            const json = await res.json();

            if (!json.success) {
                listaDonaciones.innerHTML = `<p class="text-muted">${json.message}</p>`;
                return;
            }

            if (json.data.length === 0) {
                listaDonaciones.innerHTML = `<p class="text-muted">No hay donaciones registradas.</p>`;
                return;
            }

            listaDonaciones.innerHTML = json.data.map(d => `
                <div class="mb-3">
                    <strong>${d.nombre_usuario || d.nombre_donador || 'Donante anónimo'}</strong>
                    <br>
                    ${d.categoria} · ${d.metodo_pago}${d.monto ? ' · ₡' + Number(d.monto).toLocaleString() : ''}
                </div>
            `).join("");

        } catch (error) {
            listaDonaciones.innerHTML = `<p class="text-danger">Error al conectar con el servidor</p>`;
        }
    }

    // --- Búsqueda en la tabla de solicitudes ---
    if (buscarInput) {
        buscarInput.addEventListener("input", () => {
            const texto = buscarInput.value.trim().toLowerCase();
            const filtradas = solicitudes.filter(s =>
                s.nombre_solicitante.toLowerCase().includes(texto)
            );
            renderizarTabla(filtradas);
        });
    }

    // --- Abrir modal con el detalle de una solicitud ---
    document.addEventListener("click", (e) => {
        if (e.target.closest(".verSolicitud")) {
            const boton = e.target.closest(".verSolicitud");
            const id = parseInt(boton.dataset.id);

            solicitudSeleccionada = solicitudes.find(s => s.id_solicitud === id);
            if (!solicitudSeleccionada) return;

            document.getElementById("infoNombre").textContent = solicitudSeleccionada.nombre_solicitante;
            document.getElementById("infoCedula").textContent = solicitudSeleccionada.identificacion;
            document.getElementById("infoCorreo").textContent = solicitudSeleccionada.correo || "N/A";
            document.getElementById("infoTelefono").textContent = solicitudSeleccionada.telefono;
            document.getElementById("infoProvincia").textContent = solicitudSeleccionada.provincia;
            document.getElementById("infoTipo").textContent = solicitudSeleccionada.tipo_ayuda;
            document.getElementById("infoPrioridad").textContent = solicitudSeleccionada.prioridad;
            document.getElementById("infoPersonas").textContent = solicitudSeleccionada.cantidad_personas;
            document.getElementById("infoFecha").textContent = solicitudSeleccionada.fecha_solicitud;
            document.getElementById("infoEstado").textContent = solicitudSeleccionada.estado;
            document.getElementById("infoDireccion").textContent = solicitudSeleccionada.direccion_exacta;
            document.getElementById("infoDescripcion").textContent = solicitudSeleccionada.descripcion_situacion;

            const modal = new bootstrap.Modal(document.getElementById("modalSolicitudAdmin"));
            modal.show();
        }
    });

    async function actualizarEstado(nuevoEstado) {
        if (!solicitudSeleccionada) return;

        try {
            const res = await fetch(base + "actualizar_solicitud.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_solicitud: solicitudSeleccionada.id_solicitud,
                    estado: nuevoEstado
                })
            });

            const json = await res.json();

            if (json.success) {
                await cargarSolicitudes();
                await cargarResumen();
                bootstrap.Modal.getInstance(document.getElementById("modalSolicitudAdmin")).hide();
            } else {
                alert(json.message);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    }

    document.getElementById("btnAprobarModal").addEventListener("click", () => actualizarEstado("APROBADA"));
    document.getElementById("btnRechazarModal").addEventListener("click", () => actualizarEstado("RECHAZADA"));

    if (btnActualizar) {
        btnActualizar.addEventListener("click", (e) => {
            e.preventDefault();
            cargarResumen();
            cargarSolicitudes();
            cargarUsuarios();
            cargarDonaciones();
        });
    }

    // --- Enviar notificación de campaña ---
    const formNotificacion = document.getElementById("formNotificacion");
    if (formNotificacion) {
        formNotificacion.addEventListener("submit", async (e) => {
            e.preventDefault();

            const titulo = document.getElementById("notifTitulo").value.trim();
            const tipo = document.getElementById("notifTipo").value;
            const mensaje = document.getElementById("notifMensaje").value.trim();

            try {
                const res = await fetch(base + "crear_notificacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ titulo, tipo, mensaje })
                });

                const json = await res.json();
                alert(json.message);

                if (json.success) {
                    formNotificacion.reset();
                }
            } catch (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    // --- Cargar voluntarios ---
    async function cargarVoluntarios() {
        const tablaVoluntarios = document.getElementById("tablaVoluntarios");
        if (!tablaVoluntarios) return;

        try {
            const res = await fetch(base + "listar_voluntarios.php");
            const json = await res.json();

            if (!json.success || json.data.length === 0) {
                tablaVoluntarios.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay registros todavía.</td></tr>`;
                return;
            }

            tablaVoluntarios.innerHTML = json.data.map(v => `
                <tr>
                    <td>${v.nombre}</td>
                    <td>${v.correo}<br><small class="text-muted">${v.telefono}</small></td>
                    <td>${v.tipo_apoyo}</td>
                    <td>${v.disponibilidad || '—'}</td>
                    <td>${v.fecha_registro}</td>
                </tr>
            `).join("");

        } catch (error) {
            tablaVoluntarios.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al conectar con el servidor</td></tr>`;
        }
    }

    // --- Carga inicial ---
    cargarResumen();
    cargarSolicitudes();
    cargarUsuarios();
    cargarDonaciones();
    cargarVoluntarios();

});