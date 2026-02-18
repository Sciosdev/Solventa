<section class="board board__servicios contact" id="contacto">
    <form action="formulario.php" class="form">
        <div class="text--wrapper">
            <h2 class="text text__subtitle">Contáctanos</h2>
        </div>
        <input class="form--input" type="text" name="nombre" placeholder="Nombre" required>
        <input class="form--input" type="email" name="email" placeholder="Email" pattern=".+@*\.com" size="30" required>
        <textarea class="form--mensaje" name="mensaje" placeholder="Mensaje" required></textarea>
        <input type="submit" class="button button__terciary board__button--enviar" value="Enviar">
    </form>
</section>