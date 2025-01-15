const randomPointsOnPolygon = require('random-points-on-polygon');
const geoPointInPolygon = require('geo-point-in-polygon');
const token = require('../token.js');
const fs = require('fs');
const geolib = require('geolib');

class TripGenerator {
    constructor() {
        this.maxDistance = 1500;
        this.minDistance = 600;
        this.forbidden = [];
        this.routesPerBike;
        this.bikes;
        this.cityName;
        this.cityCoords = [];
        this.stations = [];
        this.parkingZones = [];
        this.boundaries = [];
        this.generationId = 0;
    }

    setCityName(name) {
        this.cityName = name.toLowerCase();
    }

    swapCoordinates(coords) {
        return [coords[1], coords[0]];
    }

    async generateTrips() {
        let city = {}
        try {
            city = require(`../cities/${this.cityName}.json`);
        } catch (err) {
            console.log(err)
            return 0;
        }
        
        city.features.forEach(feature => {
            if (feature.properties.role === "forbidden") {
                this.forbidden.push(feature);
            } else if (feature.properties.role === "zone") {
                this.cityCoords.push(feature);
            } else if (feature.properties.role === "station") {
                this.stations.push(feature);
            } else if (feature.properties.role === "parking") {
                this.parkingZones.push(feature);
            } else if (feature.properties.role === "boundary" || feature.properties.role === "forbidden") {
                this.boundaries.push(feature);
            }
        });

        // console.log(this.boundaries)
        const startId = this.generationId;

        for (let i = 0; i < this.bikes; i++) {
            console.log(i)
            let coords;
            const bikeObject = {
                city: this.cityName,
                initialStart: [],
                trips: []
            };

            for (let j = 0; j < this.routesPerBike; j++) {
                try {
                    coords = !coords ? 
                        this.createStartAndEndPoints() : 
                        this.createStartAndEndPoints(coords[1]);

                    const coordinates = await this.getTrip(coords);
                    if (!coordinates) {
                        j--;
                        continue;
                    }
                    // console.log("coordinates: ", coordinates);

                    bikeObject.trips.push(coordinates);
                    fs.appendFileSync("./trips/trips.csv", 
                        `"${this.generationId}","${j}","${JSON.stringify(coordinates)}"\n`);
                } catch (error) {
                    console.log(error);
                    j--;
                }
            }
            
            bikeObject.initialStart = bikeObject.trips[0][0];
            fs.writeFileSync(`./trips/${this.generationId}.json`, 
                JSON.stringify(bikeObject, null, 4));
            this.generationId++;
        }
        
        return this.generationId - startId;
    }
    
    createStartAndEndPoints(startPointInput = null) {
        const numberOfPoints = 1;
        
        let point = 0;
        while (!point) {
            let startPointCoordsLOLA;
            let startPoint;
            
            if (!startPointInput) {
                startPoint = randomPointsOnPolygon(numberOfPoints, this.cityCoords[0]);
                startPointCoordsLOLA = startPoint[0].geometry.coordinates;
            } else {
                startPointCoordsLOLA = startPointInput;
            }

            let endPoint = randomPointsOnPolygon(numberOfPoints, this.cityCoords[0]);
            let endPointCoordsLOLA = endPoint[0].geometry.coordinates;
            
            const isWithinDistance = this.isWithinDistance(startPointCoordsLOLA, endPointCoordsLOLA);
            if (isWithinDistance) {
                let inForbidden = false;
                
                for (let zone of this.forbidden) {
                    const zoneCoords = zone.geometry.coordinates[0];
                    if (geoPointInPolygon(startPointCoordsLOLA, zoneCoords) || 
                        geoPointInPolygon(endPointCoordsLOLA, zoneCoords)) {
                        inForbidden = true;
                        break;
                    }
                }
                
                if (!inForbidden) {
                    point = [startPointCoordsLOLA, endPointCoordsLOLA];
                    break;
                }
            }
        }
        return point;
    }

    isWithinDistance(startPoint, endPoint) {
        const distance = geolib.getDistance(
            {latitude: startPoint[0], longitude: startPoint[1]},
            {latitude: endPoint[0], longitude: endPoint[1]}
        );
        return distance >= this.minDistance && distance <= this.maxDistance;
    }

    async getTrip(coords) {
        try {
            const polygons = this.forbidden.map(feature => feature.geometry.coordinates[0]);
            let params = {
                coordinates: coords,
                geometry_simplify: false,
                options: {
                    avoid_polygons: {
                        type: "MultiPolygon",
                        coordinates: [polygons]
                    },
                    
                }
            }
            
            const url = "http://ors-app:8082/ors/v2/directions/cycling-electric/geojson";
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(params)
            });
            
            const resJson = await res.json();
            if (resJson.error) {
                console.log('Route error:', resJson.error);
                return null;
            }

            if (!resJson.features || !resJson.features.length) {
                console.log('No route found');
                return null;
            }

            return resJson.features[0].geometry.coordinates;
        } catch (error) {
            console.log("API error: ", error);
            return null;
        }
    }
}

module.exports = TripGenerator;