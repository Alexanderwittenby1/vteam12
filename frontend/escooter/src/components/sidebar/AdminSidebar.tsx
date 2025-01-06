import {
  BsSpeedometer2,
  BsBuilding,
  BsPeople,
  BsScooter,
  BsPersonCircle,
} from "react-icons/bs";

import React from "react";
import Link from "next/link";

function AdminSidebar() {
  return (
    <div>
      <li className="nav-item align-items-center">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/profile"
        >
          <BsSpeedometer2 className="bi me-2" style={{ color: "#6d3170" }} />
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="#home"
        >
          <BsBuilding className="bi me-2" style={{ color: "#6d3170" }} />
          Cities
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/scooters"
        >
          <BsScooter className="bi me-2" style={{ color: "#6d3170" }} />
          Scooters
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/users"
        >
          <BsPeople className="bi me-2" style={{ color: "#6d3170" }} />
          Users
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/mapDesktop"
        >
          <BsPeople className="bi me-2" style={{ color: "#6d3170" }} />
          Monitor
        </Link>
      </li>
    </div>
  );
}

export default AdminSidebar;
