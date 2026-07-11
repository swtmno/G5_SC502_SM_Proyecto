
document.addEventListener('DOMContentLoaded', function () {
    const formRegistro = document.getElementById('formRegistro');
    const mensajeExito = document.getElementById('mensajeExito');

    if (formRegistro) {
        formRegistro.addEventListener('submit', function (event) {
            event.preventDefault(); 
            
            formRegistro.classList.add('d-none');
            mensajeExito.classList.remove('d-none');
        });
    }
});