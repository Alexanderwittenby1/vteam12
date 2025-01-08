// tripGen.js
const randomPointsOnPolygon = require('random-points-on-polygon');
const geoPointInPolygon = require('geo-point-in-polygon');
const token = require('../token.js');
const fs = require('fs');
const polyline = require('@mapbox/polyline');
// const geoTools = require('geo-tools');
const geolib = require('geolib');

class TripGenerator {
    constructor() {
        this.maxDistance = 1800;
        this.minDistance = 400;
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

        // console.log("this.bikes: ", this.bikes);
        const startId = this.generationId;

        for (let i = 0; i < this.bikes; i++) {
            console.log(i)
            // console.log("NEW========================= \n");
            // console.log("generationId: ", this.generationId);
            // console.log("this.CityName: ", this.cityName)
            
            let coords;
            const bikeObject = {
                city: this.cityName,
                initialStart: [],
                trips: [],
                trips_encoded: [],
            };

            for (let j = 0; j < this.routesPerBike; j++) {
                try {
                    coords = !coords ? 
                        this.createStartAndEndPoints() : 
                        this.createStartAndEndPoints(coords[1]);

                    const trip = await this.getTrip(coords);
                    const trip_decoded = this.reverseCoords(polyline.decode(trip));
                    const trip_encoded = polyline.encode(trip_decoded);
                    
                    bikeObject.trips_encoded.push(trip_encoded);
                    bikeObject.trips.push(trip_decoded);
                    fs.appendFileSync("./trips/trips.csv", 
                        `"${this.generationId}","${j}","${trip_encoded}"r\n`);
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
        console.log("createStartAndEndPoints");
        
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
            
            // let startPointCoordsLALO = this.swapCoordinates(startPointCoordsLOLA);
            // let endPointCoordsLALO = this.swapCoordinates(endPointCoordsLOLA);
            
            const isWithinDistance = this.isWithinDistance(startPointCoordsLOLA, endPointCoordsLOLA);
            if (isWithinDistance) {
                let inForbidden = false;
                
                for (let zone of this.forbidden) {
                    const zoneCoords = zone.geometry.coordinates[0];
                    if (geoPointInPolygon(startPointCoordsLOLA, zoneCoords) || 
                        geoPointInPolygon(endPointCoordsLOLA, zoneCoords)) {
                        console.log("COORDS FAIL");
                        inForbidden = true;
                        break;
                    }
                }
                
                if (!inForbidden) {
                    // console.log("coords: ", [startPointCoordsLALO, endPointCoordsLALO]);
                    point = [startPointCoordsLOLA, endPointCoordsLOLA];
                    break;
                }
            }
        }
        return point;
    }

    reverseCoords(coordsArr) {
        return coordsArr.map((coord) => coord.reverse());
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
                options: {
                    avoid_polygons: {
                        type: "MultiPolygon",
                        coordinates: [polygons]
                    }
                }
            }
            
            const url = "https://api.openrouteservice.org/v2/directions/cycling-electric/json";
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
            return resJson.routes[0].geometry;
        } catch (error) {
            console.log("API error: ", error);
        }
    }
}

module.exports = TripGenerator;