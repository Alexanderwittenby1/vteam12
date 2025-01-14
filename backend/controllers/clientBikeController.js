const clientBikeModel = require("./../models/clientBikeModel.js");
const simulationModel = require("./../models/simulationModel.js")
exports.bookBike = async (req, res) => {
    try {

      const { user_id, simulation_id, scooter_id } = req.body;
      if ((!user_id || !simulation_id || !scooter_id) && simulation_id != 0) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields in controller"
        });
      }
  
      const payload = {
        user_id: user_id,
        simulation_id: simulation_id,
        scooter_id: scooter_id
      };
  
      const result = await clientBikeModel.bookBike(payload);
      return res.status(200).json({
        status: "success",
        message: "Bike booked successfully",
        data: result
      });
  
    } catch (error) {
      console.error('Bike booking error:', error);
      return res.status(500).json({
        status: "error",
        message: "Failed to book bike",
        error: error.message
      });
    }
  };

exports.stopClientBike = async (req, res) => {
    try {
      const payload = {
        scooter_id: req.body.scooter_id
      };
  
      await clientBikeModel.stopClientBike(payload);
      res.status(200).json({ status: "OK bike booked" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

exports.moveClientBike = async (req, res) => {
    // coords ska se ut enligt följande:
    // coords {
    //     lat: 54.31221
    //     lng: 13.4312
    // }
try {
    const payload = {
    scooter_id: req.body.scooter_id,
    coords: req.bod.coords
    };

    await clientBikeModel.moveClientBike(payload);
    res.status(200).json({ status: "OK bike booked" });
} catch (error) {
    res.status(500).json({ error: "Internal server error" });
}
};