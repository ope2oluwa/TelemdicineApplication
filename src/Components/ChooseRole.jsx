// ChooseRole.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import styles from "./chooserole.module.css"; 

const ChooseRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (!selectedRole || !user) return;

    try {
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        role: selectedRole,
        concerns: [],
        goals: [],
      });

      if (selectedRole === "counselor") {
        await setDoc(doc(db, "counselors", user.uid), {
          name: user.displayName,
          email: user.email,
          specialties: [],
          description: "Licensed mental health professional",
          image: "",
        });
        navigate("/my-sessions");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Choose Your Role</h2>
      <div className={styles.options}>
        <label>
          <input
            type="radio"
            value="student"
            checked={selectedRole === "student"}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="counselor"
            checked={selectedRole === "counselor"}
            onChange={(e) => setSelectedRole(e.target.value)}
          />
          Counselor
        </label>
      </div>
      <button onClick={handleSubmit} disabled={!selectedRole}>
        Continue
      </button>
    </div>
  );
};

export default ChooseRole;
