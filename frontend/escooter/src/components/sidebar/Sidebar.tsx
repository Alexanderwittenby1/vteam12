"use client";
import React, { ReactNode } from "react";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";
import logo from "../../../public/gogo.png";
import { useRouter } from "next/navigation";
import { hasPermission } from "../../services/rbac";

const Sidebar = ({ user }: { user: ReactNode }) => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/login"); // Redirect to login page after logout
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="sidebar bg-color-1 p-3 d-flex flex-column rounded shadow"
      style={{ width: "280px", height: "100%" }}
    >
      <a className="d-flex flex-column flex-shrink-0 mb-3 mb-md-0 me-md-auto text-accent-2 text-decoration-none fw-bold">
        <Image src={logo} alt="GOGO Logo" style={{ width: "100px" }}></Image>
      </a>
      <hr></hr>
      <ul className="nav nav-pills flex-column mb-auto">
        {user && user.role && hasPermission(user.role, "adminView") && (
          <AdminSidebar />
        )}
        {user && user.role && hasPermission(user.role, "userView") && (
          <UserSidebar />
        )}
      </ul>
      <div className="d-flex align-items-center">
        <BsPersonCircle
          className="bi me-2"
          style={{ color: "#6d3170", width: "32px", height: "32px" }}
        />
        <a
          className="nav-link d-flex text-accent-2 align-items-center"
          href="#"
          onClick={handleLogout}
        >
          <CiLogout
            className="bi me-2"
            style={{ color: "#6d3170", width: "32px", height: "32px" }}
          />
          Logout
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
