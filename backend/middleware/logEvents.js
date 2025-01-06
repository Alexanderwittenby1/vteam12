// logEvents.js
const { format } = require('date-fns');
const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const logEvents = async (req, res, next) => {
    const logFile = path.join(__dirname, '..', 'logs', 'events.log');

    // Kontrollera om logs-mappen finns, skapa den om den inte gör det
    if (!fs.existsSync(path.dirname(logFile))) {
        fs.mkdirSync(path.dirname(logFile));
    }

    const logMessage = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} - ${req.method} ${req.url} - ${req.ip}\n`;

    try {
        await fsPromises.appendFile(logFile, logMessage);
    } catch (error) {
        console.error('Fel vid skrivning till loggfil: ', error.message);
    }

    next();
};

module.exports = logEvents;
