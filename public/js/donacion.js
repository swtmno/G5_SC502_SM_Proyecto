document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const radioMensual = document.getElementById('radioMensual');
    const radioUnica = document.getElementById('radioUnica');
    const contenedorMensual = document.getElementById('contenedor-mensual');
    const contenedorUnica = document.getElementById('contenedor-unica');
    const btnTotal = document.getElementById('btnTotal');
    const formTarjeta = document.getElementById('formTarjeta');
    const errorMonto = document.getElementById('errorMonto');

    let montoActual = 5000;
    let esMensual = true; // Empezamos en donación mensual por defecto

    // 1. Función para actualizar el botón de pago
    const actualizarBoton = () => {
        if (isNaN(montoActual) || montoActual <= 0) {
            btnTotal.textContent = esMensual ? '₡0 / mes' : '₡0';
            return;
        }

        const montoFormateado = `₡${montoActual.toLocaleString('es-CR')}`;
        btnTotal.textContent = esMensual ? `${montoFormateado} / mes` : montoFormateado;
    };

    // 2. Cambiar entre Mensual y Única
    const alternarFrecuencia = () => {
        esMensual = radioMensual.checked;
        
        if (esMensual) {
            contenedorMensual.classList.remove('d-none');
            contenedorUnica.classList.add('d-none');
            
            // Buscar la opción activa dentro de mensual
            const activa = contenedorMensual.querySelector('.tarjeta-donacion.activo');
            montoActual = activa ? parseFloat(activa.getAttribute('data-monto')) : 0;
            
            // Si hay un valor en el input libre mensual, usar ese
            const inputLibreMensual = contenedorMensual.querySelector('.input-libre').value;
            if (inputLibreMensual && !activa) montoActual = parseFloat(inputLibreMensual);

        } else {
            contenedorUnica.classList.remove('d-none');
            contenedorMensual.classList.add('d-none');
            
            // Preseleccionar la primera opción de donación única si ninguna está seleccionada
            let activa = contenedorUnica.querySelector('.tarjeta-donacion.activo');
            if (!activa) {
                const primeraOpcion = contenedorUnica.querySelector('.tarjeta-donacion[data-monto]');
                primeraOpcion.classList.add('activo');
                activa = primeraOpcion;
            }
            montoActual = activa ? parseFloat(activa.getAttribute('data-monto')) : 0;
            
            // Si hay un valor en el input libre único, usar ese
            const inputLibreUnico = contenedorUnica.querySelector('.input-libre').value;
            if (inputLibreUnico && !activa) montoActual = parseFloat(inputLibreUnico);
        }
        
        actualizarBoton();
    };

    radioMensual.addEventListener('change', alternarFrecuencia);
    radioUnica.addEventListener('change', alternarFrecuencia);

    // 3. Lógica para seleccionar las tarjetas predefinidas
    document.querySelectorAll('.tarjeta-donacion[data-monto]').forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const contenedorPadre = this.closest('.frecuencia-contenedor');
            
            // Quitar clase activo a las demás y limpiar input libre
            contenedorPadre.querySelectorAll('.tarjeta-donacion').forEach(t => t.classList.remove('activo'));
            const inputLibre = contenedorPadre.querySelector('.input-libre');
            if (inputLibre) inputLibre.value = '';

            // Activar la seleccionada
            this.classList.add('activo');
            montoActual = parseFloat(this.getAttribute('data-monto'));
            
            errorMonto.classList.add('d-none');
            actualizarBoton();
        });
    });

    // 4. Lógica para los inputs de "Monto Libre"
    document.querySelectorAll('.input-libre').forEach(input => {
        input.addEventListener('input', function() {
            const contenedorPadre = this.closest('.frecuencia-contenedor');
            
            // Quitar la selección de las tarjetas predefinidas
            contenedorPadre.querySelectorAll('.tarjeta-donacion').forEach(t => t.classList.remove('activo'));
            
            const valorIngresado = parseFloat(this.value);
            montoActual = isNaN(valorIngresado) ? 0 : valorIngresado;
            actualizarBoton();

            // Validar monto mayor a 0
            if (valorIngresado > 0) {
                errorMonto.classList.add('d-none');
                this.classList.remove('is-invalid');
            } else if (this.value !== '') {
                errorMonto.classList.remove('d-none');
                this.classList.add('is-invalid');
            }
        });
    });

    // 5. Validación final al enviar el formulario de tarjeta
    formTarjeta.addEventListener('submit', (e) => {
        e.preventDefault(); // Detener envío por defecto
        
        if (isNaN(montoActual) || montoActual <= 0) {
            errorMonto.classList.remove('d-none');
            
            // Marcar en rojo el input libre si está visible y vacío/inválido
            const inputVisible = esMensual 
                ? contenedorMensual.querySelector('.input-libre') 
                : contenedorUnica.querySelector('.input-libre');
                
            if (!document.querySelector('.tarjeta-donacion.activo')) {
                inputVisible.classList.add('is-invalid');
            }
            return;
        }

        const tipoDonacion = esMensual ? 'recurrente' : 'única';
        alert(`¡Gracias por tu donación ${tipoDonacion} de ₡${montoActual.toLocaleString('es-CR')}! Procesando pago...`);
        // formTarjeta.submit(); // Descomentar al integrar con backend
    });

    // Inicializar el botón al cargar
    actualizarBoton();
});