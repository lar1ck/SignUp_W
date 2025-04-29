import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProps{
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
  const [users,setUsers] = useState<UserProps[]>([]);

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
      alert(result.message);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    }
    fetchUsers();
  })

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="last_name"
          placeholder="Last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Sign Up</button>
      </form> <br />

      <div>
        {users.map((user) =>(
          <div key={user.id}>
              First Name: {user.first_name} <br />
              Last Name: {user.last_name} <br />
              Email: {user.email} <br />  
          </div>
        ))}
      </div>
    </>
  );
}

export default SignupForm;