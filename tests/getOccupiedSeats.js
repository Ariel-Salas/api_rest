const { getOccupiedSeats } = require('../controllers/passengers_copy'); // Asegúrate de que la ruta sea correcta

async function testGetOccupiedSeats() {
  const flight_id = 1; // Reemplaza con un ID de vuelo válido
  try {
    const occupiedSeats = await getOccupiedSeats(flight_id);
    console.log('Asientos ocupados:', occupiedSeats.length);
    console.log('Detalle de los asientos ocupados:', occupiedSeats);
  } catch (error) {
    console.error('Hubo un error al obtener los asientos ocupados:', error);
  }
}

testGetOccupiedSeats();





