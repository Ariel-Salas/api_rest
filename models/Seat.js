const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Airplane = require('./Airplane');
const SeatType = require('./SeatType');

class Seat extends Sequelize.Model {}

Seat.init({
    seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    seat_column: DataTypes.STRING(2),
    seat_row: DataTypes.INTEGER,
    seat_type_id: { type: DataTypes.INTEGER, references: { model: SeatType, key: 'seat_type_id' } },
    airplane_id: { type: DataTypes.INTEGER, references: { model: Airplane, key: 'airplane_id' } }
}, {
    sequelize,
    tableName: "seat",
    timestamps: false
});

module.exports = Seat;
