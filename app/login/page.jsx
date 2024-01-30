"use client";

import "@styles/Login.scss";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {toast, Toaster }from "react-hot-toast";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.success("Logging You In....")
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (response.ok) {
      
        router.push("/")
      }

      if (response.error) {
        setError("Invalid email or password. Please try again!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const loginWithGoogle = () => {
  //   signIn("google", { callbackUrl: "/" });
  // };

  return (
    <div className="login">
       <Toaster position="top-center" reverseOrder={true} />
      <img src="/assets/login.jpg" alt="login" className="login_decor" />
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Log In</button>
        </form>
        <div className="register">
        <p>Don't have an account?</p>
      <a href="/register">Register Here</a>
        </div>
       
      </div>
    </div>
  );
};

export default Login;