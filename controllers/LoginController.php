<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;


class LoginController {
    public static function Login(Router $router){
        $router->render('auth/login');
    }
    public static function Logout(){
        echo "Desde Logout";
    }
    public static function olvide_password(Router $router){
        $router->render('auth/olvide_password', [

        ]);
    }
    public static function recuperar(Router $router){
        $router->render('auth/olvide_password', [

        ]);
    }
    public static function crearcuenta(Router $router){
        
        $usuario = new Usuario;

       // debuguear($usuario);  sirve para ver datos en la pg
       //Alertas vacias  
       $alertas = [];
       if($_SERVER['REQUEST_METHOD'] === 'POST'){
            
            $usuario->sincronizar($_POST);
            $alertas =  $usuario->validarNuevaCuenta();
            //debuguear($usuario);

            //Revisar que alerta esté vacio
            if(empty($alertas)){
                //Verifica que no esté registardo
                $resultado = $usuario->existeUsuario();//el mtdo esta en model
            
                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                }else {
                    //el usuario no está registrado
                    //Hashear el password
                    $usuario->hashPassword();

                    //Generar un Token Unico
                    $usuario->crearToken();
                    
                    //Enviar el email
                    $email = new Email($usuario->email,$usuario
                        ->email,$usuario->token);
                    $email-> enviarConfirmacion();
                    
                    //crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header('Location: /mensaje');
                    }
                    //debuguear($usuario);
                }
            }

        }

        $router->render('auth/crearcuenta', [
           'usuario'=> $usuario,
           'alertas'=> $alertas //para mostrar en la vista
        ]);
    }
    public static function mensaje(Router $router){
        $router->render('auth/mensaje');
    }
}