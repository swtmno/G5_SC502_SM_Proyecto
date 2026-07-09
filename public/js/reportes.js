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
let historialReportes = [
    { id: "USR-001", recolectado: 1243, entregado: 1003, desperdiciado: 56, fecha: "2025/12/01" },
    { id: "USR-002", recolectado: 567, entregado: 460, desperdiciado: 25, fecha: "2025/12/01" },
    { id: "USR-001", recolectado: 267, entregado: 192, desperdiciado: 98, fecha: "2025/12/01" },
    { id: "USR-003", recolectado: 456, entregado: 456, desperdiciado: 11, fecha: "2025/12/01" },
    { id: "USR-002", recolectado: 121, entregado: 78, desperdiciado: 19, fecha: "2025/12/01" },
    { id: "USR-001", recolectado: 321, entregado: 233, desperdiciado: 34, fecha: "2025/12/01" },
    { id: "USR-004", recolectado: 432, entregado: 304, desperdiciado: 66, fecha: "2025/12/01" }
];

/* ==========================================================================
   FUNCIÓN DE RENDERIZADO EN EL DOM (USO DE TEMPLATE LITERALS)
   Recorre el arreglo en memoria y construye las filas de la tabla
   ========================================================================== */
function renderizarTabla() {
    // Limpiamos el contenido actual del cuerpo de la tabla
    tablaReportesCuerpo.innerHTML = "";

    // Ciclo tradicional para recorrer el arreglo de reportes
    for (let i = 0; i < historialReportes.length; i++) {
        const reporte = historialReportes[i];

        // Construcción limpia con comillas invertidas (backticks) e interpolación
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

        // Inyección de la fila dentro de la tabla
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

    // Ocultar alerta automáticamente después de 4 segundos
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

    renderizarTabla();
    mostrarAlerta(`<i class="bi bi-check-circle-fill me-2"></i> Lista de reportes actualizada correctamente desde memoria.`, "success");
});

// 2. Evento para el botón "Ver mi reporte" (Filtrado por ID)
btnVerReporte.addEventListener("click", function (event) {
    event.preventDefault();

    const idBuscado = inputIDUsuario.value.trim().toUpperCase();

    // Validación de campo vacío
    if (idBuscado === "") {
        mostrarAlerta(`<i class="bi bi-exclamation-triangle-fill me-2"></i> Debe ingresar su ID de usuario (Ej: USR-001) para consultar su reporte.`, "warning");
        return;
    }

    // Variables acumuladoras para calcular el total del usuario
    let totalRecolectado = 0;
    let totalEntregado = 0;
    let totalDesperdiciado = 0;
    let registrosEncontrados = 0;

    // Recorrido del arreglo buscando coincidencias
    for (let i = 0; i < historialReportes.length; i++) {
        if (historialReportes[i].id.toUpperCase() === idBuscado) {
            totalRecolectado += historialReportes[i].recolectado;
            totalEntregado += historialReportes[i].entregado;
            totalDesperdiciado += historialReportes[i].desperdiciado;
            registrosEncontrados++;
        }
    }

    // Validación si no se encontraron registros
    if (registrosEncontrados === 0) {
        detalleReporteUsuario.innerHTML = "";
        mostrarAlerta(`<i class="bi bi-info-circle-fill me-2"></i> No se encontraron reportes registrados para el ID: <strong>${idBuscado}</strong>. (Prueba con USR-001, USR-002 o USR-003).`, "info");
        return;
    }

    // Renderizado del resumen analítico personal
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

// 3. Evento opcional para registrar un nuevo reporte en el arreglo (Demuestra CRUD en memoria)
if (formNuevoReporte) {
    formNuevoReporte.addEventListener("submit", function (event) {
        event.preventDefault();

        const id = inputID.value.trim().toUpperCase();
        const recolectado = parseInt(inputRecolectado.value);
        const entregado = parseInt(inputEntregado.value);
        const desperdiciado = parseInt(inputDesperdiciado.value);

        // Validación de números negativos
        if (recolectado < 0 || entregado < 0 || desperdiciado < 0) {
            mostrarAlerta(`<i class="bi bi-exclamation-circle-fill me-2"></i> Las cantidades de alimentos no pueden ser números negativos.`, "warning");
            return;
        }

        // Obtención de fecha actual en formato YYYY/MM/DD
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");
        const fechaActual = `${anio}/${mes}/${dia}`;

        // Creación del nuevo objeto con la sintaxis del profesor
        const nuevoReporte = {
            id: id,
            recolectado: recolectado,
            entregado: entregado,
            desperdiciado: desperdiciado,
            fecha: fechaActual
        };

        // Guardar en el arreglo en memoria y refrescar tabla
        historialReportes.push(nuevoReporte);
        renderizarTabla();
        formNuevoReporte.reset();

        mostrarAlerta(`<i class="bi bi-check-lg me-2"></i> ¡Nuevo balance registrado con éxito para el ID <strong>${id}</strong>!`, "success");
    });
}

/* ==========================================================================
   INICIALIZACIÓN DEL SISTEMA
   Carga la tabla automáticamente al abrir la página por primera vez
   ========================================================================== */
renderizarTabla();