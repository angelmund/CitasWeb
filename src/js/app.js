let paso=1; //indica el paso que se quiere mostrar, en este caso el paso 1 es el que se muestra
const pasoInical = 1;
const pasoFinal = 3;

const cita = {
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
    nombreCliente(); //añade el nombre del cliente al objeto de cita
    seleccionarFecha();//añade la fecha en el objeto 
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
    if(paso==1){
        paginaAnterior.classList.add ('ocultar');
        //paginaSiguiente.classList.add ('ocultar');
    }else if(paso == 3 ) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
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
    console.log(cita);
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
            mostrarAlerta('Fines de semana no permitidos', 'error');
            
        }else{
            cita.fecha = e.target.value;
            
        } 
    }); 
}


function mostrarAlerta(mensaje, tipo){
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia)return;

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const formulario = document.querySelector('#paso-2 p'); //selecciona el formulario
    formulario.appendChild(alerta);

    //tiempo que dura el mensaje en mostrarse en caso de elegir sbdo o domingo
    setTimeout(() =>{
        alerta.remove();
    }, 3000);
    
}