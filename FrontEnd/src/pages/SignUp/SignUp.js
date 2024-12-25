import "../SignUp/SignUp.css";
import Logo from "./images/mainpic.jpg";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Button from "../SignIn/ContainedButtons";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let validationErrors = {};
    let isValid = true;

    // Check if any field is empty
    if (!formData.FirstName) {
      validationErrors.FirstName = "First Name is required.";
      isValid = false;
    }
    if (!formData.LastName) {
      validationErrors.LastName = "Last Name is required.";
      isValid = false;
    }
    if (!formData.Email) {
      validationErrors.Email = "Email is required.";
      isValid = false;
    } else if (!validateEmail(formData.Email)) {
      validationErrors.Email = "Invalid email address.";
      isValid = false;
    }
    if (!formData.Password) {
      validationErrors.Password = "Password is required.";
      isValid = false;
    } else if (!validatePassword(formData.Password)) {
      validationErrors.Password = "Password must be at least 8 characters long";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (formData.Password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
   

    setErrors(validationErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //const handleSave = () => {
  //  localStorage.setItem("user", JSON.stringify(formData));
  //  alert("User data saved to local storage!");};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      console.log(formData);
      
      //handleSave();

      try {
        const response = await axios.post(
          "http://localhost:3001/register/addUser",
          formData
        );
        console.log("Success:", response.data);
        alert("User created successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Error creatin user. Please try again.");
      }

      // Clear the form after successful submission
      setFormData({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        confirmPassword: "",
      });

      setErrors({});
    }
  };

  return (
    <div className="body">
      <div className="frame">
        <div className="pic-container">
          <h2>Start your journey with us</h2>
          <img src={Logo} alt="main-picture" />
        </div>
        <div className="form">
          <div className="header">
            <h2>Signup</h2>
            <p>
              <Link to="/SignIn">
                <u>Already have an account</u>
              </Link>
            </p>
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="First Name*"
              value={formData.FirstName}
              onChange={handleChange}
              name="FirstName"
            />
            {errors.FirstName && (
              <span className="error">{errors.FirstName}</span>
            )}
            <input
              type="text"
              placeholder="Last Name*"
              value={formData.LastName}
              onChange={handleChange}
              name="LastName"
            />
            {errors.LastName && (
              <span className="error">{errors.LastName}</span>
            )}
            <input
              type="email"
              placeholder="Email*"
              value={formData.Email}
              onChange={handleChange}
              name="Email"
            />
            {errors.Email && <span className="error">{errors.Email}</span>}
            <input
              type="password"
              placeholder="Password*"
              value={formData.Password}
              onChange={handleChange}
              name="Password"
            />
            {errors.Password && (
              <span className="error">{errors.Password}</span>
            )}
            <input
              type="password"
              placeholder="Confirm Password*"
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
            
            
          </div>

          <div>
            <Button Name="SUBMIT" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
