import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import styles from "./login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const redirectBasedOnRole = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const role = docSnap.data().role;
      if (role === "student") {
        navigate("/");
      } else {
        navigate("/my-sessions");
      }
    } /* else {
      navigate("/");
    } */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await redirectBasedOnRole(userCredential.user);
    } catch (error) {
      console.error("Login error:", error.code);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await redirectBasedOnRole(result.user);
    } catch (error) {
      setError("Google sign-in failed");
    }
    navigate("/");
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent!");
    } catch {
      setResetMessage("Failed to send password reset email.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <h3>or</h3>
        <button
          onClick={handleGoogleLogin}
          className={styles.googleloginButton}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className={styles.googleIcon}
          />
          Login with Google
        </button>
        <p
          className={styles.forgotPassword}
          onClick={() => setIsResetting(!isResetting)}
        >
          Forgot Password?
        </p>
        {isResetting && (
          <div className={styles.passwordResetContainer}>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button
              onClick={handlePasswordReset}
              className={styles.resetButton}
            >
              Reset Password
            </button>
            {resetMessage && (
              <p className={styles.resetMessage}>{resetMessage}</p>
            )}
          </div>
        )}
        <p className={styles.switchAuthText}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
