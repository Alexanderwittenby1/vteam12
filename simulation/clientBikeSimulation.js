const Simulation = require('./src/simulation.js');
const modules = require("./src/modules.js");
let simulation;
async function clientBikeSimulation(amount) {
   
    simulation = new Simulation()
    modules.reset();
    await modules.resetDb();
    simulation.totalBikes = amount;
    let cities = ["karlskrona"]
    simulation.setCities(cities)
    await simulation.generateTrips(1);
    await simulation.generateClientBike();
}

async function bookBike(scooter_id, user_id, simulation_id) {
    simulation.startClientBike(scooter_id, user_id, simulation_id)
}

async function stopBike(simulation_id) {
    await simulation.stopClientBike(simulation_id);
}

async function moveClientBike(simulation_id, coords) {
    await simulation.moveClientBike(simulation_id, coords);
    
}

module.exports = {
    "clientBikeSimulation": clientBikeSimulation,
    "bookBike": bookBike,
    "stopBike": stopBike,
    "moveClientBike": moveClientBike
    
}