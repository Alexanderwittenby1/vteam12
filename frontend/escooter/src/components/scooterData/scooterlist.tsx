import React from "react";

interface Scooter {
  scooter_id: number;
  battery_level: string;
  city_id: number;
  is_available: number;
  is_charging: number;
  last_maintenance: string;
  latitude: string;
  longitude: string;
  needs_service: number;
  status: string;
}

interface ScooterListProps {
  scooters: Scooter[];
}

const ScooterList: React.FC<ScooterListProps> = ({ scooters }) => {
  return (
    <div>
      <h2>Scooter Lista</h2>
      <ul>
        {scooters.map((scooter) => (
          <li key={scooter.scooter_id}>
            <strong>Model:</strong> {scooter.scooter_id} <br />
            <strong>Battery Level:</strong> {scooter.battery_level}% <br />
            <strong>Status:</strong> {scooter.status} <br />
            <strong>Last Maintenance:</strong>{" "}
            {new Date(scooter.last_maintenance).toLocaleDateString()} <br />
            {/* Lägg till andra fält som du vill visa */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScooterList;