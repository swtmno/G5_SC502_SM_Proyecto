//<!-- Encargado de la página:  Mary Paz-->

document.addEventListener("DOMContentLoaded",()=>{


let solicitudes =
JSON.parse(localStorage.getItem("solicitudes")) || [];



const tabla =
document.getElementById("tablaSolicitudes");



let solicitudSeleccionada = null;



//Tabla


function cargarSolicitudes(){


solicitudes =
JSON.parse(localStorage.getItem("solicitudes")) || [];

tabla.innerHTML="";



solicitudes.forEach((s,index)=>{


tabla.innerHTML += `

<tr>


<td>#${index+1}</td>


<td>${s.nombre}</td>


<td>${s.tipoAyuda}</td>


<td>${s.provincia}</td>



<td>


<span class="badge 
${s.estado=="Aprobada" 
? "bg-success" 
: s.estado=="Rechazada"
? "bg-danger"
: "bg-warning"}">

${s.estado}

</span>


</td>



<td>


<button 
class="btn btn-secondary btn-sm verSolicitud"
data-id="${index}">

<i class="bi bi-eye"></i>

</button>


</td>


</tr>


`;

});


}


cargarSolicitudes();




//Modal



document.addEventListener("click",(e)=>{


if(e.target.closest(".verSolicitud")){


let boton =
e.target.closest(".verSolicitud");


let id =
boton.dataset.id;



solicitudSeleccionada=id;



let s =
solicitudes[id];



document.getElementById("infoNombre").textContent=s.nombre;

document.getElementById("infoCedula").textContent=s.cedula;

document.getElementById("infoCorreo").textContent=s.correo;

document.getElementById("infoTelefono").textContent=s.telefono;

document.getElementById("infoProvincia").textContent=s.provincia;

document.getElementById("infoTipo").textContent=s.tipoAyuda;

document.getElementById("infoPrioridad").textContent=s.prioridad;

document.getElementById("infoPersonas").textContent=s.personas;

document.getElementById("infoFecha").textContent=s.fecha;

document.getElementById("infoEstado").textContent=s.estado;

document.getElementById("infoDireccion").textContent=s.direccion;

document.getElementById("infoDescripcion").textContent=s.descripcion;



let modal =
new bootstrap.Modal(
document.getElementById("modalSolicitudAdmin")
);


modal.show();


}


});




//aprobar


document.getElementById("btnAprobarModal")
.addEventListener("click",()=>{


if(solicitudSeleccionada!==null){


solicitudes[solicitudSeleccionada].estado="Aprobada";


localStorage.setItem(
"solicitudes",
JSON.stringify(solicitudes)
);



cargarSolicitudes();


bootstrap.Modal
.getInstance(
document.getElementById("modalSolicitudAdmin")
)
.hide();


}


});




//rechazar


document.getElementById("btnRechazarModal")
.addEventListener("click",()=>{


if(solicitudSeleccionada!==null){


solicitudes[solicitudSeleccionada].estado="Rechazada";


localStorage.setItem(
"solicitudes",
JSON.stringify(solicitudes)
);



cargarSolicitudes();


bootstrap.Modal
.getInstance(
document.getElementById("modalSolicitudAdmin")
)
.hide();


}



});



});