/* ==========================================================================

   ENCARGADO: Jorge Andres Duarte
   
   ========================================================================== */

// --- 1. REFERENCIAS A ELEMENTOS DEL DOM (USO ESTRICTO DE CONST) ---
const tablaReportesCuerpo = document.getElementById("tablaReportesCuerpo");
const btnActualizarLista = document.getElementById("btnActualizarLista");
const btnVerReporte = document.getElementById("btnVerReporte");
const inputIDUsuario = document.getElementById("inputIDUsuario");
const contenedorAlertas = document.getElementById("contenedorAlertas");
const detalleReporteUsuario = document.getElementById("detalleReporteUsuario");

// Referencias para el formulario opcional de registro de nuevos reportes
const formNuevoReporte = document.getElementById("formNuevoReporte");
const inputID = document.getElementById("inputID");
const inputRecolectado = document.getElementById("inputRecolectado");
const inputEntregado = document.getElementById("inputEntregado");
const inputDesperdiciado = document.getElementById("inputDesperdiciado");

/* ==========================================================================
   ESTRUCTURA DE DATOS EN MEMORIA (USO DE LET PARA EL ARREGLO)
   Se inicializa con los datos exactos del Prototipo de Diseño (3. Reportes.png)
   ========================================================================== */
let historialReportes = [];

async function cargarBalances() {
    try {
        const res = await fetch("../api/obtener_balances.php");
        const json = await res.json();
        if (json.success && json.data) {
            historialReportes = json.data.map(item => ({
                id: String(item.id_responsable), // Convertimos a string para búsqueda
                recolectado: parseFloat(item.recolectados_kg),
                entregado: parseFloat(item.entregados_kg),
                desperdiciado: parseFloat(item.desperdiciados_kg),
                fecha: item.fecha_registro
            }));
            renderizarTabla();
        } else {
            console.error("No se pudo cargar la data", json.message);
        }
    } catch (e) {
        console.error("Error al cargar balances:", e);
    }
}

/* ==========================================================================
   FUNCIÓN DE RENDERIZADO EN EL DOM (USO DE TEMPLATE LITERALS)
   Recorre el arreglo en memoria y construye las filas de la tabla
   ========================================================================== */
function renderizarTabla() {
    tablaReportesCuerpo.innerHTML = "";

    // Ciclo tradicional para recorrer el arreglo de reportes
    for (let i = 0; i < historialReportes.length; i++) {
        const reporte = historialReportes[i];

        const filaHTML = `
            <tr>
                <td>
                    <div class="celda-flex">
                        <span class="cantidad">${reporte.recolectado} kg</span>
                        <span class="fecha">${reporte.fecha}</span>
                    </div>
                </td>
                <td>
                    <div class="celda-flex">
                        <span class="cantidad">${reporte.entregado} kg</span>
                        <span class="fecha">${reporte.fecha}</span>
                    </div>
                </td>
                <td>
                    <div class="celda-flex">
                        <span class="cantidad">${reporte.desperdiciado} kg</span>
                        <span class="fecha">${reporte.fecha}</span>
                    </div>
                </td>
            </tr>
        `;

        tablaReportesCuerpo.innerHTML += filaHTML;
    }
}

/* ==========================================================================
   MÓDULO DE ALERTAS VISUALES CON BOOTSTRAP 5
   ========================================================================== */
function mostrarAlerta(mensaje, tipo) {
    contenedorAlertas.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show fw-bold shadow-sm" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;

    setTimeout(function () {
        contenedorAlertas.innerHTML = "";
    }, 4000);
}

/* ==========================================================================
   EVENTOS DE INTERACCIÓN DEL USUARIO
   ========================================================================== */

// 1. Evento para el botón "Actualizar lista"
btnActualizarLista.addEventListener("click", function (event) {
    event.preventDefault();
    cargarBalances();
    mostrarAlerta(`<i class="bi bi-check-circle-fill me-2"></i> Lista de reportes actualizada desde la base de datos.`, "success");
});

