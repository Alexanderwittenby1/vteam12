const clientBikeModel = require("./../models/clientBikeModel.js");

exports.bookBike = async (req, res) => {
  try {
    const payload = {
      user_id: req.body.userId,
      email: req.body.email,
      scooter_id: req.body.scooter_id
    };

    await clientBikeModel.bookBike(payload);
    res.status(200).json({ status: "OK bike booked" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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