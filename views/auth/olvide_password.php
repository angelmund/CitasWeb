<h1 class="nombre-pagina">Olvid&eacute; Password</h1>
<p class="descripcion-pagina">Restablece tu password ingresando tu email</p>


<form class="formulario" action="/olvide_password" method="POST" >
    <div class="campo">
        <label for="email">Email</label>
        <input 
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            />
    </div>

    <input type="submit" class="boton" value="Enviar instrucciones">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesi&oacute;n</a>
    <a href="/crearcuenta">¿A&uacute;n no tienes una cuenta? Crear Una</a>

</div>