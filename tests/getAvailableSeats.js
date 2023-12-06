const { getAvailableSeats } = require('../controllers/passengers_copy61');

// Un valor de prueba para airplane_id y flight_id
const airplane_id = 1;
const flight_id = 1;

// Prueba para obtener asientos disponibles
getAvailableSeats(airplane_id, flight_id)
  .then(seats => {
    console.log("numero de asientos disponibles:", seats.length);
  })
  .catch(error => {
    console.error("Error:", error);
  });



  