// 2. Evento para el botón "Ver mi reporte" (Filtrado por ID)
btnVerReporte.addEventListener("click", function (event) {
    event.preventDefault();

    const idBuscado = inputIDUsuario.value.trim().toUpperCase();

    if (idBuscado === "") {
        mostrarAlerta(`<i class="bi bi-exclamation-triangle-fill me-2"></i> Debe ingresar su ID de usuario (Ej: USR-001) para consultar su reporte.`, "warning");
        return;
    }

    let totalRecolectado = 0;
    let totalEntregado = 0;
    let totalDesperdiciado = 0;
    let registrosEncontrados = 0;

    for (let i = 0; i < historialReportes.length; i++) {
        if (historialReportes[i].id.toUpperCase() === idBuscado) {
            totalRecolectado += historialReportes[i].recolectado;
            totalEntregado += historialReportes[i].entregado;
            totalDesperdiciado += historialReportes[i].desperdiciado;
            registrosEncontrados++;
        }
    }

    if (registrosEncontrados === 0) {
        detalleReporteUsuario.innerHTML = "";
        mostrarAlerta(`<i class="bi bi-info-circle-fill me-2"></i> No se encontraron reportes registrados para el ID de Usuario BD: <strong>${idBuscado}</strong>. (Ingrese solo números si son usuarios de BD).`, "info");
        return;
    }

    const tarjetaDetalleHTML = `
        <div class="card border-0 shadow bg-light">
            <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold"><i class="bi bi-person-lines-fill me-2"></i> Reporte Individual de Actividad</h5>
                <span class="badge bg-success fs-6">ID: ${idBuscado} (${registrosEncontrados} registros)</span>
            </div>
            <div class="card-body p-4">
                <div class="row text-center g-3">
                    <div class="col-md-4">
                        <div class="p-3 rounded bg-white border border-success shadow-sm">
                            <h6 class="text-muted fw-bold">TOTAL RECOLECTADO</h6>
                            <h3 class="fw-bold text-success mb-0">${totalRecolectado} kg</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 rounded bg-white border border-warning shadow-sm">
                            <h6 class="text-muted fw-bold">TOTAL ENTREGADO</h6>
                            <h3 class="fw-bold text-warning mb-0" style="color: #f38b1b !important;">${totalEntregado} kg</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 rounded bg-white border border-info shadow-sm">
                            <h6 class="text-muted fw-bold">TOTAL DESPERDICIADO</h6>
                            <h3 class="fw-bold text-info mb-0" style="color: #1aa1d8 !important;">${totalDesperdiciado} kg</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    detalleReporteUsuario.innerHTML = tarjetaDetalleHTML;
    mostrarAlerta(`<i class="bi bi-person-check-fill me-2"></i> Reporte generado exitosamente para el usuario <strong>${idBuscado}</strong>.`, "success");
});

// 3. Evento opcional para registrar un nuevo balance de alimentos en el arreglo
if (formNuevoReporte) {
    formNuevoReporte.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = inputID.value.trim().toUpperCase();
        const recolectado = parseInt(inputRecolectado.value);
        const entregado = parseInt(inputEntregado.value);
        const desperdiciado = parseInt(inputDesperdiciado.value);

        if (recolectado < 0 || entregado < 0 || desperdiciado < 0) {
            mostrarAlerta(`<i class="bi bi-exclamation-circle-fill me-2"></i> Las cantidades de alimentos no pueden ser números negativos.`, "warning");
            return;
        }

        const payload = {
            id_responsable: id, // Esperamos que sea un número para la BD
            recolectados_kg: recolectado,
            entregados_kg: entregado,
            desperdiciados_kg: desperdiciado
        };

        const btnGuardar = formNuevoReporte.querySelector('button[type="submit"]');
        if (btnGuardar) {
            btnGuardar.disabled = true;
            btnGuardar.textContent = 'Guardando...';
        }

        fetch('../api/guardar_balance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (btnGuardar) {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i> Registrar Balance';
            }
            
            if (data.success) {
                cargarBalances(); // Recargar datos reales
                formNuevoReporte.reset();
                mostrarAlerta(`<i class="bi bi-check-lg me-2"></i> ¡Nuevo balance registrado con éxito para el ID <strong>${id}</strong>!`, "success");
            } else {
                mostrarAlerta(`<i class="bi bi-exclamation-triangle me-2"></i> ${data.message}`, "danger");
            }
        })
        .catch(err => {
            if (btnGuardar) {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i> Registrar Balance';
            }
            mostrarAlerta('<i class="bi bi-wifi-off me-2"></i> Error de conexión con el servidor.', "danger");
        });
    });
}

// Inicialización
cargarBalances();

// --- Mostrar el formulario de registro de balance solo a administradores ---
(async function verificarRolParaBalance() {
    const seccionRegistrar = document.getElementById("seccionRegistrarBalance");
    if (!seccionRegistrar) return;

    try {
        const res = await fetch("../api/sesion.php");
        const datos = await res.json();

        if (datos.logueado && datos.usuario.rol === "ADMIN") {
            seccionRegistrar.classList.remove("d-none");
        }
    } catch (error) {
        console.error("No se pudo verificar la sesión:", error);
    }
})();