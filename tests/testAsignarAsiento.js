const { assignSeats, getAvailableSeats } = require('../controllers/passengers');

async function testAssignSeats(flight_id) {
    try {
      // Reemplaza con un ID de avión válido para el test 1
      const airplane_id = 1; 
      console.log("Asientos disponibles antes de asignar:");
      const availableSeats = await getAvailableSeats(airplane_id, flight_id);
      console.log(availableSeats);
      
      console.log("Resultado de asignación de asientos:");
      const seatAssignments = await assignSeats(flight_id);
      console.log(seatAssignments);
    } catch (error) {
      console.error("Error en la prueba:", error);
    }
  }
  
  // Reemplaza con un ID de vuelo válido para el test 1 
  const flight_id = 1; 
  testAssignSeats(flight_id);
  