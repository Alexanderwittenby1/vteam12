const db = require("../config/dbConfig"); // Importera din databasanslutning

getAllScootersFromdb = (callback) => {
  db.query("SELECT * FROM Scooter;", (error, results) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
};

getRecentTrips = (callback) => {
  db.query(
    "SELECT * FROM Trip ORDER BY trip_id DESC LIMIT 10;",
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    }
  );
};

const addScooterToDb = (scooterData, callback) => {
  // console.log("scooterData", scooterData.city_id);
  // console.log("scooterData", scooterData.latitude);
  // console.log("scooterData", scooterData.longitude);
  // console.log("scooterData", scooterData.battery_level);
  // console.log("scooterData", scooterData.is_available);
  // console.log("scooterData", scooterData.needs_service);
  // console.log("scooterData", scooterData.is_charging);
  // console.log("scooterData", scooterData.last_maintenance);
  // console.log("scooterData", scooterData.status);
  db.query(
    "INSERT INTO Scooter (city_id, latitude, longitude, battery_level, is_available, needs_service, is_charging, last_maintenance, simulation_id, status) VALUES (?,?,?,?,?,?,?,?,?,?);",
    [
      scooterData.city_id,
      scooterData.latitude,
      scooterData.longitude,
      scooterData.battery_level,
      scooterData.is_available,
      scooterData.needs_service,
      scooterData.is_charging,
      scooterData.last_maintenance,
      scooterData.simulation_id,
      scooterData.status
    ],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    }
  );
};

const updateBikePositionInDb = (scooterId, latitude, longitude, callback) => {
  const sql =
    "UPDATE Scooter SET latitude = ?, longitude = ? WHERE scooter_id = ?";
  db.query(sql, [latitude, longitude, scooterId], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};



const rentScooter = (scooter_id, user_id, callback) => {
  const sql = "CALL RentScooter(?, ?)";
  db.query(sql, [scooter_id, user_id], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  rentScooter,
  // andra funktioner...
};

module.exports = {
  getAllScootersFromdb,
  addScooterToDb,
  updateBikePositionInDb,
  rentScooter,
};
