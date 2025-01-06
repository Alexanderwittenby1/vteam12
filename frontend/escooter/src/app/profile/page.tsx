// src/app/profile/page.tsx
import { fetchUserData } from "@/services/fetchUserData";
import Sidebar from "../../components/sidebar/Sidebar";
import RecentTransactions from "@/components/UserDashboard/RecentTransactions";
import RecentTrips from "@/components/UserDashboard/RecentTripsUser";
import StatCard from "@/components/UserDashboard/StatCard";
import { cookies } from "next/headers";
import "bootstrap/dist/css/bootstrap.min.css";
import { hasPermission } from "@/services/rbac";
import { fetchTripData } from "@/services/fetchUserTrips";
import { BsBarChart, BsScooter, BsTree, BsWallet2 } from "react-icons/bs";
import Link from "next/link";



  
 


const Profile = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore.get("token")?.value) || "";
  const user = await fetchUserData(token);
  const trips = await fetchTripData(token);
  console.log("trips:",trips);
   if (!user) {
    return <p>Loading...</p>;
  }
  

  const tripData = {
    totalDistance: function (trips) {
      if (!Array.isArray(trips)) {
        console.error("Invalid input: trips should be an array.");
        return 0;
      }

      const total = trips.reduce((acc, trip) => {
        const distance = parseFloat(trip.distance);
        if (!isNaN(distance)) {
          return acc + distance;
        }
        return acc;
      }, 0);
      
      return Math.round(total * 100) ;
    },

    totalTrips: function (trips) {
      if (!Array.isArray(trips)) {
        console.error("Invalid input: trips should be an array.");
        return 0;
      }

      return trips.length;
    },

    co2: function (distance) {
      const co2Car = 0.21;
      const savedCo2 = distance * co2Car;

      return Math.round(savedCo2 * 100) / 100;
    },
  };

  return (
    <div
      className="d-flex bg-color-2 p-3"
      style={{ height: "100vh", width: "100%" }}
    >
      <div style={{ flex: "0 0 280px", height: "100%" }}>
        <Sidebar user={user} />
      </div>

      <div
        className="d-flex flex-column"
        style={{ flex: "1", overflowY: "auto" }}
      >
        {hasPermission(user.role, "adminView") && (
          <div
            className="admin-dash d-flex justify-content-around"
            style={{ width: "100%", height: "50vh" }}
          >
            Admin-innehåll
          </div>
        )}

        {hasPermission(user.role, "userView") && (
          <div>
            <div className="container">
              <div className="row">
                 
                <div className="col-md-6 mb-3">
                  <RecentTrips array={trips} />
                </div>
                <div className="col-md-6 mb-3">
                  <RecentTransactions />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <StatCard
                    stat={`${tripData.totalDistance(trips)} Meters`}
                    text={"Total distance travelled"}
                    icon={BsBarChart}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <StatCard
                    stat={tripData.totalTrips(trips)}
                    text={"Trips made"}
                    icon={BsScooter}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <StatCard
                    stat={`${tripData.co2(
                      tripData.totalDistance(trips)
                    )}kg CO₂`}
                    text={"Carbon saved"}
                    icon={BsTree}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <StatCard
                    stat={`${user.balance}kr`}
                    text={"Balance"}
                    icon={BsWallet2}
                    addCurrency={<Link href="/payment">ADD FUNDS</Link>}
                    
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
