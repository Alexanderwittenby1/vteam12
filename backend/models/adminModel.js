const db = require("../config/dbConfig"); // Importera din databasanslutning

getAllUsers = (callback) => {
  db.query("SELECT * FROM user_table;", (error, results) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
};

const getUserById = (userId, callback) => {
  db.query(
    "SELECT * FROM user_table WHERE user_id = ?;",
    [userId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results[0]);
    }
  );
};

const updateUser = async (userId, userData) => {
  console.log("User ID:", userId);
  console.log("User data:", userData);

  if (!userData || typeof userData !== 'object') {
    throw new TypeError('userData must be a non-null object');
  }

  const fields = [];
  const values = [];
  

  if (userData.email) {
    fields.push("email = ?");
    values.push(userData.email);
  }

  if (userData.password) {
    fields.push("password = ?");
    values.push(userData.password);
  }

  if (userData.role) {
    fields.push("role = ?");
    values.push(userData.role);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }
  console.log("values",values);
  values.push(userId);

  const sql = `UPDATE user_table SET ${fields.join(", ")} WHERE user_id = ?`;

  db.query(sql, values, (error, results) => {
    if (error) {
      throw error;
    }
    return results;
  });
};

const deleteUser = async (userId, callback) => {
  db.query(
    "DELETE FROM user_table WHERE user_id = ?;",
    [userId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    }
  );
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
