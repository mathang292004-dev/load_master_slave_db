const mysql = require('mysql2');

// Master DB (Write operations)
const master = mysql.createConnection({
  host: '172.31.20.141',
  user: 'movieuser',
  password: 'movie123',
  database: 'movie_app'
});

// Slave DB (Read operations)
const slave = mysql.createConnection({
  host: '172.31.24.174',
  user: 'root',
  password: 'password',
  database: 'movie_app'
});

module.exports = { master, slave };