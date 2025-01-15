// const modules = require("../simulation/src/modules");
const db = require("../config/dbConfig");

const addTrip = (tripData, callback) => {
    db.query(
      "INSERT INTO Trip (user_id, scooter_id, simulation_id, start_time, end_time, start_location, end_location, distance, cost, time_fee, parking_fee, payment_status) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?), ST_GeomFromText(?), ?, ?, ?, ?, ?)",
      [
        tripData.user_id,
        tripData.scooter_id,
        tripData.simulation_id,
        tripData.start_time,
        tripData.end_time,
        `POINT(${tripData.start_location.lat} ${tripData.start_location.lng})`,
        `POINT(${tripData.end_location.lat} ${tripData.end_location.lng})`,
        tripData.distance,
        tripData.cost,
        tripData.time_fee,
        tripData.parking_fee,
        tripData.payment_status,
      ],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, results.insertId);
      }
    );
};

const addMoney = async (simulation_id, amount) => {
    db.query(
        "UPDATE user_table SET balance = balance + ? WHERE simulation_id = ?",
        [amount, simulation_id]
    );
};

const bookBike = async (simulation_id) => {
  db.query("CALL book_bike(?)", [simulation_id]);
};

const getUserById = (userId, callback) => {
    db.query(
      "SELECT * FROM user_table WHERE id = ?",
      [userId],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, results[0]);
      }
    );
  };

  const updateStatus = (simulation_id, status, callback) => {
    db.query(
      "UPDATE Scooter SET status = ? WHERE simulation_id = ?",
      [status, simulation_id],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        callback(null, results);
      }
    );
  };
  

  const getUserBikeId = (simulation_id, callback) => {
    const sql = "CALL get_user_bike_id(?)";
    db.query(sql, [simulation_id], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, results);
    });
};

const getAllTrips = (callback) => {
  const sql = "SELECT * FROM Trip";
  db.query(sql, (error, results) => {
      if (error) {
          return callback(error, null);
      }
      return callback(null, results);
  });
};

const deleteSimulation = (callback) => {
    const sql = "CALL delete_simulation()"
    db.query(sql, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
  }

const setMoney = (simulation_id, amount, user_id, callback = () => {}) => {
  const sql = "UPDATE user_table SET balance = ? WHERE simulation_id = ? OR user_id = ?";
  db.query(sql, [amount, simulation_id, user_id], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};


const setBikeUserId = (scooter_id, user_id, callback = () => {}) => {
  const sql = "UPDATE Scooter SET user_id = ? WHERE scooter_id = ?";
  db.query(sql, [user_id, scooter_id], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
};
  
  

  const updateBikePositionInDb = (simulation_id, latitude, longitude, speed, battery_level, callback) => {
    const sql =
      "UPDATE Scooter SET latitude = ?, longitude = ?, speed = ?, battery_level = ? WHERE simulation_id = ?";
    db.query(sql, [latitude, longitude, speed, battery_level, simulation_id], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  };

  const createUser = (userData, callback) => {
    db.query(
      "INSERT INTO user_table SET email = ?, password = ?, simulation_id = ?",
      [userData.email, userData.password, userData.simulation_id],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, results.insertId);
      }
    );
  };


module.exports = {
   "updateBikePositionInDb": updateBikePositionInDb,
    "deleteSimulation": deleteSimulation,
    "getUserById": getUserById,
    "addMoney": addMoney,
    "addTrip": addTrip,
    "createUser": createUser,
    "bookBike": bookBike,
    "setMoney": setMoney,
    "getUserBikeId": getUserBikeId,
    "updateStatus": updateStatus,
    "getUserBikeId": getUserBikeId,
    "setBikeUserId": setBikeUserId,
    "getAllTrips": getAllTrips
}