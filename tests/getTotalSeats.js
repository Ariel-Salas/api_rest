const { getAvailableSeats,getTotalSeats } = require('../controllers/passengers_copy');

// Un valor de prueba para airplane_id y flight_id
const assert = require('assert');
// const getTotalSeats = require('../controllers/passengers_copy'); // Ajusta la ruta según tu estructura de carpetas

const Seat = {
  findAll: async function (query) {
    // Aquí puedes devolver un conjunto de datos falso que representaría lo que se encontraría en la base de datos
    return [
      { seatNumber: '1A' },
      { seatNumber: '1B' }
      // ...otros asientos...
    ];
  }
};

// Test getTotalSeats
async function testGetTotalSeats() {
  // Sobrescribe la variable global Seat con la implementación falsa
  global.Seat = Seat;

  // Llama a la función con un airplane_id de prueba
  const result = await getTotalSeats('1');

  // Imprime el resultado en la consola
  console.log('Resultado de getTotalSeats:', result);

  // También puedes realizar alguna aserción para comprobar que el resultado sea lo que esperas
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].seatNumber, '1A');
  assert.strictEqual(result[1].seatNumber, '1B');

  console.log('¡Prueba pasada!');
}

// Ejecuta la prueba
testGetTotalSeats().catch(error => console.error(error));




  