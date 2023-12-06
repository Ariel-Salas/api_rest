// Importación de modelos y operadores necesarios
const { Flight, Passenger, Purchase, SeatType, Seat, BoardingPass } = require('../models/index');
const { Op } = require('sequelize');

// Obtener los asientos disponibles para un avión y vuelo determinados
async function getAvailableSeats(airplane_id, flight_id) {
    const takenSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.ne]: null } } });
    const takenSeatIds = takenSeats.map(bp => bp.seat_id);
    return await Seat.findAll({ where: { airplane_id, seat_id: { [Op.notIn]: takenSeatIds } } }); 
}




//función para realizar test
const getTakenSeatsAndIds = async (flight_id)=>{
  const takenSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.ne]: null } } });
  const takenSeatIds = takenSeats.map(bp => bp.seat_id);
  return {takenSeats,takenSeatIds}
} 





// Agrupar pases de abordar por compra
function groupByPurchase(boardingPasses) {
  const groups = {};
  for (const bp of boardingPasses) {
    const purchaseId = bp.purchase_id;
    if (!groups[purchaseId]) groups[purchaseId] = [];
    groups[purchaseId].push(bp);
  }
  return groups;
}



// Inicializar mapa de asientos, marcando los ya tomados
function initializeSeatMap(availableSeats, takenSeatIds) {
  const seatMap = {};
  for (const seat of availableSeats) {
    const row = seat.seat_row;
    const column = seat.seat_column;
    if (!seatMap[row]) seatMap[row] = {};
    seatMap[row][column] = { seat, isTaken: takenSeatIds.includes(seat.seat_id) };
  }
  return seatMap;
}


// Encontrar asientos contiguos disponibles en el mapa de asientos
function findContiguousSeats(seatMap, groupSize, seatsOfType) {
  const availableSeatsByType = new Set(seatsOfType.map(seat => seat.seat_id));

  for (const row in seatMap) {
    const columns = Object.keys(seatMap[row]);
    for (let i = 0; i <= columns.length - groupSize; i++) {
      let contiguousSeats = [];
      for (let j = 0; j < groupSize; j++) {
        const seat = seatMap[row][columns[i + j]].seat;
        if (!seatMap[row][columns[i + j]].isTaken && availableSeatsByType.has(seat.seat_id)) {
          contiguousSeats.push(seat);
        } else {
          contiguousSeats = [];
          break;
        }
      }
      if (contiguousSeats.length === groupSize) {
        // Marcar los asientos contiguos como tomados inmediatamente en seatMap
        contiguousSeats.forEach(seat => {
          seatMap[seat.seat_row][seat.seat_column].isTaken = true;
          
        });
        return contiguousSeats;
      }
    }
  }
  return null;
}

    // Filtrar asientos por tipo
    function filterSeatsByType(seats, seatTypeId) {
    return seats.filter(seat => seat.seat_type_id === seatTypeId);
    }


function assignSeatsToGroup(seats, group, seatMap) {
  for (let i = 0; i < group.length; i++) {
    const seat = seats[i];
    const row = seat.seat_row;
    const column = seat.seat_column;

    // Verifica si el asiento ya está tomado antes de asignarlo, acá hay un problema
    if (seatMap[row][column].isTaken) {
      console.error(`El asiento ${seat.seat_id} ya está asignado. Encuentra un asiento diferente.`);
      // Encuentra un asiento alternativo
      const alternateSeat = findAlternateSeat(seatMap);
      if (alternateSeat) {
        group[i].seat_id = alternateSeat.seat_id;
        seatMap[alternateSeat.seat_row][alternateSeat.seat_column].isTaken = true; // Actualiza el seatMap
      } else {
        console.error(`No se pudo encontrar un asiento alternativo para el pasajero ${group[i].passenger_id}.`);
      }
    } else {
      group[i].seat_id = seat.seat_id;
      seatMap[row][column].isTaken = true; // Actualiza el seatMap
    }
  }
}

function findAlternateSeat(seatMap) {
  // Recorre el seatMap en busca de un asiento no asignado
  for (const row in seatMap) {
    for (const column in seatMap[row]) {
      if (!seatMap[row][column].isTaken) {
        seatMap[row][column].isTaken = true; // Marca el asiento como tomado
        return seatMap[row][column].seat; // Retorna el asiento encontrado
      }
    }
  }
  return null; // Retorna null si no se encuentra un asiento alternativo
}

// Función principal para asignar asientos a un vuelo
async function assignSeats(flight_id) {
  try {
    const flight = await Flight.findOne({ where: { flight_id } });
    const airplane_id = flight.airplane_id;
    const takenSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.ne]: null } } });
    const takenSeatIds = takenSeats.map(bp => bp.seat_id);
    const availableSeats = await getAvailableSeats(airplane_id, flight_id); // Obtener los asientos disponibles antes de inicializar el mapa
    const seatMap = initializeSeatMap(availableSeats, takenSeatIds); // Pasar los asientos tomados a la función de inicialización

    const boardingPasses = await BoardingPass.findAll({
      where: { flight_id },
      include: [Passenger, SeatType, Purchase]
    });

    const groups = groupByPurchase(boardingPasses);
    const seatAssignments = [];

    for (const purchaseId in groups) {
      const group = groups[purchaseId];
      const seatsOfType = filterSeatsByType(availableSeats, group[0].seat_type_id);
      let contiguousSeats = findContiguousSeats(seatMap, group.length, seatsOfType);

      if (!contiguousSeats) {
        contiguousSeats = seatsOfType.slice(0, group.length);
      }

      if (contiguousSeats.length < group.length) {
        // Deno implementar mas Lógica para manejar este caso
        
    } else {
      assignSeatsToGroup(contiguousSeats, group, seatMap);

        // Incluir todos los grupos en seatAssignments
      }
      seatAssignments.push({ purchaseId, seats: contiguousSeats, boardingPasses: group }); 
    }

    return seatAssignments;

    
    } catch (error) {
      console.error("Error assigning seats:", error);
      throw error;
    }
  }
  
// Crear una respuesta JSON con la información de asientos asignados
  async function createResponseJson(flight_id) {
    try {
      const flight = await Flight.findOne({ where: { flight_id } });
      const seatAssignments = await assignSeats(flight_id);
  
      const responseJson = {
        code: 200,
        data: {
          flightId: Number(flight_id),
          takeoffDateTime: flight.takeoff_date_time, 
          takeoffAirport: flight.takeoff_airport,
          landingDateTime: flight.landing_date_time,
          landingAirport: flight.landing_airport,
          airplaneId: flight.airplane_id,
          passengers: seatAssignments.map(group => group.boardingPasses.map(bp => ({
            passengerId: bp.passenger_id,
            dni: Number(bp.Passenger.dni),
            name: bp.Passenger.name,
            age: bp.Passenger.age,
            country: bp.Passenger.country,
            boardingPassId: bp.boarding_pass_id,
            purchaseId: Number(group.purchaseId),
            seatTypeId: bp.seat_type_id,
            seatId: Number(bp.seat_id)
          }))).flat()
        }
      };
  
      return responseJson;
    } catch (error) {
      console.error("Error creating response JSON:", error);
      throw error;
    }
  }

  createResponseJson()
  .then(responseJson => {
    console.log(JSON.stringify(responseJson, null, 2));
  })
  .catch(error => {
    console.error("Error:", error);
  });

// Exportación de funciones para su uso en otros archivos
  module.exports = { assignSeats, getAvailableSeats,createResponseJson,getTakenSeatsAndIds};