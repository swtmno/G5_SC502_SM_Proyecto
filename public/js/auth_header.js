(function () {

    const base = window.API_BASE || "api/";

    const elUsuario = document.getElementById("navUsuarioInfo");
    const elIngresar = document.getElementById("navIngresar");
    const elCerrar = document.getElementById("navCerrarSesion");
    const elAdmin = document.getElementById("navAdminItem");

    async function cargarSesion() {
        try {
            const respuesta = await fetch(base + "sesion.php");
            const datos = await respuesta.json();

            if (datos.logueado) {
                if (elUsuario) {
                    elUsuario.textContent = datos.usuario.nombre + " (" + datos.usuario.rol + ")";
                    elUsuario.classList.remove("d-none");
                }
                if (elIngresar) {
                    elIngresar.classList.add("d-none");
                }
                if (elCerrar) {
                    elCerrar.classList.remove("d-none");
                }
                if (elAdmin && datos.usuario.rol === "ADMIN") {
                    elAdmin.classList.remove("d-none");
                }
            }
        } catch (error) {
            console.error("Error al verificar la sesión:", error);
        }
    }

    if (elCerrar) {
        elCerrar.addEventListener("click", async function (event) {
            event.preventDefault();
            try {
                await fetch(base + "logout.php");
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
            window.location.reload();
        });
    }

    cargarSesion();

})();