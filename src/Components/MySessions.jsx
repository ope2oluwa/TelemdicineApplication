import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "./mysessions.module.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySessions = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        let q;
        if (user?.role === "student") {
          q = query(
            collection(db, "sessions"),
            where("studentEmail", "==", user.email)
          );
        } else if (user?.role === "counselor") {
          q = query(
            collection(db, "sessions"),
            where("counselorId", "==", user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const sessionList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSessions(sessionList);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const handleCancel = async (sessionId) => {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session cancelled successfully.", {
        position: "bottom-right",
        autoClose: 4000,
      });
    } catch (error) {
      console.error("Failed to cancel session:", error);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading your sessions...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>My Scheduled Sessions</h2>
      {sessions.length === 0 ? (
        <p className={styles.noSessions}>No sessions scheduled yet.</p>
      ) : (
        <div className={styles.grid}>
          {sessions.map((session) => (
            <div key={session.id} className={styles.card}>
              <img
                src={session.counselorImage}
                alt={session.counselorName}
                className={styles.image}
              />
              <h3>{session.counselorName}</h3>
              <p>
                <strong>Date:</strong> {session.date}
              </p>
              <p>
                <strong>Time:</strong> {session.time}
              </p>
              <p className={styles.specialty}>
                {session.counselorSpecialties?.join(", ") || "Not specified"}
              </p>
              <Link
                to={`/room/${session.id}`} // 🔥 Use session.id as the unique room
                state={{ userName: user.displayName || user.email }}
                className={styles.joinButton}
              >
                Join Session
              </Link>
              <button
                onClick={() => handleCancel(session.id)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
