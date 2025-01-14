// Method 2 (modern approach)
const Simulation = require('./src/simulation.js');
const fs = require('fs');
const dbModules = require("./src/dbmodules.js");
const modules = require("./src/modules.js");
const { exec } = require('child_process');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


running = true

helpTxt = `
Exit: exits the interactive shell process but not the server.
Help: Displays the help text.
Start (s): Starts the simulation and creates the simulation instance.
initiate bikes <amount> (i b <amount>): inities an n amount of bikes.
set cities <city> <city> <city>(s c <city>): sets which citys to generate for can take up to 3 at once.
generate trips <tripsPerBike> (g t <amount>): starts the tripGeneration modules tripsberbike should be no higher then 4 or 5.
generate bikes (g b) generates the bike nodes must be done before (s b).
start bikes (s b): will books all bikes with corrensponding users.
reset (r): resets and deletes previously generated trips and data.
debug: shows dbug data.
test response: Checks if simulations instance is running.
`

let amount;
let simulation
let cities = [];
let i;
const runInput = () => {
    readline.question("", async (input) => {
            const args = input.toLowerCase().split(' ');
            const command = args[0] + (args[1] ? ' ' + args[1] : '');
        switch(command) {
            case 'exit':
                running = false;
                readline.close();
                break;
            case "help":
                console.log(helpTxt)
                runInput();
                break;
            case "s":
                console.log("starting simulation")
                simulation = new Simulation()
                runInput();
                break;
            case "test response":
                if (simulation) {
                    let result = simulation.testResponse();
                    console.log(result)
                } else {
                    console.log("start simulation first")
                }
                runInput();
                break;
            case "i b":
                amount = parseInt(args[2]);
                if (!simulation) {
                    console.log("must start the simulation first");
                } else {
                    console.log("gggg")
                    simulation.totalBikes = amount;
                }
                runInput();
                break;

            case "g t":
                // console.log("aids:",simulation.totalBikes <=0 )
                if (!simulation) {
                    console.log("must start the simulation first")
                    runInput();
                    break;
                } else if (modules.checkTrips()){
                    console.log("trips already generated delete them with reset or reset.bash")
                    runInput();
                    break;
                } else if (simulation.totalBikes <=0 ){
                    console.log("no bikes generated in simulation run initiate bikes first")
                    runInput();
                    break;
                } else if (simulation.cities.length <= 0) {
                    console.log("no cities entered run set cities <city> first")
                    runInput();
                    break;
                } else {
                    amount = parseInt(args[2]);
                    await simulation.generateTrips(amount);
                    
                    runInput();
                    break;
                }
            
            case "g b":
                if (!simulation) {
                    console.log("must start the simulation first");
                    runInput();
                    break;
                } else if (simulation.totalBikes <= 0) {
                    console.log("No bikes initiated");
                    runInput();
                    break;
                } else if (!modules.checkTrips()) {
                    console.log("No trips generated!")
                    runInput();
                    break;
                }
                await simulation.createNewBikeNode();
                
                runInput();
                break;
            case "s c":
                if (!simulation) {
                    console.log("must start the simulation first")
                    runInput();
                    break; 
                } else {
                    i = 2;
                    const validCities = ["karlshamn", "karlskrona", "kristianstad"];
                    let cities = [];
                    while (i < args.length) {
                        if (validCities.includes(args[i]) && (!cities.includes(args[i]))) {
                            cities.push(args[i])

                            i++
                        } else {
                            console.log("City doesnt exist choose between: karlskrona, karlshamn, kristanstad")
                            i++
                        }
                    
                    }
                    // let cities = ["kristianstad", "karlshamn", "karlskrona"]
                    simulation.setCities(cities)
                    console.log(cities, args.length)
                    // cities.push()
                    runInput();
                    break; 
                }
            case "s b":
                let startedBikes = true;
                if (!simulation) {
                    console.log("must start the simulation first");
                    runInput();
                    break;
                } else if (simulation.totalBikes <= 0) {
                    console.log("No bikes initiated");
                    runInput();
                    break;
                } else if (!modules.checkTrips()) {
                    console.log("No trips generated!")
                    runInput();
                    break;
                }

                
                await simulation.startBikes();
                console.log("bikes started")
                runInput();
                break;
            case "c b":
                amount = parseInt(args[2]);
                if (amount > 5 || amount < 1) {
                    console.log("max 5 and minimum 1 client bike")
                    runInput();
                    break;
                } else if (! amount) {
                    console.log("no amount given !")
                    runInput();
                    break;
                }
                simulation = new Simulation()
                modules.reset();
                await modules.resetDb();
                simulation.totalBikes = amount;
                let cities = ["karlskrona"]
                simulation.setCities(cities)
                await simulation.generateTrips(2);
                await simulation.generateClientBike();
                runInput();
                    break;
            case "start cb":
                amount = parseInt(args[2]) ;
                simulation.startClientBike(amount)
                runInput();
                break;
            case "stop cb":
                amount = parseInt(args[2]);
                simulation.stopClientBike(amount)
                runInput();
                break;
            case "move cb":
                amount = parseInt(args[2]);
                let coords = {
                    lat: 56.172874,
                    lng: 14.870897
                }
                simulation.moveClientBike(amount, coords)
                runInput();
                break;
            case "r":
                modules.reset();
                await modules.resetDb();
                runInput();
                break;
            
            case "debug":
                console.log(`
                simulation.totalBikes ${simulation.totalBikes}
                simulation.cities ${simulation.cities}

                    `)
            default:
                console.log("uknown command try help")
                runInput();
                break;
        }
    });
}


module.exports = {
    runInput
};
