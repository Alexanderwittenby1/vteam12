const express = require('express');
const router = express.Router();
const cbSimulation =  require("./clientBikeSimulation.js")
router.post('/startsimulation', async (req, res) => {
    try {
        const amount = req.body.amount;
        await cbSimulation.clientBikeSimulation(amount)
        return res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({
            status: "error",
            message: "Server error processing test booking",
            error: error.message
        });
    }
});

router.put('/stopbike', async (req, res) => {
    try {
        const simulation_id = req.body.simulation_id;
        await cbSimulation.stopBike(simulation_id)
        return res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({
            status: "error",
            message: "Server error processing test booking",
            error: error.message
        });
    }
});

router.put('/movebike', async (req, res) => {
    try {
        const simulation_id = req.body.simulation_id;
        const coords = req.body.coords;
        // console.log("movebike", simulation_id, coords);
        await cbSimulation.moveClientBike(simulation_id, coords);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(500).json({ 
            status: "error",
            message: error.message 
        });
    }
});


router.put('/bookbike', async (req, res) => {
    // console.log("boobike express")
    try {
        const { scooter_id, user_id, simulation_id } = req.body;
        
        if (!scooter_id || !user_id) {
            return res.status(400).json({
                status: "error",
                message: "Missing required parameters in simulation express"
            });
        }
    
        await cbSimulation.bookBike(scooter_id, user_id, simulation_id);
        return res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.error('Route error:', error);
        return res.status(500).json({
            status: "error",
            message: "Server error processing test booking",
            error: error.message
        });
    }
});

module.exports = router;
