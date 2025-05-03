import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isValid, setIsValid] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    axios.post("http://localhost:5000/api/verifyToken", {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (res.data.valid) {
        setIsValid(true);
      } else {
        setIsValid(false);
        localStorage.removeItem("token");
        alert(res.data.message);
      }
    })
    .catch(() => {
      setIsValid(false);
      localStorage.removeItem("token");
    });
  }, []);

  if (isValid === null) return <div>Loading...</div>; // or a spinner

  return isValid ? <Outlet /> : <Navigate to="/authpage" replace />;
};

export default ProtectedRoute;
