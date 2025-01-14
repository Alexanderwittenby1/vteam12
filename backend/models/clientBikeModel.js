let url = `http://localhost:3010/clientbike`;

const bookBike = async (payload) => {
    try {
        let mode = "PUT";
        const response = await fetch(`${url}/bookbike`, {
            method: mode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const results = await response.json();
        return results;
    } catch (error) {
        throw error;
    }
};

const stopClientBike = async (payload) => {
    try {
        let mode = "PUT";
        const response = await fetch(`${url}/stop`, {
            method: mode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const results = await response.json();
        return results;
    } catch (error) {
        throw error;
    }
};

const moveClientBike = async (payload) => {
    try {
        let mode = "PUT";
        const response = await fetch(`${url}/move`, {
            method: mode,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const results = await response.json();
        return results;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    "bookBike": bookBike,
    "stopClientBike": stopClientBike,
    "moveClientBike": moveClientBike
}