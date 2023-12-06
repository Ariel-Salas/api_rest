const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Airplane extends Sequelize.Model {}

Airplane.init({
    airplane_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING(255),
}, {
    sequelize,
    tableName: "airplane",
    timestamps: false
});

module.exports = Airplane;
