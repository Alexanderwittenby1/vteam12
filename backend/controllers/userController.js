const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generateToken = require("../services/authService");

exports.getUserByEmail = async (req, res) => {
  const email = req.user.email;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  userModel.getAllUsers((error, users) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(users);
  });
};

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-post och lösenord krävs" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = { email, password: hashedPassword };

    userModel.createUser(userData, (error, userId) => {
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.getUserByEmail(email);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = generateToken(user);
    await userModel.updateLastLogin(user.user_id);

    // Skicka tillbaka JWT-token som en HttpOnly cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: "Lax",
    });

    console.log();

    return res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTripsByUserId = (req, res) => {
  const userId = req.user.userId;

  userModel.getTripsByUserId(userId, (error, trips) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(trips);
  });
};

// Uppdatera lösenord
exports.updatePassword = async (req, res) => {
  const userId = req.user.userId;
  const { password } = req.body;
  console.log("User id:", userId);
  console.log("Password:", password);

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userModel.updateUserPassword(userId, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addMoney = async (req, res) => {
  const userId = req.user.userId;
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  try {
    await userModel.addMoney(userId, amount);
    res.status(200).json({ message: "Money added successfully" });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserBalance = async (userId, amount) => {
  try {
    console.log({ userId, amount });
    await userModel.addMoney(userId, amount);
    console.log("User balance updated successfully");
  } catch (error) {
    console.error("Error updating user balance:", error);
  }
};
