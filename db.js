const mysql = require('mysql');

require('dotenv').config();

const { env } = process;

function Database() {
  this.createPool = ({
    host, user, password, database
  }) => {
    this.pool = mysql.createPool({
      // connectionLimit: 10,
      host,
      user,
      password,
      database,
      multipleStatements: true,
      supportBigNumbers: true,
      bigNumberStrings: true
    });
    return this.pool;
  };
  this.escape = mysql.escape;
  this.escapeId = mysql.escapeId;
  this.format = mysql.format;
}

const db = new Database();
db.createPool({
  // connectionLimit: 10,
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME
});

module.exports = db;
