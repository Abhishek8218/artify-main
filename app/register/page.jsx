"use client";

import "@styles/Register.scss";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import {toast, Toaster} from "react-hot-toast"
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const router = useRouter();

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const registerForm = new FormData();

      for (var key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await fetch("/api/register/", {
        method: "POST",
        body: registerForm,
      });

      if (response.ok) {
        toast.success("Registration Successfull")
        router.push("/login");
      }
    } catch (err) {
      toast.error("Registration Failed")
      console.log("Registration failed", err.message);
    }
  };



  // const loginWithGoogle = () => {
  //   signIn("google", { callbackUrl: "/" });
  // };

  return (
    
    <div className="register">
       <Toaster position="top-center" reverseOrder={true} />
      <img
        src="/assets/register.jpg"
        alt="register"
        className="register_decor"
      />
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}
          <input
            id="image"
            type="file"
            name="profileImage"
            onChange={handleChange}
            accept="image/*"
            style={{ display: "none" }}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile" />
            <p>Upload Profile Photo</p>
          </label>
          {formData.profileImage ? (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile"
              style={{ maxWidth: "80px", maxHeight: "80px" }}
            />
          ): (<p style={{ color: "red", fontSize:"12px",margin: "-10px" }}>***Profile Image is must***</p>)}
          <button type="submit" disabled={!formData.profileImage ||!passwordMatch}>
            Register
          </button>
        </form>
        <div className="login">
          <p>Already have an account?</p>
        <a href="/login">Login Here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;