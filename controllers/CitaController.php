<?php

namespace Controllers;

use MVC\Router;

class CitaController{
    public static function index(Router $router){
        //hace que muestre el nombre del cliente
        //es decir inicia sesión con esta función
        if (!$_SESSION['nombre']) {
            session_start();
          }

        $router->render('cita/index',[
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}//