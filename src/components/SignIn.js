import React, { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, emailAtom } from "../state";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const SignIn = ({ setIsAuthenticated }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useAtom(userAtom);
  const [, setEmailState] = useAtom(emailAtom);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // const API_URL = process.env.REACT_APP_API_URL;
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL_DEVELOPMENT;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, {
        identifier,
        password,
      });
      const { jwt, user } = response.data;
      localStorage.setItem("jwtToken", jwt);
      setUser(user.username);
      setEmailState(user.email);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
        setError("Bad request. Please try again.");
      } else if (error.response && error.response.status === 400) {
        console.error("Bad Request Error:", error.response.data);
        setError(
          "Invalid username or password. Please check your credentials."
        );
      } else if (error.response && error.response.status === 404) {
        console.error("User Not Found:", error.response.data);
        setError("User not found. Please check your username.");
      } else {
        console.error("Error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
        <p className="switch-auth">
          Not registered?{" "}
          <Link
            to="/signup"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
