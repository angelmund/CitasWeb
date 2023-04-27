let paso = 1;

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
})

function iniciarApp() {
    tabs(); //Cambia la seccion cuando se presionen los tabs
}

function mostrarSeccion() {
    //selecionar la seccion con el paso 
    const pasoSelector = '#paso-${paso}'; //se puede usar este y abajo en lugar de #paso-${paso}, va el nombre de esta variable 
    const seccion =  document.querySelector('pasoSelector'); //'#paso-${paso} toma el nombre de la variable de mi html
    seccion.classList.add('mostrar'); //en scss est[a] 'mostrar'
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    
    botones.forEach( boton =>{
        boton.addEventListener('click', function(e){
           paso = parseInt( e.target.dataset.paso);
           
           mostrarSeccion(); 
        })
    });
}