"use client";
import React, { useState, useEffect } from "react";
import { BsTrash, BsPencil } from "react-icons/bs";
import AdminUserUpdateModal from "../../components/modal/PasswordUpdateModal";

interface User {
  user_id: number;
  name: string;
  email: string;
  last_login: string;
  role: string;
}

interface UserListCardProps {
  users: User[];
  token: string;
}

function UserListCard({ users: initialUsers, token }: UserListCardProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getAllUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowModal = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSaveUserDetails = async (email: string, password: string, role: string) => {
    if (selectedUser) {
      console.log(`Updating details for user ${selectedUser.user_id}`);
      try {
        const response = await fetch(`http://localhost:3000/api/updateUser`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: selectedUser.user_id, email, password, role }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user details');
        }

        console.log(`Details updated for user ${selectedUser.user_id}`);
        await fetchUsers(); // Hämta användardata igen efter uppdatering
      } catch (error) {
        console.error('Error updating user details:', error);
      }
    }
    handleCloseModal();
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      console.log(`User ${userId} deleted`);
      await fetchUsers(); // Hämta användardata igen efter borttagning
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card border border-2 shadow-sm" style={{ width: "100%" }}>
      <div className="card-body">
        <h3 className="card-title text-accent-2">User list</h3>
        <p className="card-text">List of all users.</p>
        <ul className="list-group">
          {users.map((user) => (
            <li className="list-group-item" key={user.user_id}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">
                  {user.email}{" "} 
                  <span className={`badge rounded-pill ${user.role === 'admin' ? 'bg-danger' : 'bg-color-3'}`}>
                    {user.role}
                  </span>
                </h5>
                <small>Last active: {user.last_login}</small>
              </div>
              <button type="button" className="btn text-accent-2 btn-sm" onClick={() => handleShowModal(user)}>
                <BsPencil />
              </button>
              <button type="button" className="btn text-accent-2 btn-sm" onClick={() => handleDeleteUser(user.user_id)}>
                <BsTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <AdminUserUpdateModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveUserDetails}
        />
      )}
    </div>
  );
}

export default UserListCard;