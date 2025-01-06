
import { useState, useEffect } from "react";

interface User {
  email: string;
  password: string;
  balance: string;
  created_at: string;
  is_admin: number;
  last_login: string | null;
  oauth_provider: string | null;
  user_id: number;
  payment_method: string;
}

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:4000/admin/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av data");
        }

        const data = await response.json();
        console.log("Data received from server:", data);

        // Check if the data is an array and if it's not empty
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        } else {
          setError("No users found or data is malformed");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, error, loading };
}

export default useGetUsers;
