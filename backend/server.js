const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const logEvents = require("./middleware/logEvents");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const scooterRoutes = require("./routes/scooterRoutes");
const stationRoutes = require("./routes/stationRoutes");
const userController = require("./controllers/userController");
const simulationRoutes = require("./routes/simulationRoutes.js");
const clientBikeRoutes = require("./routes/clientBikeRoutes.js");
const http = require("http");
const handleWebSocket = require("./webSocketHandler");
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Skapa en HTTP-server
const server = http.createServer(app);
server.listen(8080, () => {
  console.log('WebSocket server running on port 8080');
});
// Använd WebSocket-hanteraren
handleWebSocket(server);

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    const userId = event.data.object.metadata.userId;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`Betalning mottagen från användare: ${userId}`);
      const amountPaid = paymentIntent.amount_received; // Beloppet som betalades (i minsta enhet, t.ex. ören)
      console.log(`Betalning mottagen: ${amountPaid} SEK från användare: ${userId}`);
      userController.updateUserBalance(userId, amountPaid);
      console.log(`Betalning lyckades! Uppdaterade ${userId}'s saldo: ${amountPaid} SEK`);
    }
  } catch (err) {
    console.log(`Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  res.status(200).send('Webhook received');
});


app.use("/user", userRoutes);
app.use("/bike", scooterRoutes);
app.use("/admin", adminRoutes);
app.use("/station", stationRoutes);
app.use("/simulation", simulationRoutes);
app.use("/clientbike", clientBikeRoutes);

app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,  // Testa utan secure om du inte använder HTTPS under utveckling
    sameSite: 'Lax',
  });
  res.status(200).json({ message: 'Logout successful' });
});

app.use(async (req, res, next) => {
  await logEvents(req, res, next); // Logga alla cookies som kommer med begäran
  next();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  process.exit();
});