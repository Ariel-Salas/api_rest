const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Passenger extends Sequelize.Model {}

Passenger.init({
    passenger_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    dni: DataTypes.INTEGER,
    name: DataTypes.STRING(255),
    age: DataTypes.INTEGER,
    country: DataTypes.STRING(255),
}, {
    sequelize,
    tableName: "passenger",
    timestamps: false
});

module.exports = Passenger;
