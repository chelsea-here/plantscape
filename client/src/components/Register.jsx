import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"; // Import the new CSS file

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Modified to accept event directly from onSubmit
  const register = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    const user = {
      username,
      password,
    };

    try {
      setError(""); // Clear previous errors
      // Ensure axios is configured with a baseURL or use the full URL
      const { data } = await axios.post("/api/users/register", user);

      toast.success("Registration Was A Success");
      navigate("/profile");
    } catch (err) {
      // Changed 'error' to 'err' to avoid confusion with state variable
      console.error("Registration error:", err);
      // Check for error.response for Axios errors to get status code
      if (err.response && err.response.status === 500) {
        toast.error("Registration Has Failed (Server Error)");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        // If the backend sends a specific error message
        setError(err.response.data.message);
        toast.error(`Registration Failed: ${err.response.data.message}`);
      } else {
        setError(err.message);
        toast.error(`Registration Failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="register-container">
      {" "}
      {/* Apply the container class */}
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Apply error message class */}
      <form onSubmit={register}>
        {" "}
        {/* Use onSubmit for React forms */}
        <label>
          Username:
          <input type="text" name="username" required /> {/* Added required */}
        </label>
        <br /> {/* Consider using CSS for spacing instead of <br /> */}
        <label>
          Password:
          <input type="password" name="password" required />{" "}
          {/* Added required */}
        </label>
        {/* Removed <br /> here, rely on form gap */}
        <button type="submit">Register</button> {/* Added type="submit" */}
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
