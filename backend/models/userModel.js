const db = require("../config/dbConfig");

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

const getAllUsers = (callback) => {
  db.query("SELECT * FROM user_table", (error, results) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM user_table WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results[0]);
      }
    );
  });
};

const createUser = (userData, callback) => {
  db.query(
    "INSERT INTO user_table SET email = ?, password = ?",
    [userData.email, userData.password],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results.insertId);
    }
  );
};

const getTripsByUserId = (userId, callback) => {
  db.query(
    "SELECT * FROM Trip WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    }
  );
};

// const addTrip = (tripData, callback) => {
//   db.query(
//     "INSERT INTO Trip (user_id, scooter_id, start_time, end_time, start_location, end_location, distance, cost, base_fee, time_fee, parking_fee, payment_status) VALUES (?, ?, ?, ?, ST_GeomFromText(?), ST_GeomFromText(?), ?, ?, ?, ?, ?, ?)",
//     [
//       tripData.user_id,
//       tripData.scooter_id,
//       tripData.start_time,
//       tripData.end_time,
//       `POINT(${tripData.start_location.lat} ${tripData.start_location.lng})`,
//       `POINT(${tripData.end_location.lat} ${tripData.end_location.lng})`,
//       tripData.distance,
//       tripData.cost,
//       tripData.base_fee,
//       tripData.time_fee,
//       tripData.parking_fee,
//       tripData.payment_status,
//     ],
//     (error, results) => {
//       if (error) {
//         return callback(error, null);
//       }
//       return callback(null, results.insertId);
//     }
//   );
// };

const updateUserPassword = (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user_table SET password = ? WHERE user_id = ?",
      [newPassword, userId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const updateLastLogin = async (userId) => {
  db.query("UPDATE user_table SET last_login = NOW() WHERE user_id = ?", [
    userId,
  ]);
};

const addMoney = async (userId, amount) => {
  db.query(
    "UPDATE user_table SET balance = balance + ? WHERE user_id = ?",
    [amount, userId]
  );
};



module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  getTripsByUserId,
  getAllUsers,
  updateUserPassword,
  updateLastLogin,
  addMoney,
};
