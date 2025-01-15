const express = require('express');
const compression = require('compression');
const socket = require('socket.io');

const app = express();
const processInput = require('./processInput.js');
const routes = require('./routes.js');
console.log("teeestxd2")
// Middleware
app.use(compression());
app.use(express.json());
processInput.runInput();
// Routes
app.use('/', routes);

app.get('/test', async (req, res) => {
    res.send("<h1>test</h1>");
});

const PORT = 3333;

console.log("Enter a command. For help type help");


// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handlers
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
