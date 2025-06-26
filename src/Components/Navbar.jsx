import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Menu, X, User } from "lucide-react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import styles from "./navbar.module.css";

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role); // "student" or "counselor"
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Brain className={styles.icon} /> CalmConnect
        </Link>

        <ul className={styles.navlinks}>
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* Show AI Chat only if not counselor */}
          {role !== "counselor" && (
            <li>
              <Link to="/ai-chat">AI Chat</Link>
            </li>
          )}

          {/* Students only: show Counselor list */}
          {role !== "counselor" && (
            <li>
              <Link to="/counselors">Counselors</Link>
            </li>
          )}

          {/* Show sessions to both roles */}
          <li>
            <Link to="/my-sessions">Sessions</Link>
          </li>

          {/* Students only: show Resources */}
          {role !== "counselor" && (
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          )}
        </ul>

        {user ? (
          <>
            <span className={styles.greeting}>
              Hi, {user.displayName || user.email}
            </span>
            <Link to="/profile" className={styles.signupbtn}>
              <User className={styles.usericon} />
              Profile
            </Link>
            <Link
              to="/login"
              onClick={handleLogout}
              className={styles.signupbtn}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link to="/signup" className={styles.signupbtn}>
            <User className={styles.usericon} />
            Sign Up
          </Link>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className={styles.menubtn}>
          {isOpen ? (
            <X className={styles.menuicon} />
          ) : (
            <Menu className={styles.menuicon} />
          )}
        </button>
      </div>

      {isOpen && (
        <ul className={styles.mobile_menu}>
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* Show AI Chat only if not counselor */}
          {role !== "counselor" && (
            <li>
              <Link to="/ai-chat">AI Chat</Link>
            </li>
          )}

          {role !== "counselor" && (
            <li>
              <Link to="/counselors">Counselors</Link>
            </li>
          )}
          <li>
            <Link to="/my-sessions">Sessions</Link>
          </li>

          {role !== "counselor" && (
            <li>
              <Link to="/resources">Resources</Link>
            </li>
          )}

          {user ? (
            <Link onClick={handleLogout} className={styles.mobile_signup_btn}>
              <User className={styles.usericon} />
              Logout
            </Link>
          ) : (
            <Link to="/signup" className={styles.mobile_signup_btn}>
              <User className={styles.usericon} />
              Sign Up
            </Link>
          )}
        </ul>
      )}
    </nav>
  );
}
