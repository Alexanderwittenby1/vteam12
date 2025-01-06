const { emit } = require("process");
// const dbModules = require("./bikemodules.js");
const fs = require('fs');
const geolib = require('geolib');
class BikeNode {
    constructor(simulation_id) {
        this.scooter_id = null;
        this.city_id = null;
        this.latitude = null;
        this.longitude = null;
        this.battery_level = 100;
        this.is_available = true;
        this.needs_service = false;
        this.is_charging = false;
        this.last_maintenance = null;
        this.simulation_id = simulation_id;
        this.status = 'active';
        this.tripData = null;
    }
    

    setPosition(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    setCity(city_id) {
        this.city_id = city_id;
    }

    setStatus(status) {
        this.status = status;   
    }

    setBatteryLevel(battery_level) {
        this.battery_level = battery_level;
    }

    setIsAvailable(is_available) {
        this.is_available = is_available;
    }

    setLastMaintenance(last_maintenance) {
        this.last_maintenance = last_maintenance;
    }

    async initiateBike() {
        try {
            // Validate required data before making request
            // console.log("this.simulationID: ",this.simulation_id)
           
            const tripData = await fs.promises.readFile(
                `./trips/${this.simulation_id}.json`, 
                'utf8'
            );
            
            // Validate trip data
            if (!tripData) {
                throw new Error('Trip data not found');
            }
    
            this.tripData = JSON.parse(tripData);
            const cityName = this.tripData.city,
            cityName2Id = {
                "karlshamn": 1,
                "karlskrona": 2,
                "kristanstad": 3
            }

            // Ensure all required fields are present
            const payload = {
                city_id: cityName2Id[cityName],
                latitude: this.tripData.initialStart[1],
                longitude: this.tripData.initialStart[0],
                battery_level: this.battery_level || 100,
                is_charging: this.is_charging || false,
                needs_service: this.needs_service || false,
                is_available: this.is_available || true,
                status: this.status || 'active',
                last_maintenance: this.last_maintenance,
                simulation_id: this.simulation_id
            };
    
            // Make API request
            const response = await fetch('http://localhost:4000/bike/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`HTTP error! status: ${response.status}${errorData ? ': ' + JSON.stringify(errorData) : ''}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Failed to initiate bike:', error);
            throw error;
        }
    }
    
    async init() {
        this.initiateBike()
    }

}

class User extends BikeNode {
    constructor(simulation_id) {
        super(simulation_id);
        this.email;
        this.password;
        this.simulation_id = simulation_id;
        this.balance;
        this.payRate = 0.011;
        this.batteryRate = 0.0035;
        this.baseSpeed = 30;
    }

    async init() {
        
        await super.init();
        
        
        await this.initiateUser();
        await this.addMoney();
    }

    async initiateUser() {
        this.email = `simulatedUser${this.simulation_id}@test.com`;
        this.password = `simulation${this.simulation_id}`;
        this.balance = Math.floor(Math.random() * (200 - 25 + 1)) + 25;

        try {

            let payload = {
                password: this.password,
                email: this.email,
                simulation_id: this.simulation_id

            };
            const response = await fetch('http://localhost:4000/simulation/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            await response.json();
        } catch (error) {
            console.error('Failed to initiate user:', error);
            throw error;
        }

            // Improved client-side error handling
       

        
    }

    async addMoney() {
        try {
            let payload = {
                simulation_id: this.simulation_id,
                amount: this.balance

            };
            const response = await fetch('http://localhost:4000/simulation/addmoney', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to initiate user:', error);
            throw error;
        }
    }

    async startBike() {
        await this.bookBike();
        this.startTrip();

    }

    async startTrip() {
        for (let i = 0; i < this.tripData.trips.length; i++) {
            const coords = this.tripData.trips[i];
            let currentIndex = 0;
            let speed = this.baseSpeed / 3.6; // Speed in m/s
            
            const moveWithDelay = async () => {
                if (currentIndex >= coords.length - 1 || this.balance <= 0 || this.battery_level <= 0) {
                    console.log("died id", this.simulation_id," balance: ", this.balance, "battery: ", this.battery_level);
                    return;
                }
                
                const currentCoord = coords[currentIndex];
                const nextCoord = coords[currentIndex + 1];
                
                const distance = geolib.getDistance(
                    {latitude: currentCoord[0], longitude: currentCoord[1]},
                    {latitude: nextCoord[0], longitude: nextCoord[1]}
                );
                
                this.balance -= distance * this.payRate;
                this.battery_level -= distance * this.batteryRate;
                const timeInterval = distance / speed;
        
                try {
                    await fetch(`http://localhost:4000/simulation/updateBikePosition`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            simulation_id: this.simulation_id,
                            latitude: nextCoord[1],
                            longitude: nextCoord[0],
                            battery_level: this.battery_level
                        })
                    });
                    
                    // console.log(`
                    //     simulation_id: ${this.simulation_id}
                    //     battery level: ${this.battery_level}
                    //     balance: ${this.balance}
                    //     latitude ${nextCoord[1]}
                    //     longitude ${nextCoord[0]}
                    //     distance ${distance}
                    //     speed ${speed}
                    //     timeInterval ${timeInterval}
                    //     currenttrip ${i}
                    // `);
                    
                    currentIndex++;
                    setTimeout(moveWithDelay, timeInterval * 1000);
                } catch (error) {
                    console.error('Failed to update position:', error);
                }
            };
        
            moveWithDelay(); 
        }

        try {
            await fetch(`http://localhost:4000/simulation/setMoney`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    simulation_id: this.simulation_id,
                    amount: this.balance
                })
            });

        } catch (error) {
            console.error('Failed to update position:', error);
        }
    }
    

    async bookBike() {
        try {
            let payload = {
                simulation_id: this.simulation_id
            };
            const response = await fetch('http://localhost:4000/simulation/bookbike', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to book bike:', error);
            throw error;
        }
    }
}

module.exports = User