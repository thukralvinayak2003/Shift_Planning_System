import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );

    localStorage.setItem("user", JSON.stringify(response.data));
    setUser(response.data);
  };

  const register = async (name, email, password, role) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/register`,
      {
        name,
        email,
        password,
        role,
      },
      { withCredentials: true }
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    setUser(response.data);
  };

  const logout = async () => {
    await axios.get(`${import.meta.env.API_URL}/api/users/register`, {
      withCredentials: true,
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
