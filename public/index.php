<?php 

use Controllers\LoginController;

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;

$router = new Router();

//Iniciar sesion 
$router->get('/',[LoginController::class, 'Login']);
$router->post('/',[LoginController::class, 'Login']);

//Cerrar sesi
$router->get('/Logout',[LoginController::class, 'Logout']);

//Recuperar Password
$router->get('/olvide_password',[LoginController::class, 'olvide_password']);
$router->post('/olvide_password',[LoginController::class, 'olvide_password']);
//recuperar password
$router->get('/recuperar',[LoginController::class, 'recuperar']);
$router->post('/recuperar',[LoginController::class, 'recuperar']);

//crear cuentas
$router->get('/crearcuenta',[LoginController::class, 'crearcuenta']);
$router->post('/crearcuenta',[LoginController::class, 'crearcuenta']);

//Confirmar cuenta
$router->get('/confirmar_cuenta',[LoginController::class, 'confirmar']); 

$router->get('/mensaje',[LoginController::class, 'mensaje']); 


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();