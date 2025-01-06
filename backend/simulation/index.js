const express = require('express');
const compression = require('compression');
const socket = require('socket.io');
const { processInput } = require('./processInput.js');
const app = express();



const PORT = process.env.PORT || 3005;
// Connection pooling
const promisePool = require('./config/dbConfig.js'); // Your database configuration

console.log("Enter a command. For help type help")
processInput()

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });

const io = socket(server);

app.get('/scooters', async (req, res) => {
    try {
        const results = await promisePool.query('SELECT * FROM Scooter');
        res.json(results[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', async (req, res) => {
    res.send("<h1>test</h1>");
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
    try {
        await pool.end();
        console.log('Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err.message);
        process.exit(1);
    }
}

// Middleware
app.use(compression());
app.use(express.json());
