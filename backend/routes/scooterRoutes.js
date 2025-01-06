const express = require("express");
const router = express.Router();
const scooterController = require("../controllers/scooterController");

router.get("/all", scooterController.getAll);

router.post("/add", scooterController.add);

router.post("/rent", scooterController.rent);

router.put("/updateBikePosition/:id", scooterController.updateBikePosition);

module.exports = router;
