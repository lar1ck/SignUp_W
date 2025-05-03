import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProps {
  id: number,
  first_name: string,
  last_name: string,
  email: string,
}

function SignupForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [users, setUsers] = useState<UserProps[]>([]);
  const [fetchUsersError, setFetchUsersError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      console.log("registered");
      alert(result.message);
      // navigate("/dashboard");
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setFetchUsersError("Unauthorized");
          } else if (err.response?.status === 403) {
            setFetchUsersError("Token expired or invalid");
          } else {
            setFetchUsersError("An unexpected error occurred");
          }
        } else {
          setFetchUsersError("Network or unknown error");
        }
      }
    }
    fetchUsers();
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className='p-1 border m-1'
          type="text"
          name="first_name"
          placeholder="First_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        /><br />

        <input
          className='p-1 border m-1'
          type="text"
          name="last_name"
          placeholder="Last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        /><br />

        <input
          className='p-1 border m-1'
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          className='p-1 border m-1'
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        <input
          className='p-1 border m-1'
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit" className='px-3 py-1 bg-black text-white font-bold rounded-lg'>Sign Up</button>
      </form> <br />

      <div>
        {users.length > 0 ?
          <div>
            {users.map((user) => (
              <div key={user.id} className='bg-cyan-100 mt-2 '>
                First Name: {user.first_name} <br />
                Last Name: {user.last_name} <br />
                Email: {user.email} <br />
              </div>
            ))}
          </div>
          : <p> {fetchUsersError} </p>}

      </div>
    </>
  );
}

export default SignupForm;