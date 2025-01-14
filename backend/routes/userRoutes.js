const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/autMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const dotenv = require("dotenv");
dotenv.config(); // Ladda miljövariabler från .env fil

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Rutt för att registrera en användare (utan inloggning)
router.post("/register", userController.registerUser);

// Rutt för att logga in en användare (utan inloggning)
router.post("/login", userController.loginUser);

// Rutter för att hämta användaruppgifter
router.get("/profile", verifyToken, userController.getUserByEmail);

// Rutt för att hämta alla trips för en användare (kräver att användaren är inloggad)
router.get("/trips", verifyToken, userController.getTripsByUserId);

// Rutt för att hämta alla användare (endast för admin)
router.get("/admin", verifyToken, isAdmin, userController.getAllUsers);

// Rutt för att uppdatera lösenordet
router.put("/updatePassword", verifyToken, userController.updatePassword);

// Rutt för att sätta in pengar på sitt konto (kräver att användaren är inloggad)
router.put("/addMoney", verifyToken, userController.addMoney);



// Rutt för att skapa en Stripe Checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const userId = req.body.userId;
    const successUrl = `${
      req.headers.origin || "http://localhost:3000"
    }/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${req.headers.origin || "http://localhost:3000"}/cancel`;
    // console.log(userId);
    // Skapa en Stripe-session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "sek", // Valuta
          product_data: {
            name: item.name, // Produktens namn
          },
          unit_amount: item.amount, // Beloppet (i öre)
        },
        quantity: item.quantity, // Antal av produkten
      })),
      mode: "payment", // Betalningsläge (köp)
      success_url: successUrl, // URL för framgång
      cancel_url: cancelUrl,
      metadata: {
        userId: userId, // Användarens ID
      },
    });
    // Skicka tillbaka sessionens ID till frontend
    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err); // Logga fel
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
