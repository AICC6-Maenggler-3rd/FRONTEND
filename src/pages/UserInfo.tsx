import React, { useEffect, useState } from "react";
import { getUserInfo, logout } from "../api/auth";

export const UserInfo = () => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data.user);
      } catch (err) {
        console.log("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};