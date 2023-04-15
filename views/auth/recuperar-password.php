<!-- hace que se llamen las alertas -->
<?php
    include_once __DIR__ . "/../templates/alertas.php"
?>
<!-- aqu[i termina lo que llama las alertas -->

<?php 
    if($error) return null; //es para ocultar el formulario en caso de que el token no sea v[a]lido
    //si no encuentra un usuario con ese token  
?>

<h1 class="nombre-pagina">Recuperar Password</h1>
<p class="descripcion-pagina">Coloca tu nuevo Password a continuaci&oacute;n</p>

<form class="formulario" method="post">
    <div class="campo">
        <input 
            type="password"
            id="password"
            name="password"
            placeholder="Tu nuevo Password"
        />
    </div>
    <input type="submit" class="boton" value="Guardar Nuevo Password">
</form>


<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesi&oacute;n</a>
    <a href="/crearcuenta">¿A&uacute;n no tienes una cuenta? Crear Una</a>
</div>