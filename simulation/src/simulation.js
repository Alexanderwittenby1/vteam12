
const BikeUser = require("./BikeNode.js");
// const { use } = require("../routes.js");
const TripGenerator = require('./tripGen2.js');

class Simulation {
    constructor() {
        this.allBikeNodes = []
        this.totalBikes = 0;
        // this.ApiEndpoint = "http://localhost:4000/api/"
        this.cities = [];
    }

    testResponse() {
        return "This simulation is running"
    }

    async generateTrips(amount) {
        let bikesPerCity = this.bikesPerCity();
        console.log("bikespercity: ", bikesPerCity);
        let currentId = 0;
        
        for (let i = 0; i < bikesPerCity.length; i++) {
            let tripGen = new TripGenerator();
            console.log("Processing city:", this.cities[i]);
            
            tripGen.routesPerBike = amount;
            tripGen.generationId = currentId;  
            tripGen.setCityName(this.cities[i]);
            tripGen.bikes = bikesPerCity[i];
            

            await tripGen.generateTrips();
            currentId += tripGen.bikes;  
        }
    }
    
    bikesPerCity() {
        const bikesPerCity = Math.floor(this.totalBikes / this.cities.length);
        console.log(bikesPerCity)
        const modulus = this.totalBikes % this.cities.length;
        let set = [];
        
        for (let i = 0; i < this.cities.length; i++) {
            set.push(bikesPerCity);
        }
        
        if (modulus) {
            set[0] += modulus;
        }
        return set;
    }
    
    setCities(cities) {
        this.cities = cities;
    }

    async createNewBikeNode() {
        if (this.totalBikes > 1000) {
            return "A maximum of 1000 bikes are allowed.";
        } else {
            for (let i = 0; i < this.totalBikes; i++) {
                const user = new BikeUser(i);
                await user.init();  
                this.allBikeNodes.push(user);
                console.log(`Created user and bike with simulation_id: ${i}`)
                
            }
            
        }
    }

    async generateClientBike() {
        for (let i = 0; i < this.totalBikes; i++) {
            const user = new BikeUser(i);
            await user.initClientBike();  
            this.allBikeNodes.push(user);
            console.log(`Created user and bike with simulation_id: ${i}`)
        }
    }
    
    async startBikes() {
        const totalBikeCount = this.allBikeNodes.length;
        const initialPercentage = 1; 
        // const incrementPercentage = 0.1; 
    
        const initialCount = Math.floor(totalBikeCount * initialPercentage);
        
        for (let i = 0; i < initialCount; i++) {
            try {
                await this.allBikeNodes[i].startBike();
                console.log(`Started bike with simulation_id: ${this.allBikeNodes[i].simulation_id}`);
            } catch (error) {
                console.error(`Failed to start bike ${i}:`, error);
            }
        }
        
        console.log("All bikes started successfully");
    }

    stopClientBike(simulation_id) {
        this.allBikeNodes[simulation_id].setStatus("stopped");
    }

    async startClientBike(scooter_id, user_id, simulation_id) {
        console.log(`
            scooter_id: ${scooter_id}
            user_id: ${user_id}
            simulation_id: ${simulation_id}
            `)
        await this.allBikeNodes[simulation_id].startClientBike(user_id, scooter_id);
    }

    moveClientBike(simulation_id, coords) {
        if (this.allBikeNodes[simulation_id].status == "in_use") {
            console.log("error on move bike")
            throw new Error("bike in use!");
        }
        console.log("testg32");
        this.allBikeNodes[simulation_id].moveBike(coords);
    }
}

module.exports = Simulation;
