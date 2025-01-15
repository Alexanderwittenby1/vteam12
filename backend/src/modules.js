const fs = require("fs");
const pointInPolygon = require("point-in-polygon")

function createJsonMapData() {
    let cities = ["karlshamn", "karlskrona", "kristianstad"]
   
    for (const cityName of cities) {
        const cityData = fs.readFileSync(`./../cities/${cityName}.json`, "utf-8");
        const city = JSON.parse(cityData);

        let forbidden = [];
        let cityCoords = [];
        let stations = [];
        let boundaries = [];
        let parkingZones = [];

        city.features.forEach(feature => {
            if (feature.properties.role === "forbidden") {
                forbidden.push(feature.geometry.coordinates[0]);
            } else if (feature.properties.role === "zone") {
                cityCoords.push(feature.geometry.coordinates[0]);
            } else if (feature.properties.role === "station") {
                stations.push(feature.geometry.coordinates[0]);
            } else if (feature.properties.role === "parking") {
               parkingZones.push(feature.geometry.coordinates[0]);
            } else if (feature.properties.role === "boundary" || feature.properties.role === "forbidden") {
                boundaries.push(feature.geometry.coordinates[0]);
            }
        });
        const cityObject = {
            city: cityName,
            zone: cityCoords,
            stations: stations,
            parking: parkingZones,
            forbidden: forbidden,
            boundaries: boundaries
        }

        const outputPath = `./../cities/${cityName}Data.json`;
        fs.writeFileSync(outputPath, JSON.stringify(cityObject, null, 2), "utf-8");
    }
}

function getPositionZoneData(cityName, coords) {

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
        zone: zoneResult
    }
    return result
}

// for testing uncomment and try yourself below. :P
// let coords =  [
//     14.840744043375366,
//     56.182255207925635
//   ]
//   getPositionZoneData("karlshamn", coords);

module.exports = {
    "getPositionZoneData": getPositionZoneData,

}
