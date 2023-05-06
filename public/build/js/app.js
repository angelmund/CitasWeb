let paso=1;

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    tabs(); //cambia la secci[on] cuando se presiona el tabs
    
}
//hace que se muestre una seccion al dar click en el buttton
function mostrarSeccion(){
    //selecciona la seccion con el paso
    const pasoSelector = '#paso-${paso}';
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