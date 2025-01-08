
const BikeUser = require("./BikeNode.js");
const TripGenerator = require('./tripGen2.js');

class Simulation {
    constructor() {
        this.init()
        this.allBikeNodes = []
        this.totalBikes = 0;
        this.ApiEndpoint = "http://localhost:4000/api/"
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
                // console.log(`Created user and bike with simulation_id:`)
                
            }
            
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
    

    init() {
    }
}

module.exports = Simulation;
