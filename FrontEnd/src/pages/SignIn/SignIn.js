import React, { useState } from "react";
import "../SignIn/SignIn.css";
import Logo from "./images/mainpic.jpg";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ContainedButtons";
import axios from "axios";

const SignIn = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

/////////////////////////////////////


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:3001/signIn/user", {
      Email: formData.Email,
      Password: formData.Password,
    });

    if (response.data.success) {
      const { token, user } = response.data;
      console.log(user);  // Destructure the token and user data
      localStorage.setItem("token", token); // Store the token securely
console.log(user.email);
console.log("USER ID"+user.id);

      // Check if the user is an admin
      if (user.email.toLowerCase() === 'admin@gmail.com'.toLowerCase())
        
        {
          navigate("/AdminDashboard"); // Navigate to the admin dashboard
           
        }


      else {
        navigate("/homePage"); // Navigate to the main page for regular users
      }
    } else {
      setErrors({
        Email: "Invalid email address or password.",
        Password: "Invalid email address or password.",
      });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    setErrors({
      Email: "Incorrect username or password. Please try again later.",
      Password: "Incorrect username or password. Please try again later.",
    });
  }
};


  return (
    <div className="body">
      <div className="frame">
        <div className="pic-container">
          <h2>Are you enjoying your journey with us!</h2>
          <img src={Logo} alt="main-picture" />
        </div>
        <div className="form">
          <div className="header">
            <h2>Sign In</h2>
            <Link to="/SignUp">
              <h4 className="newAccount">
                Do not have an account? Create One
              </h4>
            </Link>
          </div>
          <div className="input">
            <input
              type="email"
              placeholder="Email*"
              name="Email"
              onChange={handleChange}
              value={formData.Email}
            />
            {errors.Email && <span className="error">{errors.Email}</span>}
            <input
              type="password"
              placeholder="Password*"
              name="Password"
              onChange={handleChange}
              value={formData.Password}
            />
            {errors.Password && <span className="error">{errors.Password}</span>}
          </div>
          <div className="Login">
            <div>
              <Button Name="Log In" onClick={handleSubmit} />
            </div>
            <div className="forgot-pw">Forgot Password?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
