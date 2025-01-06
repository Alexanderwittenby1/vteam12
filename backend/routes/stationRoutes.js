const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");

// Hämtar alla laddningsstationer
router.get("/getAllChargingStations", stationController.getAll);
router.get("/getCharginstationById/:id", stationController.getById);

// Hämtar alla parkeringssationer
router.get("/getAllParkingStations", stationController.getAllParkingStations);
router.get("/getParkingstationById/:id", stationController.getParkingById);

module.exports = router;
