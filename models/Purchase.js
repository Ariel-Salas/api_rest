const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Purchase extends Sequelize.Model {}

Purchase.init({
    purchase_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    purchase_date: DataTypes.DATE,
}, {
    sequelize,
    tableName: "purchase",
    timestamps: false
});

module.exports = Purchase;
