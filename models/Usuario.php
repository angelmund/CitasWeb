<?php

namespace Model;


class Usuario extends ActiveRecord{
    //base de datos
    protected static $tabla = 'usuario';
    //atributos de la tabla usuario
    protected static $columnaDB = ['id','nombre','apPaterno', 'apMaterno','email','password','telefono','admin','confirmado','token']; 

    public $id;
    public $nombre;
    public $apPaterno;
    public $apMaterno;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    //se crea una instancia con los atributos de la class
    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->nombre = $args ['nombre'] ?? '';
        $this->apPaterno = $args ['apPaterno']?? '';
        $this->apMaterno = $args ['apMaterno']?? '';
        $this->email = $args ['email']?? '';
        $this->password = $args ['password']?? '';
        $this->telefono = $args ['telefono']?? '';
        $this->admin = $args ['admin']?? null;
        $this->confirmado = $args ['confirmado']?? null;
        $this->token = $args ['token']?? '';
    }

    //Mensajes de validaciaón para la autenticación de una  cuenta
    public function validarNuevaCuenta(){
        if(!$this->nombre){
            // el segundo [] es para enviar el mensaje que se encuentra en alertas.php
            self::$alertas['error '] [] = 'El nombre es Obligatorio';
        }
        if(!$this->apPaterno){
            self::$alertas['error'] [] = 'El apellido Paterno es Obligatorio';
        }
        if(!$this->apMaterno){
            self::$alertas['error'] [] = 'El apellido Materno es Obligatorio';
        }
        if(!$this->telefono){
            self::$alertas['error'] [] = 'El Teléfono es Obligatorio';
        }
        if(!$this->email){
            self::$alertas['error'] [] = 'El Email es Obligatorio';
        }
        if(!$this->password){
            self::$alertas['error'] [] = 'El Password es Obligatorio';
        }
        if(strlen($this->password < 6)){ //strlen indica el tama;o del password
            self::$alertas['error'] [] = 'El Password debe contener al menos 6 
            caracteres';
        }
        return self::$alertas;
    }
    //Verifica que no esté registardo
    public function existeUsuario(){
        //se leen los datos que pone el usuario
        $query = " SELECT * FROM " .self::$tabla. " WHERE email = '" . $this->email. "' LIMIT 1";
        //consulta los datos ingresados en la bd      
        $resultado = self::$db->query($query);

        //Identifia si ya existe un usuario con el mismo correo 
        if($resultado->num_rows){
            self::$alertas['error'][] = 'El usuario ya existe';
        }
        return $resultado;
    }

    public function hashPassword(){
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    
    }

    public function crearToken(){
        //uniqid sirve para generar un a cadena para token
        $this->token = uniqid();
    }
}

