//const { resume } = require("browser-sync");

let paso=1; //indica el paso que se quiere mostrar, en este caso el paso 1 es el que se muestra
const pasoInical = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora:'',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    tabs(); //cambia la secci[on] cuando se presiona el tabs
    mostrarSeccion(); //muestra y oculta las secciones
    botonesPaginador(); //funcion para los botones de paginador
    paginaSiguiente();//BOTON 
    paginaAnterior();//BOTON

    consultarAPI();  //consulta la API del backend de php
    idCliente();
    nombreCliente(); //añade el nombre del cliente al objeto de cita
    seleccionarFecha();//añade la fecha en el objeto 
    seleccionarHora(); //añade la hora de la cita en el objeto

    mostrarResumen(); //muestra los servicios, fecha y hora seleccinados por el usuario
}

//muestra un mensaje en la conexi[on] de base de datos 
function conexionBD(){


    const mostrarAlerta = document.querySelector('#error-container');
     //scriptin para crear la alerta
     mostrarAlerta('No hay conexion a la base de datos', 'error', '/');
 
}


// Hace que se muestren los pasos  aqui empieza
//hace que se muestre una seccion al dar click en el buttton
function mostrarSeccion(){
    //Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar'); //lleva .mostrar solo cuando es el selector
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar'); //si encunetra una seccion mostrar, oculta, si no,no hace nada 
    }
    // aqui termina Ocultar la seccion que tenga la clase mostrar

    //selecciona la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');
    //quita la clase anterior y deja de estar sobreado
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    //hace que se sobree el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}


//detecta en que button se hace click 
function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton =>{
        boton.addEventListener('click', function(e){
            e.preventDefault();

            paso = parseInt(e.target.dataset.paso); //identifica en que paso est[a]
            mostrarSeccion();
            
            botonesPaginador(); //funcion para que se ocultem los botones cada vez que se de click en un paso
        });
    })
} //aqui termina lo de mostrar pasos 

//hace que aparezcan y desaparezcan los botones de anterior y siguiente
function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');
    //si estamos en el paso num 1
    if(paso===1){
        paginaAnterior.classList.add ('ocultar');
        //paginaSiguiente.classList.add ('ocultar');
    }else if(paso === 3 ) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    }else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } // aqui termina hace que aparezcan y desaparezcan los botones de anterior y siguiente
    mostrarSeccion();
}

function  paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener ('click', function(){
        if(paso <= pasoInical) return;
        paso--;
        botonesPaginador();    
    })
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener ('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();    
    })
}

//Esta función hace que se ejecute y que se ejecuten otras funciones para consultas
async function consultarAPI(){
    try {
        const url =  'http://localhost:3000/api/servicios';
        //await espera hasta que descargues 
        const resultado = await fetch(url); //el await solo funciona si la funcion tiene async en la funcion 
        const servicios = await resultado.json();
        mostrarServicios(servicios);
        
    } catch (error) {
        console.log(error);
    }
}///Esta función hace que se ejecute y que se ejecuten otras funciones para consultas

function mostrarServicios(servicios){
    
    
    servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio; 
        
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent =nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`; //intecta la variable precio y aparece el signo de 

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio  = id;
         //hace que se realicela funcion cuando se selecciona el div
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    
    });  
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    
    //extrae el arrgelo de servicios 
    const { servicios} = cita; //manda a llamar cita, ya que en el se guardan los servicios que se vayan seleccionando
    //toma la copia de servicios y lo agrega al objeto servicio y cre un solo arreglo
    
    //identifica al elemento que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`); 
    //comprueba si un servicio ya fue seleccionado o no
    //se comprueba a traves de un arrayMethod
    if(servicios.some(agregado => agregado.id === id)){ //some hace que retorne un true o false si un objeto  en caso de que exita o no en el arreglo
        //elimminar de los disponibles
        cita.servicios = servicios.filter(agregado => agregado.id !=id);
        divServicio.classList.remove('seleccionado'); //elimina el somreado
    }else{
        //agregar servicio
        cita.servicios = [...servicios, servicio]; //toma una copia de los servicios y agrega un servicio
        divServicio.classList.add('seleccionado'); //se pone de color oscuro el servicio seleccionado
    }
    //console.log(cita);
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        
        const dia = new Date(e.target.value).getUTCDay();
        
        if( [6, 0].includes(dia) ){
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
            
        }else{
            cita.fecha = e.target.value;
            
        } 
    }); 
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        console.log(e.target.value);

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];  //sirve para separar una cadena split()
        if(hora <10 || hora >18){
            e.target.value = ''; //evita que se muestre la hora que no es v[a]lida
            mostrarAlerta('Hora no Valida', 'error', '.formulario');
        }else{
            cita.hora = e.target.value;

            //console.log(cita);
        }
    })
}



