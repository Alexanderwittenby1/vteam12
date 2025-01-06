const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/userRoutes");
const userController = require("../controllers/userController");

const app = express();
app.use(express.json());
app.use("/user", userRoutes);

// Mocka userController
jest.mock("../controllers/userController");

describe("User Routes", () => {
  it("should register a user", async () => {
    userController.registerUser.mockImplementation((req, res) => {
      res.status(201).send({ message: "User registered successfully" });
    });

    const response = await request(app)
      .post("/user/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  it("should login a user", async () => {
    userController.loginUser.mockImplementation((req, res) => {
      res.status(200).send({ token: "fake-jwt-token" });
    });

    const response = await request(app)
      .post("/user/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("fake-jwt-token");
  });

  it("should get user profile", async () => {
    // Mocka loginUser för att returnera en token
    userController.loginUser.mockImplementation((req, res) => {
      res.status(200).send({ token: "fake-jwt-token" });
    });

    // Mocka getUserByEmail för att returnera användarprofil
    userController.getUserByEmail.mockImplementation((req, res) => {
      res.status(200).send({ email: "test@example.com", balance: 100 });
    });

    // Logga in först för att få en token
    const loginResponse = await request(app)
      .post("/user/login")
      .send({ email: "test@example.com", password: "password123" });

    const token = loginResponse.body.token;
    console.log("Token received:", token); // Logga token för felsökning

    // Använd token för att hämta användarprofil
    const profileResponse = await request(app)
      .get("/user/profile")
      .set("Authorization", `Bearer ${token}`);

    console.log("Profile response status:", profileResponse.status); // Logga status för felsökning
    console.log("Profile response body:", profileResponse.body); // Logga body för felsökning

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.email).toBe("test@example.com");
    expect(profileResponse.body.balance).toBe(100);
  });
});
