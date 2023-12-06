const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Airplane = require('./Airplane'); // Importando el modelo Airplane si es necesario

class Flight extends Sequelize.Model {}

Flight.init({
    flight_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    takeoff_date_time: DataTypes.DATE,
    takeoff_airport: DataTypes.STRING(255),
    landing_date_time: DataTypes.DATE,
    landing_airport: DataTypes.STRING(255),
    airplane_id: { type: DataTypes.INTEGER, references: { model: Airplane, key: 'airplane_id' } }
}, {
    sequelize,
    tableName: "flight",
    timestamps: false
});

module.exports = Flight;
