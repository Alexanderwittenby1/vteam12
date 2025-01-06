const db = require("../config/dbConfig");

const getAllStationsFromDb = async (callback) => {
  db.query("SELECT * FROM ChargingStation", (error, stations) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, stations);
  });
};

const getStationByIdFromDb = async (stationId, callback) => {
  db.query(
    "SELECT * FROM ChargingStation WHERE station_id = ?",
    [stationId],
    (error, station) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, station[0]);
    }
  );
};

const getAllParkingStationsFromDb = async (callback) => {
  db.query("SELECT * FROM ParkingZone", (error, stations) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, stations);
  });
};

const getParkingById = async (stationId, callback) => {
  db.query(
    "SELECT * FROM ParkingZone WHERE station_id = ?",
    [stationId],
    (error, station) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, station[0]);
    }
  );
};

module.exports = {
  getAllStationsFromDb,
  getStationByIdFromDb,
  getAllParkingStationsFromDb,
  getParkingById,
};
