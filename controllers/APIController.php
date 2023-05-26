<?php
namespace Controllers;

use Model\Cita;
use Model\Servicio;

class APIController{
    //consulta la API
    public static function index(){
        $servicios = Servicio::all();
        
        echo json_encode($servicios);
    }

    //guarda datos 
    public static function guardar(){
        $cita = new Cita($_POST);
        debuguear($cita);
        $resultado = $cita->guardar();
        echo json_encode($resultado);
    }
}

