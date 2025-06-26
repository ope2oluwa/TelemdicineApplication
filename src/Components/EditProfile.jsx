import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import styles from "./editProfile.module.css";

const IMGBB_API_KEY = "dd322961586fcc3d8fc0c2a65432e0e9"; // 🔁 Replace this with your real API key

export default function EditProfile() {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    displayName: "",
    concerns: [],
    goals: "",
    specialties: [],
    description: "",
    image: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setRole(userData.role || "student");

          const commonFields = {
            displayName: userData.displayName || "",
            concerns: userData.concerns || [],
            goals: Array.isArray(userData.goals)
              ? userData.goals.join(", ")
              : userData.goals || "",
          };

          if (userData.role === "counselor") {
            const counselorDocRef = doc(db, "counselors", user.uid);
            const counselorDocSnap = await getDoc(counselorDocRef);
            if (counselorDocSnap.exists()) {
              const counselorData = counselorDocSnap.data();
              setFormData({
                ...commonFields,
                specialties: counselorData.specialties || [],
                description: counselorData.description || "",
                image: counselorData.image || "",
              });
            } else {
              setFormData({
                ...commonFields,
                specialties: [],
                description: "",
                image: "",
              });
            }
          } else {
            setFormData({ ...commonFields });
          }
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "concerns" || name === "specialties") {
      setFormData((prev) => {
        const updatedArray = checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value);
        return { ...prev, [name]: updatedArray };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("image", selectedImageFile);

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          formData
        );

        imageUrl = response.data.data.url;
      }

      await updateDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        concerns: formData.concerns,
        goals: formData.goals
          .split(",")
          .map((goal) => goal.trim())
          .filter((goal) => goal),
      });

      if (role === "counselor") {
        await updateDoc(doc(db, "counselors", user.uid), {
          name: formData.displayName,
          specialties: formData.specialties,
          description: formData.description,
          image: imageUrl,
        });
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Display Name</label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          required
        />

        {role === "student" && (
          <>
            <label>Areas of Concern</label>
            <div className={styles.checkboxGroup}>
              {["stress", "anxiety", "depression", "sleep disorders"].map(
                (concern) => (
                  <label key={concern} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      name="concerns"
                      value={concern}
                      checked={formData.concerns.includes(concern)}
                      onChange={handleChange}
                    />
                    {concern.charAt(0).toUpperCase() + concern.slice(1)}
                  </label>
                )
              )}
            </div>

            <label>Mental Health Goals</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Example: sleep better, reduce anxiety"
            />
          </>
        )}

        {role === "counselor" && (
          <>
            <label>Specialties</label>
            <div className={styles.checkboxGroup}>
              {["stress", "anxiety", "depression", "sleep"].map((specialty) => (
                <label key={specialty} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="specialties"
                    value={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onChange={handleChange}
                  />
                  {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </label>
              ))}
            </div>

            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short bio or counseling philosophy"
            />

            <label>Upload Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <p>Or paste image URL below (optional):</p>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Optional link to profile picture"
            />
          </>
        )}

        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
