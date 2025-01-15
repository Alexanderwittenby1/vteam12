const { emit } = require("process");
// const dbModules = require("./bikemodules.js");
const fs = require('fs');
const geolib = require('geolib');
const modules = require("./modules");
const pointInPolygon = require("geo-point-in-polygon")

async function getTripData(simulation_id) {
    const tripData = await fs.promises.readFile(
                `./trips/${simulation_id}.json`, 
                'utf8'
            );
        if (!tripData) {
            throw new Error('Trip data not found');
        }
        
        parsedTripData = JSON.parse(tripData);
    return parsedTripData;
}

async function makeFetch(mode, url, payload) {
    try {
        const response = await fetch(`${url}`, {
            method: mode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('Failed to initiate bike:', error);
        throw error;
    }
}


function getPositionZoneData(coords, cityName) {

    const cityData = require(`./../cities/${cityName}Data.json`)
    let zoneResult = cityData.zone.some(function(polygon){
        return pointInPolygon(coords, polygon);
    });

    let stationResult = cityData.stations.some(function(polygon){
        return pointInPolygon(coords, polygon);
    });
    
    let parkingResult = cityData.parking.some(function(polygon){
        return pointInPolygon(coords, polygon);
    });

    let forbiddenResult = cityData.forbidden.some(function(polygon){
        return pointInPolygon(coords, polygon);
    });

    let boundariesResult = cityData.boundaries.some(function(polygon){
        return pointInPolygon(coords, polygon);
    });

    const result = {
        station: stationResult,
        parking: parkingResult,
        forbidden: forbiddenResult,
        boundaries: boundariesResult,
        city: cityName,
        coords: coords,
        zone: zoneResult,
        inDefinedParking: (parkingResult || stationResult)
    }
    return result
}

function evaluateFees(start, end) {
    let cost = 0;
    //  Om en kund tar en cykel som står på fri parkering - och lämnar på en definierad parkering - så blir startavgiften lite lägre
    if (start.inDefinedParking == false && end.inDefinedParking == true) {
        cost -= 10;
    }
    //  Cyklar kan även parkeras utanför laddstationer och utanför accepterade platser, men det kan då tillkomma en extra avgift för kunden. Detta kallas fri parkering.
    if (end.zone == true && end.inDefinedParking == false) {
        cost += 10;
    }
    return cost;
}

module.exports = {
    "getTripData": getTripData,
    "makeFetch": makeFetch,
    "getPositionZoneData": getPositionZoneData,
    "evaluateFees": evaluateFees
}