//muestra el mensaje de error en caso de elegir un fin de semana 
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
   //previene que se genere m[as] de una alerta 
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    }

    //scriptin para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento); //muestra el mensaje en la parte de abajo 
    referencia.appendChild(alerta);

    if(desaparece){
        
    //tiempo que dura el mensaje en mostrarse en caso de elegir sbdo o domingo
        setTimeout(() =>{
            alerta.remove();
        }, 3000); //eleimina la alerta 
    }


}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    //limpia el [a]rea de mostrar resumen para mostrar los servicios y fechas seleccionadas
   // Limpiar el Contenido de Resumen

    while(resumen.firstChild) {

        resumen.removeChild(resumen.firstChild);
        
    }

    //cita.servicios.length verifica si el string esta vacio
    if(Object.values(cita).includes('') || cita.servicios.length ===0){ //Object verifica si hay un string vacio
        //si alguno de los campos es vacio
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora','error', '.contenido-resumen', false);
        return;
    }
    
    //FORMATEAR EL DIV de resumen
    const{nombre, fecha,hora,servicios } =cita;

    
    //Heading para servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);


    //Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        // esto se crea dentro de un div
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textServicio = document.createElement('P');
        textServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio</span> $${precio}`;

        contenedorServicio.appendChild(textServicio);
        contenedorServicio.appendChild(precioServicio);// aqui termina esto se crea dentro de un div
        
        resumen.appendChild(contenedorServicio);
    });

     //Heading para servicios en Resumen
     const headingCita = document.createElement('H3');
     headingCita.textContent = 'Resumen de Cita';
     resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span> Nombre:</span> ${nombre}`; //muestra el nombre 
    
    //formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();
    
    const fechaUTC = new Date(Date.UTC(year,mes,dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'} //muestra la fecha en espa;ol
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);//es-MX es el lenguaje espa;ol mexico, para cambiar a inglés, se pone 'en-US'
    console.log(fechaFormateada);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span> Fecha:</span> ${fechaFormateada}`; //muestra la fecha
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span> Hora:</span> ${hora} Horas`; //muestra la hora

    //boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    //es para que se muestren en la pag el nombe, hora y fecha
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita); //aqui termina 

    resumen.appendChild(botonReservar);

}

async function reservarCita(){
    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio => servicio.id);
    

    const datos = new FormData();
    
    datos.append('fecha', fecha); //agrega la fecha
    datos.append('hora', hora); //agrega la hora
    datos.append('usuarioId', id); //agrega el id
    datos.append('servicios', idServicios); //agrega la hora
   
    //console.log([...datos]);
    //return;

    //PETICION HACIA LA API
    const url = 'http://localhost:3000/api/citas'
    const respuesta = await fetch(url, {
        method: 'POST',
        body:datos //detecta los datos que se tienen 
    });
    
    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if(resultado.resultado){
        Swal.fire({
            icon: 'success',
            title: 'Cita Creada',
            text: 'Tu cita fue creada correctamente',
            button: 'OK'
        });
    }

    //console.log([...datos]); toma una copia de lo que hay en datos

}