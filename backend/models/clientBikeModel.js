

const bookBike = async (payload) => {
    try {
        let url = `http://simulation:3333/bookbike`;
      const response = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result;
  
    } catch (error) {
      throw new Error(`Failed to book bike: ${error.message}`);
    }
  };

const stopClientBike = async (payload) => {
    try {
        let url = `http://simulation:3333/stopbike`;
        let mode = "PUT";
        const response = await fetch(`${url}`, {
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

const startSimulation = async (payload) => {
  try {
      let url = `http://simulation:3333/startsimulation`;
      let mode = "POST";
      const response = await fetch(`${url}`, {
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
    let url = `http://simulation:3333/movebike`;
    try {
        let mode = "PUT";
        const response = await fetch(`${url}`, {
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
    "moveClientBike": moveClientBike,
    "startSimulation": startSimulation
}