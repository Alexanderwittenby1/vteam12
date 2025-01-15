const simulationModel = require("../models/simulationModel");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const generateToken = require("../services/authService");

exports.deleteSimulation = (req, res) => {
  simulationModel.deleteSimulation(
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Simulation deleted" });
      }
    );
}

exports.addMoney = async (req, res) => {
    const simulation_id = req.body.simulation_id;
    const amount = req.body.amount; // Remove the destructuring

    if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
    }

    try {
        await simulationModel.addMoney(simulation_id, amount);
        res.status(200).json({ message: "Money added successfully" });
    } catch (error) {
        console.error("Error adding money:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.bookBike = async (req, res) => {
  const simulation_id = req.body.simulation_id;

  try {
      await simulationModel.bookBike(simulation_id);
      res.status(200).json({ message: "Bike booked succefully" });
  } catch (error) {
      console.error("Error booking bike:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllTrips = async (req, res) => {
  
  simulationModel.getAllTrips( (error, trips) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(trips);
  });
};

exports.setBikeUserId = async (req, res) => {
  const user_id = req.body.user_id;
  const scooter_id = req.body.scooter_id;

  try {
      await simulationModel.setBikeUserId(scooter_id, user_id);
      res.status(200).json({ message: "Bike booked succefully" });
  } catch (error) {
      console.error("Error booking bike:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateStatus = async (req, res) => {
  const simulation_id = req.body.simulation_id;
  const status = req.body.status;

  simulationModel.updateStatus(simulation_id, status, (error, user) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json({ status: "OK" });
  });
};

exports.getUserBikeId = async (req, res) => {
  const simulation_id = req.body.simulation_id;
  
  simulationModel.getUserBikeId(simulation_id, (error, user) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(user);
  });
};

exports.setMoney = async (req, res) => {
  const {simulation_id, amount, user_id} = req.body;

  try {
      await simulationModel.setMoney(simulation_id, amount, user_id);
      res.status(200).json({ message: "money set succefully" });
  } catch (error) {
      console.error("Error booking bike:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBikePosition = (req, res) => {
  const { simulation_id, latitude, longitude, speed, battery_level} = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

    simulationModel.updateBikePositionInDb(
    simulation_id,
    latitude,
    longitude,
    speed,
    battery_level,
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Position updated successfully" });
    }
  );
};

exports.registerUser = async (req, res) => {
  const { email, password, simulation_id } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-post och lösenord krävs" });
  }
  try {
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedPassword = password;
    const userData = { email, password: hashedPassword, simulation_id };

    simulationModel.createUser(userData, (error, userId) => {
      if (error) {
        console.error("Fel vid skapande av användare:", error);
        return res.status(500).json({ error: "Kunde inte skapa användaren" });
      }
      res.status(201).json({ message: "Användare skapad", userId });
    });
  } catch (error) {
    console.error("Fel vid skapande av användare:", error);
    return res.status(500).json({ error: "Kunde inte skapa användaren" });
  }
};

exports.addTrip = async (req, res) => {
  // console.log("User from token:", req.user);

  const {
    user_id,
    scooter_id,
    simulation_id,
    start_time,
    end_time,
    start_location,
    end_location,
    distance,
    cost,
    time_fee,
    parking_fee,
    payment_status,
  } = req.body;

  if (
    !start_time ||
    !start_location ||
    !payment_status
  ) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: {
        start_time,
        start_location,
        simulation_id,
        payment_status,
      },
    });
  }

  const tripData = {
    user_id,
    scooter_id,
    simulation_id,
    start_time,
    end_time,
    start_location,
    end_location,
    distance,
    cost,
    time_fee,
    parking_fee,
    payment_status,
  };

  simulationModel.addTrip(tripData, (error, insertId) => {
    if (error) {
        console.error('Error adding trip:', error);
        return;
    }
    console.log('Trip added successfully with ID:',insertId);
    res.status(201).json({ message: "Trip skapad"});
});

};