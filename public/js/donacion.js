//<!-- Encargado de la página:  Monica Garcia Garcia-->

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const radioMensual = document.getElementById('radioMensual');
    const radioUnica = document.getElementById('radioUnica');
    const contenedorMensual = document.getElementById('contenedor-mensual');
    const contenedorUnica = document.getElementById('contenedor-unica');
    const btnTotal = document.getElementById('btnTotal');
    const formTarjeta = document.getElementById('formTarjeta');
    const errorMonto = document.getElementById('errorMonto');

    // Referencias a inputs de tarjeta
    const inputTarjeta = formTarjeta.querySelector('input[placeholder="0000 0000 0000 0000"]');
    const inputExp = formTarjeta.querySelector('input[placeholder="09/28"]');
    const inputCvv = formTarjeta.querySelector('input[placeholder="123"]');

    let montoActual = 5000;
    let esMensual = true; // Empezamos en donación mensual por defecto

    // 0. FORMATO AUTOMÁTICO DE CAMPOS
    inputTarjeta.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
        e.target.value = valor.match(/.{1,4}/g)?.join(' ') || '';
    });

    inputExp.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) {
            e.target.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
        } else {
            e.target.value = valor;
        }
    });

    // 1. Función para actualizar el botón de pago
    const actualizarBoton = () => {
        const montoFormateado = `₡${montoActual.toLocaleString('es-CR')}`;
        btnTotal.textContent = esMensual ? `${montoFormateado} / mes` : montoFormateado;
    };

    // 2. Cambiar entre Mensual y Única
const alternarFrecuencia = () => {
        esMensual = radioMensual.checked;
        contenedorMensual.classList.toggle('d-none', !esMensual);
        contenedorUnica.classList.toggle('d-none', esMensual);
        const activa = (esMensual ? contenedorMensual : contenedorUnica).querySelector('.tarjeta-donacion.activo');
        montoActual = activa ? parseFloat(activa.getAttribute('data-monto')) : 0;
        actualizarBoton();
    };

    radioMensual.addEventListener('change', alternarFrecuencia);
    radioUnica.addEventListener('change', alternarFrecuencia);

    // 3. Lógica para seleccionar las tarjetas predefinidas
    document.querySelectorAll('.tarjeta-donacion[data-monto]').forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const contenedorPadre = this.closest('.frecuencia-contenedor');
            contenedorPadre.querySelectorAll('.tarjeta-donacion').forEach(t => t.classList.remove('activo'));
            contenedorPadre.querySelector('.input-libre').value = '';
            this.classList.add('activo');
            montoActual = parseFloat(this.getAttribute('data-monto'));
            errorMonto.classList.add('d-none');
            actualizarBoton();
        });
    });

    // 4. Lógica para los inputs de "Monto Libre"
    document.querySelectorAll('.input-libre').forEach(input => {
        input.addEventListener('input', function() {
            this.closest('.frecuencia-contenedor').querySelectorAll('.tarjeta-donacion').forEach(t => t.classList.remove('activo'));
            montoActual = parseFloat(this.value) || 0;
            actualizarBoton();
            if (montoActual > 0) errorMonto.classList.add('d-none');
        });
    });

    // 5. Validación final al enviar el formulario de tarjeta
    formTarjeta.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let valido = true;

        if (inputTarjeta.value.length < 19) {
                 valido = false; inputTarjeta.classList.add('is-invalid'); 
                }
        else { 
            inputTarjeta.classList.remove('is-invalid'); 
        }

        if (inputExp.value.length < 5) { 
                valido = false; inputExp.classList.add('is-invalid'); 
            }

        else { 
            inputExp.classList.remove('is-invalid'); 
        }

        if (inputCvv.value.length < 3) { 
                valido = false; inputCvv.classList.add('is-invalid'); 
            }

        else { 
            inputCvv.classList.remove('is-invalid'); 
        }

        if (isNaN(montoActual) || montoActual <= 0) {
            valido = false;
            errorMonto.classList.remove('d-none');
        }

        if (valido) {
            // Preparar datos para el backend
            const payload = {
                categoria: 'Monetaria', // Siempre Monetaria en esta vista
                tipo_frecuencia: esMensual ? 'Mensual' : 'Única',
                metodo_pago: 'Tarjeta',
                monto: montoActual,
                plan_mensual: esMensual ? (document.querySelector('.tarjeta-donacion.activo h5')?.textContent || 'Monto Libre') : 'N/A'
            };

            btnTotal.disabled = true;
            btnTotal.textContent = "Procesando...";

            fetch('../api/guardar_donacion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                btnTotal.disabled = false;
                actualizarBoton();
                if (data.success) {
                    const modalDonacion = new bootstrap.Modal(document.getElementById('modalDonacion'));
                    modalDonacion.show();
                    formTarjeta.reset();
                    montoActual = 0;
                    actualizarBoton();
                } else {
                    alert(data.message || 'Error al registrar donación');
                }
            })
            .catch(err => {
                btnTotal.disabled = false;
                actualizarBoton();
                alert('Error de conexión.');
            });
        }
    });

    // Inicializar el botón al cargar
    actualizarBoton();
});