import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, emailAtom } from "./state";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUser] = useAtom(userAtom);
  const [, setEmail] = useAtom(emailAtom);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    // const API_URL = process.env.REACT_APP_API_URL;
    const API_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_URL
        : process.env.REACT_APP_API_URL_DEVELOPMENT;
    if (token) {
      axios
        .get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.username);
          setEmail(response.data.email);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Invalid token or user not found", error);
          localStorage.removeItem("jwtToken");
        });
    }
  }, [setUser, setEmail]);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Chat /> : <Navigate to="/signin" />}
          />
          <Route
            path="/signin"
            element={
              !isAuthenticated ? (
                <SignIn setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUp setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
