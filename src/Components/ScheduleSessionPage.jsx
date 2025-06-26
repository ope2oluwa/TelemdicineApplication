import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import styles from "./schedulesessionpage.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

const ScheduleSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const docRef = doc(db, "counselors", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCounselor({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Counselor not found");
        }
      } catch (err) {
        console.error("Error fetching counselor:", err);
      }
    };

    fetchCounselor();
  }, [id]);

  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleConfirm = async () => {
    if (!date || !time) {
      openModal("Please select both a date and time.");
      return;
    }

    if (!user) {
      openModal("You need to be logged in to schedule a session.");
      return;
    }

    try {
      const sessionRef = collection(db, "sessions");

      await addDoc(sessionRef, {
        studentEmail: user.email,
        studentName: user.displayName || "Anonymous",
        counselorId: counselor.id,
        counselorName: counselor.name,
        counselorImage: counselor.image,
        counselorSpecialties: counselor.specialties || [],
        date,
        time,
        timestamp: new Date(),
      });

      openModal(
        `Session scheduled with ${counselor.name} on ${date} at ${time}`
      );
      setTimeout(() => {
        navigate("/my-sessions");
      }, 1500);
    } catch (error) {
      console.error("Error saving session:", error);
      openModal("Failed to schedule session. Please try again.");
    }
  };

  if (!counselor) return <p>Loading counselor data...</p>;

  return (
    <div className={styles.schedulePage}>
      <div className={styles.card}>
        <img
          src={counselor.image}
          alt={counselor.name}
          className={styles.image}
        />
        <div className={styles.info}>
          <h2>{counselor.name}</h2>
          <p>{counselor.description}</p>
          <div className={styles.specialties}>
            {counselor.specialties?.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.form}>
        <h3>Schedule Your Session</h3>
        <label>
          <FaCalendarAlt className={styles.icon} /> Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
          />
        </label>
        <label>
          <FaClock className={styles.icon} /> Select Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={styles.input}
          />
        </label>
        <button onClick={handleConfirm} className={styles.button}>
          Confirm Session
        </button>
      </div>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button onClick={closeModal} className={styles.closeModalButton}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSessionPage;
