const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "dbadm",
  password: process.env.DB_PASSWORD || "P@ssw0rd",
  database: process.env.DB_NAME || "scooter_sharing",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
