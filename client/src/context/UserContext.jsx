import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({}); // will hold { id, email, isAdmin, ... }
  const [loading, setLoading] = useState(true); // NEW: To indicate if user data is still being fetched
  const navigate = useNavigate();

  const getHeaders = () => {
    const token = window.localStorage.getItem("token");
    // Return an object with headers if token exists, otherwise an empty object
    // This prevents sending 'undefined' as authorization header
    return token ? { headers: { authorization: token } } : {};
  };

  const attemptLogin = async () => {
    setLoading(true);
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await axios.get("/api/authenticate/me", getHeaders());
        setUser(data);
      } catch (error) {
        console.error("Authentication failed:", error); // Use console.error for errors
        window.localStorage.removeItem("token");
        setUser(null); // Clear user on auth failure
      } finally {
        setLoading(false); // NEW: End loading regardless of success or failure
      }
    } else {
      setLoading(false); // NEW: If no token, no need to load
      setUser(null); // NEW: Ensure user is null if no token
    }
  };

  // Effect to attempt login on component mount
  useEffect(() => {
    attemptLogin();
  }, []); //Runs once on mount

  const logout = () => {
    window.localStorage.removeItem("token");
    setUser(null); // Clear user state
    navigate("/"); // Redirect to home page
  };

  // NEW: Derived states for convenience
  const isLoggedIn = !!user; // True if user object is not null/undefined
  const userId = user ? user.id : null;

  // Provide all necessary values to consumers
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        attemptLogin,
        logout,
        getHeaders,
        isLoggedIn,
        userId,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
