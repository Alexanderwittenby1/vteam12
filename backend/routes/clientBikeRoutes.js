const express = require("express");
const router = express.Router();
const clientBikeController = require("./../controllers/clientBikeController.js")

const dotenv = require("dotenv");
dotenv.config(); // Ladda miljövariabler från .env fil


const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.put("/bookbike", clientBikeController.bookBike);

router.put("/stopclientbike", clientBikeController.stopClientBike);

router.put("/moveclientbike", clientBikeController.moveClientBike);

router.put("/startsimulation", clientBikeController.startSimulation);

module.exports = router