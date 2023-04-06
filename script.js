'use strict';

// selectores de elementos para facilitar el curso

const score0 = document.getElementById('score0');
const score1 = document.getElementById('score1');

const imagenDado = document.querySelector('.dice');
const nuevoJuego = document.querySelector('#newGame');
const lanzarDado = document.querySelector('#rollDice');
const cambiarTurno = document.getElementById('cambiarJugador');
const errorMessageInstance = document.querySelector('.errorMessage');
const juegoTerminadoMensaje = document.querySelector('.endGame');


// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


const CERO_INTENTOS = 0;

let jugador1 = {
  intentos: 3,
  puntaje: 0,
  puedelanzar: true,
  id: 'jugador-1'
}
let jugador2 = {
  intentos: 3,
  puntaje: 0,
  puedelanzar: true,
  id: 'jugador-2'
}
let jugadores = [jugador1,jugador2]

//variable globales 
let jugadorActivo = null, previoJugador = null;


const restarIntentos = (jugador) =>  jugador.intentos--;
const tieneIntentos = (intentos) => intentos >= CERO_INTENTOS;

const cambiarJugadorActivo = () => {
  const jugadorPrevioTemp = previoJugador
  previoJugador = jugadorActivo
  jugadorActivo = jugadorPrevioTemp
}
 
const reiniciarJugadores = () => {
  jugador1.intentos = 3;
  jugador2.intentos = 3;
  jugador1.puntaje = 0;
  jugador2.puntaje = 0;
}


const agregarFocusUsuarioActivo = () => {
  document.querySelector(`.jugador${jugadorActivo}`).classList.add('player--active');
}

const eliminarFocusUsuarioPrevio = () => {
  document.querySelector(`.jugador${previoJugador}`).classList.remove('player--active')
}

const jugadoresPuedenContinuar =() => { return jugadores[0].intentos > 0 || jugadores[1].intentos > 0 };



/* 
   FUNCIONES RELACIONADAS AL DADO
*/

// funcion para simular el tiro del dado
const numeroDado = () => Math.trunc(Math.random() * 6) + 1;

const establecerImagenDado = (dato) => {
  imagenDado.classList.remove('hidden');
  imagenDado.src = `dice-${dato}.png`;

  // Establecer el valor del dado
  document.getElementById(`dado-jugador-${jugadorActivo}`).textContent = dato
}

const mostrarPuntuajeTotalUsuario = (puntuaje) => {
  document.getElementById(`score${jugadorActivo}`).textContent = puntuaje
}

const desactivarLanzarDados = () => {
  imagenDado.classList.add('hidden');
}

const activarLanzarDados = () => {
  imagenDado.classList.remove('hidden');
}


/* 
   FUNCIONES DEL MODAL 
*/

const mostrarMessageSinItentos = () => errorMessageInstance.classList.remove('hidden');
const mostrarTerminadoMensaje = () =>  juegoTerminadoMensaje.classList.remove('hidden');


const openModal = () => {
  errorMessageInstance.classList.remove('hidden');
  modal.style.display = "block";
} 

// Dar click al 'X' cierra el modal
span.onclick = function() {
  modal.style.display = "none";
}

const setUsuarioNoPuedeLanzar = (jugadoActivo) => {
  errorMessageInstance.textContent = `${jugadoActivo.id}, ya no puede lanzar, cambiar jugador`
}

const setMensajeJuegoTerminado = (jugadorGanador = null) => {
  if (jugadorGanador === null) {
    errorMessageInstance.textContent = 'EMPATE'
  } else {
    errorMessageInstance.textContent = `Juego terminado, ${jugadorGanador.id} gano!!`
  }
}





// iniciar juego, reiniciar variables
const iniciarJuego = function () {

  reiniciarJugadores();
  jugadorActivo = 0
  previoJugador =  1;
  activarLanzarDados();
   
  score0.textContent = 0;
  score1.textContent = 0;

  document.getElementById(`dado-jugador-0`).textContent = 0
  document.getElementById(`dado-jugador-1`).textContent = 0

  imagenDado.classList.add('hidden');

  errorMessageInstance.textContent = ''

  eliminarFocusUsuarioPrevio();
  agregarFocusUsuarioActivo();

};

const cambiarJugador = function () {

  let jugadoresTienenIntentos = jugadoresPuedenContinuar();
   
  cambiarJugadorActivo();

  if (jugadoresTienenIntentos) {
    eliminarFocusUsuarioPrevio()
    agregarFocusUsuarioActivo();

  } else {
    const isEmpate = jugadores[0].puntaje === jugadores[1].puntaje;
    const obtenerGanador = jugadores[0].puntaje > jugadores[1].puntaje ?  jugadores[0] : jugadores[1]
    desactivarLanzarDados();
    openModal();
    setMensajeJuegoTerminado(isEmpate ? null : obtenerGanador);
      imagenDado.classList.add('hidden');

      document.querySelector(`.player--${jugadorActivo}`).classList.add('player--winner');
      document.querySelector(`.player--${jugadorActivo}`).classList.remove('player--active');

  }
};



lanzarDado.addEventListener('click', function () {

  restarIntentos(jugadores[jugadorActivo]);

  let puedeLanzar = tieneIntentos(jugadores[jugadorActivo].intentos);

  if (puedeLanzar) {
      const dado = numeroDado();
      establecerImagenDado(dado);
      jugadores[jugadorActivo].puntaje += dado;
      mostrarPuntuajeTotalUsuario(jugadores[jugadorActivo].puntaje);

   } 
    else {
    desactivarLanzarDados();
    setUsuarioNoPuedeLanzar(jugadores[jugadorActivo]);
    openModal()
   }
});

///// controladores //////

cambiarTurno.addEventListener('click', cambiarJugador);
nuevoJuego.addEventListener('click', iniciarJuego);


iniciarJuego();


