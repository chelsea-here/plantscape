import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Plants from "./pages/Plants";
import PlantDetails from "./pages/PlantDetails.jsx";
import StyleQuiz from "./pages/StyleQuiz.jsx";
import MyProfile from "./pages/MyProfile";
import ProjectForm from "./pages/ProjectForm";
import MyProjects from "./pages/MyProjects.jsx";
import MyProject from "./pages/MyProject";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import GardenBedForm from "./pages/GardenBedForm";
import MyGardenBed from "./pages/MyGardenBed";
import MyGardenBeds from "./pages/MyGardenBeds.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  // const [user, setUser] = useState({});
  // const [projects, setProjects] = useState([]);
  // const navigate = useNavigate();

  // const getHeaders = () => {
  //   return {
  //     headers: {
  //       authorization: window.localStorage.getItem("token"),
  //     },
  //   };
  // };

  // useEffect(() => {
  //   const getProjects = async () => {
  //     if (!user?.id) return;
  //     try {
  //       //console.log('Fetching projects for user ID:', user?.id) used for debugging
  //       const { data } = await axios.get(`/api/projects/MyProjects/${user.id}`);
  //       //console.log(data) used for debugging
  //       setProjects(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getProjects();
  // }, [user.id]);

  // const attemptLogin = async () => {
  //   const token = window.localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const { data } = await axios.get("/api/authenticate/me", getHeaders());
  //       setUser(data);
  //     } catch (error) {
  //       console.log(error);
  //       window.localStorage.removeItem("token");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   attemptLogin();
  // }, []);

  // const logout = () => {
  //   window.localStorage.removeItem("token");
  //   setUser({});
  //   navigate("/");
  // };

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/plants/:id" element={<PlantDetails />} />
        <Route path="/quiz" element={<StyleQuiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* NEW: Wrapped routes that require authentication with ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/newproject" element={<ProjectForm />} />
          <Route path="/myprojects" element={<MyProjects />} />
          <Route path="/myproject/:projectId" element={<MyProject />} />
          <Route path="/newgardenbed" element={<GardenBedForm />} />
          <Route path="/mygardenbeds" element={<MyGardenBeds />} />
          <Route path="/mygardenbed/:layoutId" element={<MyGardenBed />} />
          <Route path="/Admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
