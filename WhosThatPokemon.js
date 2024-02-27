document.addEventListener("DOMContentLoaded", function () {

  // Generar números aleatoriamente
  function Random() { }
  Random.gen = function (limInf, limSup) {
    return Math.floor(Math.random() * (limSup - limInf + 1) + limInf);
  };

  // AJAX por XMLHttpRequest
  function ApiAJAX(URL_BASE) {
    this.URL_BASE = URL_BASE;
  }
  ApiAJAX.prototype.pedirJSON = function (endpoint, ok, error) {
    const ajax = new XMLHttpRequest();

    ajax.addEventListener("readystatechange", (event) => {
      if (ajax.readyState !== 4) return;

      if (ajax.status >= 200 && ajax.status < 300) {
        ok(JSON.parse(ajax.responseText));
      } else {
        error(`Error: ${ajax.status} -> ${ajax.statusText}`);
      }
    });

    ajax.open("GET", this.URL_BASE + endpoint);
    ajax.send();
  };

  // Función constructora principal del videojuego, crea la instancia principal del videojuego
  function WhosThatPokemon(contenedorPrincipal) {
    this.contenedorPrincipal = contenedorPrincipal;
    this.keysPuntuaciones = Object.keys(localStorage);
    this.tableroJuego = WhosThatPokemon.crearElemento("div");
    this.tableroJuego.setAttribute("id", "tablero");
    this.contenedorPrincipal.appendChild(this.tableroJuego);
    document.body.appendChild(this.contenedorPrincipal);
    this.idPokemons = [];
    this.pokemonsActuales = [];
    this.tiempoInicio = null;
    this.botonFinalizar = null;
    this.pokemonsCompletados = [];
    this.tiempoTotal = 0;
    this.faltaron = null;
    this.nombreUsuario = null;
    this.numCartas = 0;
    this.dificultad = 0;
  }
  WhosThatPokemon.crearElemento = function (tag, txt) {
    const elemHtml = document.createElement(tag);
    if (txt) {
      const elemTxt = document.createTextNode(txt);
      elemHtml.appendChild(elemTxt);
    }
    return elemHtml;
  };

  //Método para iniciar el juego, creando la vista inicial donde el usuario podrá iniciar el juego
  //podrá seleccionar la dificultad (1-5) y ver las reglas del juego
  WhosThatPokemon.prototype.iniciarJuego = function () {
    const botonComenzar = WhosThatPokemon.crearElemento("button", "Comenzar Juego");
    botonComenzar.setAttribute("id", "comenzarJuego");
    //Botón que al hacer doble-click muestra/oculta las reglas del juego
    const botonReglasJuego = WhosThatPokemon.crearElemento("button", "Mostrar reglas del juego");
    botonReglasJuego.setAttribute("id", "reglasJuego");
    const reglasJuego = WhosThatPokemon.crearElemento("div");
    reglasJuego.classList = "reglas-juego";
    reglasJuego.innerHTML = `
El juego consiste en acertar el nombre del Pokémon de la silueta mostrada en cada una de
las cartas una vez introduzca el nombre del mismo en el formulario correspondiente y le de a la tecla "Enter", 
se validará si el Pokémon es el introducido o no. Si el Pokémon es el correcto,
se desvelará y se le sumará al total de Pokémon completados del juego.
Si no es correcto, puede volver a intentarlo, pero si ve que el Pokémon se desvanece si mostrar cual era
significa que el algoritmo del juego ha decidido aleatoriamente que ya no tiene más intentos con ese Pokémon.
Una vez le de al botón de "Finalizar juego", podrá registrar su puntuación en el sistema, la cual consiste de:
La cantidad de Pokémon <strong>completados</strong>, la cantidad de Pokémon que le <strong>faltaron</strong> por completar,
el <strong>tiempo</strong> total en milisegundos (cuanto más, peor puntuación) que tardó en finalizar el juego y la <strong>dificultad</strong> que seleccionó.
<br/>
Tiene el siguiente sistema de niveles para elegir:
<br/><br/>
<ul>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 1:</strong> Se le mostrarán <strong>4</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 2:</strong> Se le mostrarán <strong>8</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 3:</strong> Se le mostrarán <strong>12</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 4:</strong> Se le mostrarán <strong>16</strong> cartas de Pokémon a resolver</li>
<li>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Nivel 5:</strong> Se le mostrarán <strong>20</strong> cartas de Pokémon a resolver</li>
</ul>
    `;
    botonReglasJuego.addEventListener("click", (event) => {
      if (reglasJuego.style.display === 'none') {
        reglasJuego.style.display = 'block';
      } else {
        reglasJuego.style.display = 'none';
      }
    });

    const labelDificultad = WhosThatPokemon.crearElemento("label", "Dificultad: ");
    labelDificultad.setAttribute("for", "inputDificultad");
    const inputDificultad = WhosThatPokemon.crearElemento("input");
    inputDificultad.setAttribute("type", "number");
    inputDificultad.setAttribute("min", "1");
    inputDificultad.setAttribute("max", "5");
    inputDificultad.setAttribute("value", "1"); // Dificultad por defecto
    inputDificultad.setAttribute("id", "inputDificultad");
    labelDificultad.appendChild(inputDificultad);

    this.contenedorPrincipal.appendChild(labelDificultad);
    this.contenedorPrincipal.appendChild(botonComenzar);
    this.contenedorPrincipal.appendChild(botonReglasJuego);
    this.contenedorPrincipal.appendChild(reglasJuego);


    const self = this;

    //Función para dar comienzo al juego según la dificultad que el usuario establezca
    function comenzarJuego() {
      // Obtener la dificultad seleccionada
      self.dificultad = parseInt(document.getElementById("inputDificultad").value);

      // Bloquear el input de dificultad
      inputDificultad.disabled = true;

      // Establecer la cantidad de cartas según la dificultad
      let numCartas;
      switch (self.dificultad) {
        case 1:
          numCartas = 4;
          break;
        case 2:
          numCartas = 8;
          break;
        case 3:
          numCartas = 12;
          break;
        case 4:
          numCartas = 16;
          break;
        case 5:
          numCartas = 20;
          break;
        default:
          numCartas = 8;
          break;
      }

      // Eliminar las cartas anteriores si existen
      self.eliminarCartasAnteriores();

      // Ocultamos el botón de comenzar
      botonComenzar.style.display = "none";

      // Creamos y mostramos el botón
      const request = new ApiAJAX(Pokemon.URL_POKEAPI);
      self.crearTableroJuego(request, numCartas);

      // Asignamos el valor a la propiedad del objeto
      self.numCartas = numCartas;

      // Incializamos el temporizador (tiempo de juego)
      self.tiempoInicio = new Date();

      // Agregamos el evento al botón de finalizar juego
      self.botonFinalizar = WhosThatPokemon.crearElemento("button", "Finalizar Juego");
      self.botonFinalizar.setAttribute("id", "finalizarJuego");
      self.contenedorPrincipal.appendChild(self.botonFinalizar);
      self.botonFinalizar.addEventListener("click", finalizarJuego);

      // Función para finalizar el juego
      function finalizarJuego() {
        // Calcular el tiempo total
        const numCartas = self.numCartas;
        const tiempoFin = new Date();
        self.tiempoTotal = tiempoFin - self.tiempoInicio;

        // Calcular la puntuación
        self.faltaron = Math.max(0, numCartas - self.pokemonsCompletados.length);

        // Crear elemento puntuación
        const puntuacionElement = WhosThatPokemon.crearElemento("p");

        // Mostrar la puntuación adecuada
        puntuacionElement.textContent = `Has completado ${self.pokemonsCompletados.length} de ${numCartas} Pokémon. Te faltaron ${self.faltaron}.`;

        // Mostrar el tiempo total
        puntuacionElement.textContent += ` Tiempo total: ${self.tiempoTotal / 1000} segundos.`;

        // Mostrar la puntuación en el cuerpo del documento
        self.contenedorPrincipal.appendChild(puntuacionElement);

        // Ocultar el tablero y el botón de finalizar
        self.tableroJuego.style.display = "none";
        self.botonFinalizar.style.display = "none";

        // Crear formulario de puntuación
        const formularioPuntuacion = self.crearFormularioPuntuacion();

        // Actualizar el campo de tiempo total en el formulario
        const tiempoTotalInput = formularioPuntuacion.querySelector("#tiempoTotal");
        if (tiempoTotalInput) {
          tiempoTotalInput.value = `${self.tiempoTotal / 1000} segundos`;
        } else {
          console.error("Elemento con ID 'tiempoTotal' no encontrado en el formulario.");
        }

        // Mostrar el formulario de puntuación
        self.contenedorPrincipal.appendChild(formularioPuntuacion);
      }
    }

    // Agregar evento al botón de comenzar
    botonComenzar.addEventListener("click", comenzarJuego);
  };

  //Método para finalizar el juego, borrando las cartas y mostrando el formulario con la puntuación obtenida
  WhosThatPokemon.prototype.finalizarJuego = function () {
    // Calcular el tiempo total
    const self = this;
    const numCartas = self.numCartas;
    const tiempoFin = new Date();
    const tiempoTotal = tiempoFin - this.tiempoInicio;

    // Calcular la puntuación
    const completados = this.pokemonsCompletados.length;
    const faltaron = Math.max(0, numCartas - completados);

    // Crear elemento puntuación
    const puntuacionElement = WhosThatPokemon.crearElemento("p");

    // Mostrar la puntuación adecuada
    puntuacionElement.textContent = `Has completado ${completados} de ${numCartas} Pokémon. Te faltaron ${faltaron}.`;

    // Mostrar el tiempo total
    puntuacionElement.textContent += ` Tiempo total: ${tiempoTotal / 1000} segundos.`;

    // Mostrar la puntuación en el cuerpo del documento
    document.body.appendChild(puntuacionElement);

    // Ocultar el tablero y el botón de finalizar
    this.tableroJuego.style.display = "none";
    this.botonFinalizar.style.display = "none";

    // Reiniciar arrays
    this.idPokemons = [];
    this.pokemonsActuales = [];
    this.pokemonsCompletados = [];

    // Crear formulario de puntuación
    const formularioPuntuacion = this.crearFormularioPuntuacion();

    // Actualizar el campo de tiempo total en el formulario
    const tiempoTotalInput = formularioPuntuacion.querySelector("#tiempoTotal");
    if (tiempoTotalInput) {
      tiempoTotalInput.value = `${tiempoTotal / 1000} segundos`;
    } else {
      console.error("Elemento con ID 'tiempoTotal' no encontrado en el formulario.");
    }

    // Mostrar el formulario de puntuación
    this.contenedorPrincipal.appendChild(formularioPuntuacion);
  };

  //Método para eliminar las cartas que están en el tablero
  WhosThatPokemon.prototype.eliminarCartasAnteriores = function () {
    const cartasAnteriores = document.querySelectorAll(".carta");
    cartasAnteriores.forEach((carta) => carta.remove());
  };

  //Método para mostrar los datos que se reciben (debugg)
  WhosThatPokemon.prototype.mostrarDatos = function (datos) {
    console.dir(datos);
  };

  //Método para mostrar los errores (debugg)
  WhosThatPokemon.prototype.mostrarError = function (error) {
    console.error(error);
  };

  //Método para crear la carta del pokémon
  WhosThatPokemon.prototype.crearCarta = function (pokemon) {
    // Extraer datos
    const self = this;
    this.pokemonsActuales.push(pokemon);
    const id = pokemon.id;
    this.idPokemons.push(id);
    const nombre = pokemon.name;
    const sprite = pokemon.sprites.front_default;

    const figure = WhosThatPokemon.crearElemento("figure");
    figure.classList.add("carta");
    figure.classList.add("cara-oculta");
    figure.classList.add("oculta-inicial");
    figure.classList.add(pokemon.types[0]["type"]["name"]);
    figure.setAttribute("id", id);
    figure.setAttribute("name", nombre);

    // Imagen oscurecida del Pokémon
    const imgOscurecida = WhosThatPokemon.crearElemento("img");
    imgOscurecida.setAttribute("src", sprite);
    imgOscurecida.classList.add("oscurecer-imagen");
    figure.appendChild(imgOscurecida);

    const figCaption = WhosThatPokemon.crearElemento("figcaption", nombre);
    figCaption.classList.add("ocultar-texto");
    figure.appendChild(figCaption);

    const input = WhosThatPokemon.crearElemento("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Nombre del Pokémon");
    figure.appendChild(input);

    // Añadir temporizador para quitar la clase de opacidad después de un tiempo
    setTimeout(() => {
      figure.classList.remove("oculta-inicial");
    }, 1000);

    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const inputNombre = input.value.trim().toLowerCase();
        const nombrePokemon = figure.getAttribute("name").toLowerCase();

        if (inputNombre === nombrePokemon) {
          mostrarPokemonReal(nombrePokemon);
          // Verificamos si todas las cartas han sido completadas
          if (self.pokemonsCompletados.length === self.idPokemons.length) {
            finalizarJuego();
          }
        } else {
          ocultarPokemonReal();
        }
      }
    });

    //Función para mostrar el pokémon
    function mostrarPokemonReal(nombrePokemon) {
      figure.classList.remove("cara-oculta");
      figure.children[2].classList.remove("ocultar-texto");
      imgOscurecida.style.filter = "brightness(100%)";
      self.pokemonsCompletados.push(id);

      // Crear el título del Pokémon
      const tituloPokemon = WhosThatPokemon.crearElemento("figcaption", nombre.toUpperCase());

      // Agregar el título como un hijo de la figura
      figure.appendChild(tituloPokemon);

      // Restaurar el estado del input
      input.style.display = "none";
      input.value = "";

      // Verificar si todas las cartas han sido completadas
      if (self.pokemonsCompletados.length === self.idPokemons.length) {
        finalizarJuego();
      }
    }

    //Función para ocultar el pokemon
    function ocultarPokemonReal() {
      const inputNombre = input.value.trim().toLowerCase();
      const nombrePokemon = figure.getAttribute("name").toLowerCase();

      if (inputNombre !== nombrePokemon && inputNombre.length === nombrePokemon.length) {
        setTimeout(() => {
          figure.classList.add("cara-oculta");
          imgOscurecida.classList.add("ocultar-imagen");
          figure.children[2].classList.add("ocultar-texto");
          imgOscurecida.style.filter = "brightness(40%)";
        }, 200);
      }
    }

    this.tableroJuego.appendChild(figure);
  };

  //Método para crear el tablero del juego con las cartas poquemon
  WhosThatPokemon.prototype.crearTableroJuego = function (request, numCartas) {
    const maxIntentos = 50;

    for (let i = 0; i < numCartas; i++) {
      let intentos = 0;
      let idRandom;

      do {
        idRandom = Random.gen(1, 150);
        intentos++;
      } while (this.idPokemons.includes(idRandom) && intentos < maxIntentos);

      if (intentos === maxIntentos) {
        console.error("No se pudo generar un Pokémon único en el límite de intentos.");
        break;
      }

      request.pedirJSON(idRandom, this.crearCarta.bind(this), this.mostrarError.bind(this));
      this.idPokemons.push(idRandom);
    }
  };

  //Método para crear el formulario para registrar la puntuación del usuario
  WhosThatPokemon.prototype.crearFormularioPuntuacion = function () {
    const self = this;
    const formPuntuacion = WhosThatPokemon.crearElemento("form");

    // Nombre de Usuario
    const labelNombreUsuario = WhosThatPokemon.crearElemento("label", "Nombre de Usuario:");
    const inputNombreUsuario = WhosThatPokemon.crearElemento("input");
    inputNombreUsuario.setAttribute("type", "text");
    inputNombreUsuario.setAttribute("id", "nombreUsuario");
    inputNombreUsuario.setAttribute("required", "");
    labelNombreUsuario.appendChild(inputNombreUsuario);

    // Tiempo Total
    const labelTiempoTotal = WhosThatPokemon.crearElemento("label", "Tiempo Total:");
    const inputTiempoTotal = WhosThatPokemon.crearElemento("input");
    inputTiempoTotal.setAttribute("type", "text");
    inputTiempoTotal.setAttribute("id", "tiempoTotal");
    inputTiempoTotal.setAttribute("readonly", "");
    labelTiempoTotal.appendChild(inputTiempoTotal);

    // Botón de envío
    const submitPuntuacion = WhosThatPokemon.crearElemento("input");
    submitPuntuacion.setAttribute("type", "submit");
    submitPuntuacion.setAttribute("value", "Guardar puntuación");

    // Agregar elementos al formulario
    formPuntuacion.appendChild(labelNombreUsuario);
    formPuntuacion.appendChild(labelTiempoTotal);
    formPuntuacion.appendChild(submitPuntuacion);

    formPuntuacion.addEventListener("submit", function (event) {
      event.preventDefault();

      // Obtener el nombre del usuario del formulario
      const nombreUsuario = inputNombreUsuario.value.trim();

      // Crear un objeto con la información de la puntuación y el nombre del usuario
      const puntuacionFinal = {
        nombreUsuario: nombreUsuario,
        completados: self.pokemonsCompletados.length,
        faltaron: self.faltaron,
        tiempoTotal: self.tiempoTotal,
        dificultad: self.dificultad
      };

      // Almacenar la puntuación en localStorage
      localStorage.setItem((self.keysPuntuaciones.length + 1) + "-Puntuacion", JSON.stringify(puntuacionFinal));

      // Imprimir tabla de puntuaciones
      self.imprimirPuntuaciones();
    });

    return formPuntuacion;
  };


  //Método que imprime las puntuaciones actuales almacenadas en LocalStorage
  WhosThatPokemon.prototype.imprimirPuntuaciones = function () {
    document.body.innerHTML = "";

    // Obtener las claves almacenadas en localStorage
    const keysPuntuaciones = Object.keys(localStorage);

    const div = WhosThatPokemon.crearElemento("div");
    div.classList = "puntuaciones";
    const logo = WhosThatPokemon.crearElemento("img");
    logo.setAttribute("src", "./imgs/logo-whosthatpokemon.png");
    logo.classList = "logo-whos";
    div.appendChild(logo);
    // Crear la tabla
    const table = WhosThatPokemon.crearElemento("table");

    // Añadir el título de la tabla
    const caption = WhosThatPokemon.crearElemento("caption", "PUNTUACIONES REGISTRADAS");
    table.appendChild(caption);

    // Crear el encabezado de la tabla
    const thead = WhosThatPokemon.crearElemento("thead");
    const thRow = WhosThatPokemon.crearElemento("tr");
    thead.appendChild(thRow);

    // Obtener las propiedades del primer objeto para usarlas como encabezados de columna
    const firstData = JSON.parse(localStorage.getItem(keysPuntuaciones[0]));

    // Añadir cada propiedad como un th en el encabezado
    Object.keys(firstData).forEach((propiedad) => {
      const th = WhosThatPokemon.crearElemento("th", propiedad.toUpperCase());
      thRow.appendChild(th);
    });

    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = WhosThatPokemon.crearElemento("tbody");
    table.appendChild(tbody);

    // Añadir cada puntuación como una fila en la tabla
    keysPuntuaciones.forEach((key) => {
      const valor = localStorage.getItem(key);
      const tr = WhosThatPokemon.crearElemento("tr");
      tbody.appendChild(tr);
      const data = JSON.parse(valor);
      Object.values(data).forEach((value) => {
        const td = WhosThatPokemon.crearElemento("td", String(value)); // Convertir a cadena
        tr.appendChild(td);
      });
    });

    // Añadimos la tabla directamente al body
    div.appendChild(table);
    const a = WhosThatPokemon.crearElemento("a");
    a.setAttribute("href", window.location.href)
    const reset = WhosThatPokemon.crearElemento("button", "Jugar otra vez");
    a.appendChild(reset);
    div.appendChild(a);
    document.body.appendChild(div);
  };


  // POKEMON y POKEAPI
  function Pokemon(datos) {
    this.datos = datos;
  }
  Pokemon.URL_POKEAPI = "https://pokeapi.co/api/v2/pokemon/";
  Pokemon.URL_POKEAPI_150 = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

  //Ejecución principal
  const contenedorPrincipal = document.querySelector(".contenedorPrincipal");
  const vista = new WhosThatPokemon(contenedorPrincipal);
  vista.iniciarJuego();

})
