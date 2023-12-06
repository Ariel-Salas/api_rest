const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Purchase = require('./Purchase');
const Passenger = require('./Passenger');
const SeatType = require('./SeatType');
const Seat = require('./Seat');
const Flight = require('./Flight');

class BoardingPass extends Sequelize.Model {}

BoardingPass.init({
    boarding_pass_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    purchase_id: { type: DataTypes.INTEGER, references: { model: Purchase, key: 'purchase_id' } },
    passenger_id: { type: DataTypes.INTEGER, references: { model: Passenger, key: 'passenger_id' } },
    seat_type_id: { type: DataTypes.INTEGER, references: { model: SeatType, key: 'seat_type_id' } },
    seat_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: Seat, key: 'seat_id' } },
    flight_id: { type: DataTypes.INTEGER, references: { model: Flight, key: 'flight_id' } }
}, {
    sequelize,
    tableName: "boarding_pass",
    timestamps: false
});

module.exports = BoardingPass;
