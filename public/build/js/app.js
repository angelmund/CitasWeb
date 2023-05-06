let paso=1; //indica el paso que se quiere mostrar, en este caso el paso 1 es el que se muestra

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    tabs(); //cambia la secci[on] cuando se presiona el tabs
    mostrarSeccion(); //muestra y oculta las secciones
}
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
}


//detecta en que button se hace click 
function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton =>{
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso); //identifica en que paso est[a]
            mostrarSeccion();
            
        });
    })
}