require('dotenv').config()
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexión a la BD exitosa.'))
  .catch((error) => console.error('Error de conexión a la BD:', error));

module.exports = sequelize;
