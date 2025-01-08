const dbModules = require("./dbmodules.js");
const fs = require('fs');
const path = require('path');

function checkBikeInitiation(amount) {
    amount = parseInt(amount)
    if (!(Number.isInteger(amount))) {
        console.log("provide a integer!")
    } else {
        amount > 1000 ? amount = 1000 : amount = amount;
        const result = dbModules.intiateScooters(amount);
        console.log(result)
    }
}


function checkTrips() {
    try {
        const tripsPath = './trips/0.json';
        return fs.existsSync(tripsPath);
    } catch (error) {
        return false;
    }
}

async function resetDb() {
    try {
        const response = await fetch('http://localhost:4000/simulation/deletesimulation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error resetting data:', error.message);
        throw error;
    }
}


function reset() {
    try {
        const tripsDir = './trips';
        
        if (fs.existsSync(tripsDir)) {
            // Delete all JSON files
            const files = fs.readdirSync(tripsDir);
            files.forEach(file => {
                const filePath = path.join(tripsDir, file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        
        console.log('All simulation data has been reset');
        return true;
    } catch (error) {
        console.error('Error resetting data:', error);
        return false;
    }
}


module.exports = {
    "checkBikeInitiation": checkBikeInitiation,
    "checkTrips": checkTrips,
    "reset": reset,
    "resetDb": resetDb
}