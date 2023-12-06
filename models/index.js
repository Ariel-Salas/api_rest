const Airplane = require('./Airplane');
const Flight = require('./Flight');
const Passenger = require('./Passenger');
const Purchase = require('./Purchase');
const SeatType = require('./SeatType');
const Seat = require('./Seat');
const BoardingPass = require('./BoardingPass');

// Definiendo las relaciones
Airplane.hasMany(Flight, { foreignKey: 'airplane_id' });
Flight.belongsTo(Airplane, { foreignKey: 'airplane_id' });

SeatType.hasMany(Seat, { foreignKey: 'seat_type_id' });
Seat.belongsTo(SeatType, { foreignKey: 'seat_type_id' });

Airplane.hasMany(Seat, { foreignKey: 'airplane_id' });
Seat.belongsTo(Airplane, { foreignKey: 'airplane_id' });

Purchase.hasMany(BoardingPass, { foreignKey: 'purchase_id' });
BoardingPass.belongsTo(Purchase, { foreignKey: 'purchase_id' });

Passenger.hasMany(BoardingPass, { foreignKey: 'passenger_id' });
BoardingPass.belongsTo(Passenger, { foreignKey: 'passenger_id' });

SeatType.hasMany(BoardingPass, { foreignKey: 'seat_type_id' });
BoardingPass.belongsTo(SeatType, { foreignKey: 'seat_type_id' });

Seat.hasMany(BoardingPass, { foreignKey: 'seat_id' });
BoardingPass.belongsTo(Seat, { foreignKey: 'seat_id' });

Flight.hasMany(BoardingPass, { foreignKey: 'flight_id' });
BoardingPass.belongsTo(Flight, { foreignKey: 'flight_id' });

// Exportando todos los modelos
module.exports = {
    Airplane,
    Flight,
    Passenger,
    Purchase,
    SeatType,
    Seat,
    BoardingPass
};
