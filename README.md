<h1>Videojuego Who's That Pokémon - JS Vanilla</h1>
<p>Videojuego de cartas recreando el clásico ¿Quién es ese Pokémon? de la serie original de TV Pokémon, creado bajo las restricciones pedidas por el profesor, utilizando JS Vanilla con funciones constructoras, eventos, peticiones AJAX a la API REST: <a href="https://pokeapi.co/"/>https://pokeapi.co/</a>, realizando persistencia de datos con LocalStorage y estilando con CSS 3 utilizando Grid y Flexbox.</p>
<p>El videojuego fue desarrollado 100% en Frontend como práctica de la asignatura Desarrollo Web en Entorno Cliente en la FP Superior 2º DAW.</p>
<h2>Reglas del juego:</h2>
<p>El juego consiste en acertar el nombre del Pokémon de la silueta mostrada en cada una de
las cartas una vez introduzca el nombre del mismo en el formulario correspondiente y le de a la tecla "Enter", 
se validará si el Pokémon es el introducido o no. Si el Pokémon es el correcto,
se desvelará y se le sumará al total de Pokémon completados del juego.
Si no es correcto, puede volver a intentarlo, pero si ve que el Pokémon se desvanece si mostrar cual era
significa que el algoritmo del juego ha decidido aleatoriamente que ya no tiene más intentos con ese Pokémon.
Una vez le de al botón de "Finalizar juego", podrá registrar su puntuación en el sistema, la cual consiste de:
La cantidad de Pokémon <strong>completados</strong>, la cantidad de Pokémon que le <strong>faltaron</strong> por completar,
el <strong>tiempo</strong> total en milisegundos (cuanto más, peor puntuación) que tardó en finalizar el juego y la <strong>dificultad</strong> que seleccionó.
<br>
Tiene el siguiente sistema de niveles para elegir:
<br><br>
<ul>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 1:</strong> Se le mostrarán <strong>4</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 2:</strong> Se le mostrarán <strong>8</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 3:</strong> Se le mostrarán <strong>12</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 4:</strong> Se le mostrarán <strong>16</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 5:</strong> Se le mostrarán <strong>20</strong> cartas de Pokémon a resolver</li>
</ul></p>
