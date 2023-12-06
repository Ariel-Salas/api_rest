const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class SeatType extends Sequelize.Model {}

SeatType.init({
    seat_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING(255),
}, {
    sequelize,
    tableName: "seat_type",
    timestamps: false
});

module.exports = SeatType;
