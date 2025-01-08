
function getCityZones(cityName) {
    let city = {}
    let forbidden = {}
    let cityCoords
    try {
        city = require(`../cities/${cityName}.json`);
    } catch (err) {
        console.log(err)
        return 0;
    }
    
    city.features.forEach(feature => {
        if (feature.properties.role === "forbidden") {
            forbidden.push(feature);
        } else if (feature.properties.role === "zone") {
            cityCoords.push(feature);
        } else if (feature.properties.role === "station") {
            stations.push(feature);
        } else if (feature.properties.role === "parking") {
           parkingZones.push(feature);
        } else if (feature.properties.role === "boundary" || feature.properties.role === "forbidden") {
            boundaries.push(feature);
        }
    });
}