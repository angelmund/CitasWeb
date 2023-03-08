<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\Test\PHPMailer\PunyencodeAddressTest;

class Email {

    public $email;
    public $nombre;
    public $token;

    public function __construct($email,$nombre,$token){

        //Se instancian los atributos 
        $this->email=$email;
        $this->nombre= $nombre;
        $this->token=$token;
    }
    
    public function enviarConfirmacion(){

        //Craer el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = 'b92da411238302';
        $mail->Password = '7902ce9c006f88';


        $mail->setFrom('micita@citas.com');  
        $mail->addAddress('micita@citas', 'appcitas.com'); //es el nombre del dominio
        $mail->Subject = 'Confirma tu cuenta';

        //Set HTML
        $mail->isHTML(true);
        $mail->CharSet= 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>".$this->nombre. "</strong>Has creado tu cuenta en MiCita, solo debes 
        confrimarla presionando el siguiente enlace</p>";
        $contenido .= "<p>Presiona aquí: <a href= 'http://localhost:3000/confirmar_cuenta?token=".$this->token. "'> Confirmar Cuenta </a> </p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes 
        ignorar este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar el mail
        $mail->send();
    }
}