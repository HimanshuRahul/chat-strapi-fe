import React, { useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, emailAtom } from "../state";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const SignUp = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useAtom(userAtom);
  const [, setEmailState] = useAtom(emailAtom);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL_DEVELOPMENT;

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/local/register`, {
        email,
        username,
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
        setError(error.response.data.message);
      } else {
        console.error("Error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="switch-auth">
          Already a user?{" "}
          <Link
            to="/signin"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
