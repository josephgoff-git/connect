import axios from "axios";
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from "react";
import { API_URL } from '../config';
import { makeRequest } from "../axios"; 

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    console.log("Loging in ->")
    const res = await axios.post(API_URL + "/auth/login", inputs, {
      withCredentials: true
    });
    console.log(res)
    setCurrentUser(res.data)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
    makeRequest.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
    Cookies.set('accessToken', res.data.accessToken)
  };

  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const deleteUser = () => {
    setCurrentUser(null)
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateUser, deleteUser}}>
      {children}
    </AuthContext.Provider>
  );
}; 