// import React from 'react'
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface userProps {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<userProps[]>([]);
  const token = localStorage.getItem('token');

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate("/authpage")
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data)
    }
    fetchUsers();
  })
  return (
    <div>
      
      <h1>Home</h1>
      <h1>About</h1>
      <h1>Display Product</h1>

      {users.length > 0 ? <div className='w-full'>
        {users.map((user) => (
          <div key={user.id} className='m-1 p-4 bg-blue-300 w-max'>
            Email: {user.email} <br />
            First name: {user.first_name} <br />
            Last name: {user.last_name} <br />
          </div>
        ))}
      </div> : "No Users Yet"}

      <button onClick={handleLogOut}>Log out</button>
    </div>
  )
}

export default Dashboard