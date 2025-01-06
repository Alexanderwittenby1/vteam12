const scooterModel = require("../models/scooterModel");

exports.getAll = (req, res) => {
  scooterModel.getAllScootersFromdb((error, scooters) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: "Internt serverfel" });
      
    }
    res.status(200).json(scooters);
  });
};

exports.add = (req, res) => {
  console.log("Body:", req.body);
  scooterModel.addScooterToDb(req.body, (error, result) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error: "Internt serverfel gg" });
    }
    res.status(200).json(result);
  });
};

exports.updateBikePosition = (req, res) => {
  const scooterId = req.params.id;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  scooterModel.updateBikePositionInDb(
    scooterId,
    latitude,
    longitude,
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Position updated successfully" });
    }
  );
};


exports.rent = (req, res) => {
  const { scooter_id, user_id } = req.body;
  scooterModel.rentScooter(scooter_id, user_id, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internt serverfel" });
    }
    res.status(200).json(result);
  });
};
