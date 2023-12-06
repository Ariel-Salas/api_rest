// Importación de modelos y operadores necesarios
const { Flight, Passenger, Purchase, SeatType, Seat, BoardingPass } = require('../models/index');
const { Op } = require('sequelize');
// const { getTakenSeatsAndIds } = require('./passengers');

// Obtener los asientos no disponibles osea ya tomados, para un avión y vuelo determinados,los asientos que son null son los disponibles

let flight_id = 1;

const getTakenSeat = async (flight_id) => {
  const takenSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.ne]: null } } });
  console.log('Taken Seats:', takenSeats);
  const takenSeatIds = takenSeats.map(bp => bp.seat_id);
  console.log('Taken Seat IDs:', takenSeatIds);
  return { takenSeats, takenSeatIds };
};

const getAvailableSeat = async (flight_id) => {
  const availableSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.eq]: null } } });
  console.log('Available Seats:', availableSeats);
  return { availableSeats };
};

function initializeSeatMap(availableSeat, takenSeatIds) {
  const seatMap = {};
  for (const seat of availableSeat) {
    const row = seat.seat_row;
    const column = seat.seat_column;
    if (!seatMap[row]) seatMap[row] = {};
    seatMap[row][column] = { seat, isTaken: takenSeatIds.includes(seat.seat_id) };
  }
  console.log('Seat Map Initialized:', seatMap);
  return seatMap;
}

const main = async () => {
  try {
    console.log('Fetching Available Seats...');
    const { availableSeats } = await getAvailableSeat(flight_id);
    console.log('Fetching Taken Seats...');
    const { takenSeats, takenSeatIds } = await getTakenSeat(flight_id);
    console.log('Initializing Seat Map...');
    const seatMap = initializeSeatMap(availableSeats, takenSeatIds);
    console.log('Final Seat Map:', seatMap);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

main();


  


    // return await Seat.findAll({ where: { airplane_id, seat_id: { [Op.notIn]: takenSeatIds } } }); 


// const getTakenSeatsAndIds = async(flight_id)=>{
  //   const takenSeats = await BoardingPass.findAll({ where: { flight_id, seat_id: { [Op.ne]: null } } });
  //   const takenSeatIds = takenSeats.map(bp => bp.seat_id);
  //   return {takenSeats,takenSeatIds};
  // }





  module.exports = { initializeSeatMap,getAvailableSeat,getTakenSeat};