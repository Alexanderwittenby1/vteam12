const stationModel = require("../models/stationModel");

exports.getAll = (req, res) => {
  stationModel.getAllStationsFromDb((error, stations) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(stations);
  });
};

exports.getById = (req, res) => {
  const stationId = req.params.id;
  stationModel.getStationByIdFromDb(stationId, (error, station) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!station) {
      return res.status(404).json({ error: "Station not found" });
    }
    res.status(200).json(station);
  });
};

exports.getAllParkingStations = (req, res) => {
  stationModel.getAllParkingStationsFromDb((error, stations) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(stations);
  });
};

exports.getParkingById = (req, res) => {
  const stationId = req.params.id;
  stationModel.getStationByIdFromDb(stationId, (error, station) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!station) {
      return res.status(404).json({ error: "Station not found" });
    }
    res.status(200).json(station);
  });
};
