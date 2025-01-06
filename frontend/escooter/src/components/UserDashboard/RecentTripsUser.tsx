import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS för Bootstrap

function RecentTrips(props) {
  const items = props.array;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${distance * 100} m`;
    } else {
      return `${distance} km`;
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-accent-2 fw-bold">Recent Trips</h3>
        <p className="card-text text-color-1 fw-normal">
          Your most recent trips
        </p>
        <ul
          className="list-group"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          {items.map((item) => (
            <li className="list-group-item border-0 " key={item.trip_id}>
              <h6>TripId: {item.trip_id}</h6>
              <div className="d-flex w-100 justify-content-between ">
                
                <small>Date: {formatDate(item.start_time)}</small>
              </div>
              <p>Distance: {formatDistance(item.distance)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RecentTrips;