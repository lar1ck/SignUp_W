// import React from 'react'
// import { useNavigate } from 'react-router';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
import { Outlet } from 'react-router';

// interface userProps {
//   id: number,
//   first_name: string,
//   last_name: string,
//   email: string,
// }

const Dashboard = () => {
  // const navigate = useNavigate();
  // const [users, setUsers] = useState<userProps[]>([]);
  // const token = localStorage.getItem('token');



  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const response = await axios.get("http://localhost:5000/api/users", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     setUsers(response.data)
  //   }
  //   fetchUsers();
  // })
  return (
    <div>
      <Outlet />
      {/* {users.length > 0 ? <div className='w-full'>
        {users.map((user) => (
          <div key={user.id} className='m-1 p-4 bg-blue-300 w-max'>
            Email: {user.email} <br />
            First name: {user.first_name} <br />
            Last name: {user.last_name} <br />
          </div>
        ))}
      </div> : "No Users Yet"} */}
    </div>
  )
}

export default Dashboard