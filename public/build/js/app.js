let paso=1; //indica el paso que se quiere mostrar, en este caso el paso 1 es el que se muestra
const pasoInical = 1;
const pasoFinal = 3;

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    tabs(); //cambia la secci[on] cuando se presiona el tabs
    mostrarSeccion(); //muestra y oculta las secciones
    botonesPaginador(); //funcion para los botones de paginador
    paginaSiguiente();//BOTON 
    paginaAnterior();//BOTON
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