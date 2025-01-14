const { emit } = require("process");
// const dbModules = require("./bikemodules.js");
const fs = require('fs');
const geolib = require('geolib');
const bikeModules = require('./bikemodules.js');
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
        this.speed = 0;
        this.simulation_id = simulation_id;
        this.status = 'active';
        
        // non scooter tablerelated below
        this.tripStartPosition;
        this.tripEndPosition;
        this.tripStartTime;
        this.tripEndTime;
        this.tripDistance = 0;
        this.tripData = null;
        this.cityName;
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
        this.tripData = await bikeModules.getTripData(this.simulation_id);
        
        this.cityName = this.tripData.city;
        const cityName2Id = {
            "karlshamn": 1,
            "karlskrona": 2,
            "kristianstad": 3
        }
        this.city_id = cityName2Id[this.cityName];
        const payload = {
            city_id: this.city_id,
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

        const url = "http://localhost:4000/bike/add"
        const response = await bikeModules.makeFetch("POST", url, payload);
        
    }

    async updateBikePosition() {
        let payload = {
            simulation_id: this.simulation_id,
            latitude: this.latitude,
            longitude: this.longitude,
            speed: this.speed * 3.6,
            battery_level: this.battery_level
        }   
        let url =  "http://localhost:4000/simulation/updateBikePosition"
        await bikeModules.makeFetch("PUT", url, payload)
    }

    async bookBike() {
        let payload = {
            simulation_id: this.simulation_id
        };
        let url = "http://localhost:4000/simulation/bookbike";
        const response = await bikeModules.makeFetch("PUT", url, payload)
    }

    calculateTripCosts () {
        // console.log("cityName: ", this.cityName)
        const endZoneData = bikeModules.getPositionZoneData(this.tripEndPosition, this.cityName);
        const startZoneData = bikeModules.getPositionZoneData(this.tripStartPosition, this.cityName);
        this.parkingFees = bikeModules.evaluateFees(startZoneData, endZoneData);
        this.tripCost += (this.parkingFees + this.timeFeecost + this.baseFee);

    }

    async getUserBikeId() {
        let url = "http://localhost:4000/simulation/getuserbikeid";
        let payload = {
            simulation_id: this.simulation_id
        }

        const response = await bikeModules.makeFetch("POST", url, payload);
        this.scooter_id = response[0][0].scooter_id; 
        this.user_id = response[1][0].user_id;      


    }

    async sendTripData() {
        // console.log("end",this.tripEndPosition);
        // console.log("start",this.tripStartPosition)
        // console.log("this.tripCost: ", this.tripCost)
        let url = "http://localhost:4000/simulation/addtrip";
        let payload = {
            user_id: this.user_id,
            scooter_id: this.scooter_id,
            simulation_id: this.simulation_id,
            start_time: this.tripStartTime,
            end_time: this.tripEndTime,
            start_location: {
                lat: this.tripStartPosition[1],
                lng: this.tripStartPosition[0]
            },
            end_location: {
                lat: this.tripEndPosition[1],
                lng:  this.tripEndPosition[0]
            },
            distance: this.tripDistance,
            cost: this.tripCost,
            time_fee: this.timeFeecost,
            parking_fee: this.parkingFees,
            payment_status: "PAID"
        }
        await bikeModules.makeFetch("POST", url, payload);
    }

    async updateStatus(status) {
        let url = "http://localhost:4000/simulation/updateStatus";
        let payload = {
            simulation_id: this.simulation_id,
            status: status
        }
        await bikeModules.makeFetch("PUT", url, payload)
    }
}

class User extends BikeNode {
    constructor(simulation_id) {
        super(simulation_id);
        this.user_id;
        this.email;
        this.password;
        this.simulation_id = simulation_id;
        this.balance;
        this.payRate = 0.1;
        this.batteryRate = 0.016;
        this.baseSpeed = 45;
        this.tripCost = 0;
        this.timeFeecost;
        this.parkingFees;
        this.baseFee = 25;
    }

    async init() {
        await super.initiateBike();
        await this.initiateUser();
        await this.addMoney();
    }

