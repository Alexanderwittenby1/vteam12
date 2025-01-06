import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS för Bootstrap

function StatCard({ stat, text, icon: Icon, addCurrency }) {
  
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex">
          <Icon
            className="bi me-2"
            style={{ color: "#6d3170", width: "32px", height: "32px" }}
          />
          <h3 className="card-title text-accent-2 fw-bold">{stat}</h3>
        </div>
        <p className="card-text text-color-1 fw-normal">{text}</p>
        <div>
          <p className="card-text text-color-1 fw-normal">{addCurrency}</p>
        </div>
        
      </div>
    </div>
  );
}

export default StatCard;
