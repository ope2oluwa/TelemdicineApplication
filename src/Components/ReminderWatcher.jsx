import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const ReminderWatcher = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const checkForReminders = async () => {
      try {
        const q = query(
          collection(db, "sessions"),
          where("studentEmail", "==", user.email)
        );
        const snapshot = await getDocs(q);
        const now = new Date();

        snapshot.forEach((doc) => {
          const session = doc.data();
          const sessionDateTime = new Date(`${session.date}T${session.time}`);
          const timeDiff = sessionDateTime - now;

          if (timeDiff > 0 && timeDiff < 60000) {
            toast.info(
              `🔔 It's time for your session with ${session.counselorName}`,
              {
                position: "top-right",
                autoClose: 10000,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        });
      } catch (err) {
        console.error("Error checking reminders:", err);
      }
    };

    const interval = setInterval(checkForReminders, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  return null; // no UI
};

export default ReminderWatcher;
