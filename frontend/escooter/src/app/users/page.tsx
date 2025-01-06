import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import UserListCard from "./UserListCard";
import { fetchUserData } from "../../services/fetchUserData";
import { cookies } from 'next/headers'; 

const UserList = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const user = await fetchUserData(token);

  const response = await fetch('http://localhost:3000/api/getAllUsers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const users = response.ok ? await response.json() : [];

  return (
    <div
      className="d-flex p-3 bg-color-2"
      style={{ height: "calc(100vh + 0px)" }}
    >
      <Sidebar user={user} />
      <div
        className="p-3 d-flex justify-content-around"
        style={{ width: "100%", height: "100vh" }}
      >
        <UserListCard users={users} token={token}  />
      </div>
    </div>
  );
}

export default UserList;