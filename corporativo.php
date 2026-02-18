<!DOCTYPE html>
<html lang="es" prefix="og: http://ogp.me/ns#">
<?php include 'head.php';?>
<body class="resize">
<?php include 'boardback.php';?>
<?php include 'menu.php';?>
<?php include 'header.php';?>
  <div class="content">
    <main class="board__main board__privacidad board__corporativo">
        <section class="board board__privacidad--wrapper">
            <h1 class="text text__title"><strong>Corporativo</strong></h1>
            <p class="text text__paragraph">Solventatech Holdings es una empresa tecnológica y administradora de empresas con sede en Miami Florida y Ciudad de México. Se enfoca en invertir a largo plazo en entidades empresariales bien establecidas en el sector automotriz y de movilidad personal en diferentes regiones. La empresa opera como un ecosistema empresarial único, colaborando con importantes organizaciones globales como CHUBB, BBVA, Santander y Cibanco.</p>
            <p class="text text__paragraph">El objetivo principal de SolventaTech LLC es desplegar recursos financieros y generar sinergias en todo su portafolio de negocio. Cuenta con un equipo ejecutivo experimentado en innovación, que tiene un historial exitoso en el desarrollo de iniciativas  y modelos de alta especialidad a lo largo del ciclo de vida automotriz. La empresa se enfoca en satisfacer las necesidades de los propietarios de automóviles y busca aprovechar las oportunidades en el sector de la movilidad personal.</p>
            <p class="text text__paragraph">Con su enfoque en la inversión estratégica y su red de colaboraciones, SolventaTech LLC busca impulsar el crecimiento y el éxito de las empresas en las que invierte, mientras se mantiene a la vanguardia de la innovación en el sector automotriz y de movilidad.</p>
        </section>
    </main>
  </div>
  <?php include 'footer.php';?>
  <!------------------------ modal --------------------->
  
  <div class ="board board--overlay modal modal__pedido <?php
    if(isset($_GET['success']))
    {
      $success = $_GET['success'];
      echo $success;
    }
    ?>">
    <span class="board__overlay--close">×</span>
    <div class="text--wrapper">
      <h3 class="text text__title">¡Gracias por contactarnos!</h3>
      <p class="text text__subtitle">En breve nos comunicaremos contigo</p>
    </div>
  </div>
  <div class="overlay--back <?php
    if(isset($_GET['success']))
    {
      $success = $_GET['success'];
      echo $success;
    }
    ?>">
  </div>
</body>
</html>