// const mysql = require('mysql2')
require('dotenv').config();

console.log(process.env.MYSQL_LOCAL_PASS);
//
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_application',
//     password: process.env.MYSQL_LOCAL_PASS,
// });
//
// module.exports = pool.promise();

const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('node_application', 'root', process.env.MYSQL_LOCAL_PASS, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize