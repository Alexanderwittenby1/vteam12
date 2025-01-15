export interface ScooterLocation {
    latitude: number;
    longitude: number;
  }
  
  export interface Scooter {
    id: string;
    location: ScooterLocation;
    battery: number;
    status: string;
  }

  