const db = require("./../config/dbConfig.js");


const intiateScooters = (amount, callback) => {
    db.query(
      "CALL InitiateScooters(?)",
      [amount],
      (error, results) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, results);
      }
    );
  };

  module.exports= {
    "intiateScooters": intiateScooters
  }