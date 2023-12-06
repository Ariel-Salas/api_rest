const { getTakenSeat,getAvailableSeat } = require('../controllers/passengers copy');

const fs = require('fs');

const flight_id = 1; // Puedes establecer la ID del vuelo para la prueba aquí

getTakenSeat(flight_id).then(({ takenSeats, takenSeatIds }) => {
  fs.writeFileSync('flight_log.json', JSON.stringify({ takenSeats, takenSeatIds }, null, 2));
  console.log(`Hay ${takenSeats.length} asientos tomados en el vuelo ${flight_id}.`);
  console.log(`Los IDs de los asientos tomados son: ${takenSeatIds.join(', ')}`);
});

getAvailableSeat(flight_id).then(({ availableSeats }) => {
  // Agregar a flight_log.json sin sobrescribir los datos existentes
  fs.readFile('flight_log.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo el archivo:', err);
      return;
    }
    const jsonContent = JSON.parse(data);
    jsonContent.availableSeats = availableSeats;
    fs.writeFileSync('flight_log.json', JSON.stringify(jsonContent, null, 2));
    console.log(`Hay ${availableSeats.length} asientos no tomados en el vuelo ${flight_id}.`);
    console.log(`Los asientos no tomados son: ${availableSeats.map(seat => seat.seat_id).join(', ')}`);
  });
});

