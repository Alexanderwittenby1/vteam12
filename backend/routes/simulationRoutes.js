const express = require("express");
const router = express.Router();
const simulationController = require("../controllers/simulationController");
const adminController = require("../controllers/adminController")

const dotenv = require("dotenv");
dotenv.config(); // Ladda miljövariabler från .env fil


const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/register", simulationController.registerUser);

router.post("/addTrip",  simulationController.addTrip);

router.put("/addMoney", simulationController.addMoney);

router.put("/updateStatus", simulationController.updateStatus);

router.put("/setMoney", simulationController.setMoney);

router.put("/bookBike", simulationController.bookBike);

router.post("/getuserbikeid", simulationController.getUserBikeId);

router.post("/deletesimulation", simulationController.deleteSimulation);

router.put("/updateBikePosition", simulationController.updateBikePosition);

router.get("/", adminController.getAllUsers);

module.exports = router