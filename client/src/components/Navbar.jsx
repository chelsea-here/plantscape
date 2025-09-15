import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  return (
    <nav className="navbar">
      {user?.id ? (
        <>
          <span>PlantScape</span>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          {"  "}
          <NavLink
            to="/plants"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Plants
          </NavLink>
          {"  "}
          <NavLink
            to="/quiz"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Style Quiz
          </NavLink>
          {"  "}
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Profile
          </NavLink>
          {"  "}
          <button onClick={logout}>logout</button>
        </>
      ) : (
        <>
          <span>PlantScape</span>
          {"  "}
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          {"  "}
          <NavLink
            to="/plants"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Plants
          </NavLink>
          {"  "}
          <NavLink
            to="/quiz"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Style Quiz
          </NavLink>
          {"  "}
          <NavLink
            to="/Login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Login
          </NavLink>
        </>
      )}
    </nav>
  );
}
