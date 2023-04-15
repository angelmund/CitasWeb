<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;


class LoginController {
    public static function Login(Router $router){
        $alertas =[];
        //para autocomplete
        //$auth = new Usuario();

        if($_SERVER['REQUEST_METHOD'] =='POST'){
            $auth= new Usuario($_POST);

            //hace que se muestre en la vista 
            $alertas =  $auth->validarLogin();
            if(empty($alertas)){
               //comprobar que exista el usurio
               $usuario = Usuario::where('email', $auth->email); 

               if($usuario){
                //verificar el password
                //mando a llamar el mtodo del modelo usuario
                if($usuario->comporbarPasswordAndVerificado($auth->password)) {
                    //autenticar el usuario
                    session_start();

                    $_SESSION['id'] = $usuario->id;
                    $_SESSION['nombre'] =$usuario->nombre. " ". $usuario->apPaterno. " ". $usuario->apMaterno;
                    $_SESSION['email'] = $usuario->email;
                    $_SESSION['login'] =true;

                    //redirecionamiento
                    if($usuario->admin === "1"){
                        $_SESSION['admin'] = $usuario->admin ?? null;
                        
                        header('Locatin: /admin');
                    }else{
                        header('Locatin: /cita');
                    }
                }
               }else{
                Usuario::setAlerta('error', 'Usuario no encontrado');
               }

            }
        }
        $alertas = Usuario::getAlertas();

        $router->render('auth/login', ['alertas'=> $alertas]); 
        //'auth'=> $auth es para autocompletar los campos
    }
    public static function Logout(){
        echo "Desde Logout";
    }
    public static function olvide_password(Router $router){
        $alertas =[];

        if($_SERVER['REQUEST_METHOD']==='POST'){
            $auth= new Usuario($_POST);
            $alertas=$auth->validarEmail();
            if(empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);
                
                if($usuario && $usuario->confirmado === "1"){
                    
                    //Generar un Token
                    $usuario->crearToken();
                    $usuario->guardar();
                    //debuguear($usuario);

                    //Enviar email
                    $email = new Email($usuario->email, $usuario ->nombre, $usuario->token);
                    $email ->enviarInstruciones();

                    //Alerta de exito
                    Usuario::setAlerta('exito','Revisa tu email');
                   
                }else{
                    Usuario::setAlerta('error', 'El usuario no existe o no está confirmado');
                    
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/olvide_password', [
            'alertas'=>$alertas
        ]);
    }
    public static function recuperar(Router $router){
        $alertas = [];
        $error = false;

        $token = s($_GET['token']); //se sanitaza con la funcion s
        //buscar usuario por su token 
        $usuario = Usuario::where('token', $token);
        //en caso de que no encuentre ese token, hace el siguiente if
        if(empty($usuario)){
            Usuario::setAlerta('error', 'Token no Válido');
            $error = true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            //Lee el nuevo password y lo guarda
            $password = new Usuario($_POST);
            $password = $password->validarPassword();//instancia y llama el metodo validar password
            
            //si el arreglo de alertas esta vacio, entonces se jashea el password
            if(empty($alertas)){
                $usuario->password = null; //elimana el password anterior
                
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;

                $resultado = $usuario->guardar();
                if($resultado){
                    header('Location: /');
                }
                
            }
        }

        //debuguear($usuario);
        $alertas = Usuario::getAlertas(); //aqui termina si no encuentra el token en algun usuario existente
        $router->render('auth/recuperar-password', [
            'alertas'=> $alertas,
            'error' => $error

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
    public static function confirmar(Router $router){
        $alertas =[];

        $token = s($_GET['token']);

        $usuario = Usuario::where('token', $token);
        
        if($usuario){
            //mostra mensaje de error
            $usuario::setAlerta('error', 'Token no válido');
        }else{
            //modificar a usuario confirmado
            $usuario->confirmado = 1;
            $usuario->token =null;
            $usuario->guardar();
            $usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }
        
        //Obtener alertas 
        $alertas =Usuario::getAlertas();

        //renderizar la vista 
        $router->render('auth/confirmar-cuenta', [
            'alertas'=> $alertas
        ]);
    }
}