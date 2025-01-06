import Sidebar from "@/components/sidebar/Sidebar";
import ScooterList from "../../components/scooterData/scooterlist"; // Importera ScooterList-komponenten
import { fetchUserData } from "@/services/fetchUserData";
import { cookies } from "next/headers";
const scooters = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore.get("token")?.value) || "";
  const user = await fetchUserData(token);
  const response = await fetch('http://localhost:3000/api/scooters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const scooters = response.ok ? await response.json() : [];
  return (
    <div
      className="d-flex bg-color-2 p-3"
      style={{ height: "100vh", width: "100%" }}
    >
      <div style={{ flex: "0 0 280px", height: "100%" }}>
        <Sidebar user={user} />
      </div>
      <h1>Welcome to the scooters page</h1>
      <p>Here you can see a list of scooters</p>
      <ScooterList scooters={scooters} />
    </div>
  );
}

export default scooters;