    async initiateUser() {
        this.email = `simulatedUser${this.simulation_id}@test.com`;
        this.password = `simulation${this.simulation_id}`;
        this.balance = Math.floor(Math.random() * (250 - 100 + 1)) + 100;
        // this.balance = 250;
            let payload = {
                password: this.password,
                email: this.email,
                simulation_id: this.simulation_id
            };

            let url = "http://localhost:4000/simulation/register"
            const response = await bikeModules.makeFetch("POST", url, payload)
            await this.getUserBikeId();
    }

    async addMoney() {
            let payload = {
                simulation_id: this.simulation_id,
                amount: this.balance
            };
            let url = 'http://localhost:4000/simulation/addmoney';
            const response = await bikeModules.makeFetch("PUT", url, payload)
    }

    async startBike() {
        await this.bookBike();
        this.startTrip();
    }

    async startTrip() {
        for (let i = 0; i < this.tripData.trips.length; i++) {
            if (this.balance <= 0 || this.balance <= 0) {
                // console.log("trip not started. BATTERY OR BALANCE IS 0")
                return
            }
            await this.updateStatus("in_use");
            const coords = this.tripData.trips[i];
            this.tripCost = 0;
            this.timeFeecost = 0;
            this.parkingFees = 0;
            let currentIndex = 0;
            let tripCost = 0;
            let speed;
            this.balance -= this.baseFee;
            let balanceReachedZero = false;
            this.tripStartTime= new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.tripStartPosition = coords[currentIndex];
            const moveWithDelay = async () => {
                if (currentIndex >= coords.length - 1) {
                    // console.log("died id", this.simulation_id," balance: ", this.balance, "battery: ", this.battery_level);
                    return;
                }

                speed = Math.floor((this.baseSpeed / 3.6) * (Math.random() * 0.65 + 0.35));
                this.speed = speed;

                const currentCoord = coords[currentIndex];
                const nextCoord = coords[currentIndex + 1];
                
                const distance = geolib.getDistance(
                    {latitude: currentCoord[0], longitude: currentCoord[1]},
                    {latitude: nextCoord[0], longitude: nextCoord[1]}
                );

                
                const timeInterval = distance / speed;
                this.tripDistance += distance;
                tripCost += timeInterval * this.payRate;
                // this.balance -= timeInterval * this.payRate;
                this.battery_level -= distance * this.batteryRate;
                this.latitude = nextCoord[1];
                this.longitude = nextCoord[0];
                
                if ( tripCost >= (this.balance - 15)) {
                    tripCost -= timeInterval * this.payRate;
                    this.balance = 15;
                    // 15 credits cap for pontential parking fees
                    // console.log("this.balance reached 0: ", this.balance, "totaltripcostime: ", tripCost)
                    balanceReachedZero = true;
                    return;
                }

                if (this.battery_level <= 0) {
                    this.battery_level = 0;
                    // console.log("battery level 0")
                    return
                }
                await this.updateBikePosition();

                // console.log(`
                //     simulation_id: ${this.simulation_id}
                //     battery level: ${this.battery_level}
                //     balance: ${this.balance}
                //     latitude: ${nextCoord[1]}
                //     longitude: ${nextCoord[0]}
                //     distance: ${distance} 
                //     cost for time: ${timeInterval * this.payRate}
                //     total cost for time ${tripCost}
                //     speed m/s: ${speed}
                //     speed km/h: ${speed * 3.6}
                //     timeInterval: ${timeInterval}
                //     currenttrip: ${i}
                // `);
                currentIndex++;
                return new Promise(resolve => {
                    setTimeout(async () => {
                        if (currentIndex < coords.length - 1) {
                            await moveWithDelay();
                        }
                        resolve();
                    }, timeInterval * 1000);
                });
            };
        
            await moveWithDelay();
            this.speed = 0;
            await this.updateBikePosition();
            this.updateStatus("active");

            this.timeFeecost = tripCost;
            this.tripEndPosition = coords[currentIndex];
            this.tripEndTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.calculateTripCosts();
            if (! balanceReachedZero) {
                this.balance -= this.tripCost;
                this.balance += this.baseFee;
            } else {
                this.balance -= this.parkingFees;
            }
            let url2 = "http://localhost:4000/simulation/setMoney"
            let payload2 = {
                simulation_id: this.simulation_id,
                amount: this.balance
            }
            // console.log("put setmoney cost: ", this.balance);
            await bikeModules.makeFetch("PUT", url2, payload2);
            await this.sendTripData();
        }
    }

}

module.exports = User