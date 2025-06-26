import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [counselorData, setCounselorData] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);
          setRole(data.role);

          if (data.role === "counselor") {
            const counselorDocRef = doc(db, "counselors", user.uid);
            const counselorDocSnap = await getDoc(counselorDocRef);
            if (counselorDocSnap.exists()) {
              setCounselorData(counselorDocSnap.data());
            }
          }
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className={styles.profile}>
      <h1>My Profile</h1>

      {role === "counselor" && counselorData?.image && (
        <img
          src={counselorData.image}
          alt="Profile"
          className={styles.profileImage}
        />
      )}

      <div className={styles.profileinfo}>
        <p>
          <strong>Name:</strong> {userData.displayName || counselorData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>

        {role === "student" && (
          <>
            <p>
              <strong>Areas of Concern:</strong>{" "}
              {Array.isArray(userData.concerns)
                ? userData.concerns.join(", ")
                : userData.concerns || "Not set"}
            </p>
            <p>
              <strong>Mental Health Goals:</strong>{" "}
              {Array.isArray(userData.goals)
                ? userData.goals.join(", ")
                : userData.goals || "Not set"}
            </p>
          </>
        )}

        {role === "counselor" && counselorData && (
          <>
            <p>
              <strong>Specialties:</strong>{" "}
              {counselorData.specialties?.join(", ") || "Not set"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {counselorData.description || "Not set"}
            </p>
          </>
        )}
      </div>

      <button
        className={styles.editbtn}
        onClick={() => navigate("/edit-profile")}
      >
        Edit Profile
      </button>
      <button
        className={styles.editbtn}
        onClick={() => navigate("/my-sessions")}
      >
        View My Sessions
      </button>
    </div>
  );
}
