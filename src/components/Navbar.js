import React from "react";
import { useAtom } from "jotai";
import { userAtom } from "../state";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ setIsAuthenticated }) => {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-username">{user || "User"}</div>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
