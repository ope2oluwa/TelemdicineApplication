import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Brain } from "lucide-react";
import styles from "./signup.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [selectedRole, setSelectedRole] = useState("student"); // used for Google signup
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullName });

      // Save to users collection (common to both students and counselors)
      await setDoc(doc(db, "users", user.uid), {
        displayName: formData.fullName,
        email: formData.email,
        role: formData.role,
        concerns: [],
        goals: [],
      });

      // If counselor, also save to counselors collection
      if (formData.role === "counselor") {
        await setDoc(doc(db, "counselors", user.uid), {
          name: formData.fullName,
          email: formData.email,
          specialties: [],
          description: "Licensed mental health professional",
          image: "",
        });
        navigate("/my-sessions");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // New user, redirect to choose role
        navigate("/choose-role");
      } else {
        // Existing user, redirect based on role
        const existingRole = userDocSnap.data().role;
        existingRole === "counselor" ? navigate("/my-sessions") : navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };
  
  /* const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Ask user to choose a role
        navigate("/choose-role");

        const role = selectedRole === "counselor" ? "counselor" : "student";

        // Save user info to users collection
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          role,
          concerns: [],
          goals: [],
        });

        // Save counselor-specific data if needed
        if (role === "counselor") {
          await setDoc(doc(db, "counselors", user.uid), {
            name: user.displayName,
            email: user.email,
            specialties: [],
            description: "Licensed mental health professional",
            image: "",
          });
        }

        // Redirect
        role === "counselor" ? navigate("/my-sessions") : navigate("/");
      } else {
        const existingRole = userDocSnap.data().role;

        // Redirect existing users
        existingRole === "counselor" ? navigate("/my-sessions") : navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  }; */
  
  

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupContent}>
        <div className={styles.signupFormContainer}>
          <h2>Sign Up</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <label>Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
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
            <label>Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => {
                handleChange(e);
                setSelectedRole(e.target.value);
              }}
            >
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>
            </select>
            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>
          </form>
          <h3>OR</h3>
          <button
            onClick={handleGoogleSignup}
            className={styles.googleSignupButton}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className={styles.googleIcon}
            />
            Continue with Google
          </button>
          <p className={styles.switchAuthText}>
            Already have an account?{" "}
            <a href="/login" className={styles.loginLink}>
              Log in
            </a>
          </p>
        </div>
        <div className={styles.signupRight}>
          <Brain className={styles.icon} /> CalmConnect
          <h1>Supporting Your Mental Wellbeing Journey</h1>
          <p>
            Connect with AI support, professional counselors to navigate stress,
            anxiety, depression, and sleep challenges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
