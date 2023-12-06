// Importación de modelos y operadores necesarios
const { Flight, Passenger, Purchase, SeatType, Seat, BoardingPass, Airplane } = require('../models/index');
const { Op } = require('sequelize');
const fs = require('fs');
const flight_Id=1;
const airplane_id=1;


//obtiene los asientos de un vuelo
const getSeatsForFlight = async (flight_id) => {
    try {
        const flight = await Flight.findOne({ where: { flight_id } });
        const airplane_id = flight.airplane_id;

        const seats = await Seat.findAll({ where: { airplane_id } });
        return seats;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
};

// Asiento ocupados por vuelo
const getOccupiedSeatsForFlight = async (flight_Id) => {
    try {
        const occupiedSeats = await BoardingPass.findAll({ 
            where: { flight_id: flight_Id }, 
            include: [{ model: Seat }]
        });

        // Mapea los resultados para obtener la información detallada del asiento
        return occupiedSeats
            .filter(boardingPass => boardingPass.Seat !== null)
            .map(boardingPass => boardingPass.Seat);
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
};



const createSeatMatrixForFlight = async (flight_id) => {
    const seats = await getSeatsForFlight(flight_id);
    const occupiedSeatsArray = await getOccupiedSeatsForFlight(flight_id);
    // Convertimos occupiedSeatsArray en un Set para facilitar la comprobación
    const occupiedSeatsSet = new Set(occupiedSeatsArray.map(seat => seat.seat_id));

    const seatMatrix = {};

    seats.forEach(seat => {
        const row = seat.seat_row;
        const column = seat.seat_column;

        if (!seatMatrix[row]) {
            seatMatrix[row] = {};
        }

        seatMatrix[row][column] = {
            seat_info: seat,
            is_occupied: occupiedSeatsSet.has(seat.seat_id)
        };
    });

    return seatMatrix;
};





























//funcion que arroja el numro de asientos tomados 
const getOccupiedSeatsForFlightSindetalle = async (flight_Id) => {
    try {
        const occupiedSeats = await BoardingPass.findAll({ 
            where: { flight_id: flight_Id }, 
            attributes: ['seat_id'] 
        });
        return new Set(occupiedSeats.map(seat => seat.seat_id));
    } catch (error) {
        console.error('An error occurred:', error);
        return new Set();
    }
};






//Obtener los asientos disponibles
const getAvailableSeats = async (airplane_id) => {
    const seatMatrix = await createSeatMatrix(airplane_id);
    const occupiedSeats = await getOccupiedSeats();
    const availableSeats = [];
  
    for (const row of Object.keys(seatMatrix)) {
      for (const column of Object.keys(seatMatrix[row])) {
        const seat = seatMatrix[row][column];
        if (!occupiedSeats.has(seat.seat_id)) availableSeats.push(seat);
      }
    }
  
    return availableSeats;
  };
  






//Implementación de pases de abordar


//obtener las personas sin asiento 
const getPassengersWithoutSeats = async (flight_id) => {
    try {const passengersWithoutSeats = await BoardingPass.findAll({where: {seat_id: null,flight_id }});
        return passengersWithoutSeats;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    }
};

  

  //obtener a las personas con asiento 
  const getPassengersWithSeats = async () => {
    try {const passengersWithSeats = await BoardingPass.findAll({where: {seat_id: {[Op.not]: null}}});
      return passengersWithSeats;
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  };
  

//Pases de abordar segun id 
  async function getPassengerById(passengerId) {
    try {
      const passenger = await Passenger.findByPk(passengerId);
      return passenger;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }
  

// Obtener todos los pases de abordar para un vuelo específico
async function getAllBoardingPasses(flightId) {
    try {
      const boardingPasses = await BoardingPass.findAll({
        where: { flight_id: flightId } // Asume que el modelo tiene una columna 'flight_id'
      });
      return boardingPasses;
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    }
  }




  // Intercalar entre edades mínimas y máximas
  function interleaveMinAndMax(group) {
    group.sort((a, b) => a.passenger.age - b.passenger.age);
  
    const interleavedGroup = [];
    let start = 0;
    let end = group.length - 1;
  
    while (start <= end) {
      if (start === end) {
        interleavedGroup.push(group[start]);
      } else {
        interleavedGroup.push(group[start], group[end]);
      }
      start++;
      end--;
    }

    return interleavedGroup;
  }
  

// Agrupar pases de abordar por compra
async function groupByPurchase(boardingPasses, getPassengerById) {
    const groups = {};
    for (const bp of boardingPasses) {
      const purchaseId = bp.purchase_id;
      if (!groups[purchaseId]) groups[purchaseId] = [];
      groups[purchaseId].push(bp);
    }
  
    for (const purchaseId in groups) {
      await Promise.all(groups[purchaseId].map(async bp => {
        bp.passenger = await getPassengerById(bp.passenger_id);
      }));
  
      groups[purchaseId] = interleaveMinAndMax(groups[purchaseId]);
    }
  
    return groups;
  }











  

  getSeatsForFlight(flight_Id).then(seats => {
      const seatsJson = JSON.stringify(seats, null, 2);
      fs.writeFileSync(`seatsForFlight${flight_Id}.json`, seatsJson);
      console.log(`Seats for flight ${flight_Id}:`, seats);
  });
  

  getOccupiedSeatsForFlight(flight_Id).then(occupiedSeats => {
    const occupiedSeatsArray = [...occupiedSeats]; // Convertir el conjunto en un array
    const occupiedSeatsJson = JSON.stringify(occupiedSeatsArray, null, 2);
    fs.writeFileSync(`occupiedSeatsForFlight${flight_Id}.json`, occupiedSeatsJson);
    console.log(`Occupied seats for flight ${flight_Id}:`, occupiedSeatsArray);
});



createSeatMatrixForFlight(flight_Id).then(seatMatrix => {
    const seatMatrixJson = JSON.stringify(seatMatrix, null, 2);
    fs.writeFileSync(`seatMatrixForFlight${flight_Id}.json`, seatMatrixJson);
    console.log(`Seat Matrix for flight ${flight_Id} saved.`);
});
















  
// //   // Uso de la función obtener asientos disponibles 
//   getAvailableSeats(airplane_id).then(availableSeats => {
//     const availableSeatsJson = JSON.stringify(availableSeats, null, 2);
//     fs.writeFileSync('availableSeats.json', availableSeatsJson);
//     console.log('Available Seats written to availableSeats.json');
//   });



