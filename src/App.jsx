// App.jsx
import "./App.css";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import PrivateRoute from "./Components/Privateroute";
import RoleProtectedRoute from "./Components/RoleProtectedRoute";
import Loader from "./Components/Loader";
import EditProfile from "./Components/Editprofile";
import Chatbot from "./Components/Chatbot";
import ResourcesPage from "./Components/ResourcesPage";
import ResourcesDetail from "./Components/ResourcesDetail";
import CounselorsPage from "./Components/CounselorsPage";
import ScheduleSessionPage from "./Components/ScheduleSessionPage";
import VideoCallRoom from "./Components/VideoCallRoom";
import MySessions from "./Components/MySessions";
import ReminderWatcher from "./Components/ReminderWatcher";
import ChooseRole from "./Components/ChooseRole";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          console.warn("User document not found. Role not set.");
          setUserRole("student"); // fallback to avoid infinite loading
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading || (user && userRole === null)) {
    return <Loader />;
  }

  const userWithRole = user ? { ...user, role: userRole } : null;

  return (
    <div className="App">
      <Navbar user={userWithRole} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute user={userWithRole}>
              <Profile user={userWithRole} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute user={userWithRole}>
              <EditProfile />
            </PrivateRoute>
          }
        />

        {/* 👤 Students only */}
        <Route
          path="/ai-chat"
          element={
            <RoleProtectedRoute user={userWithRole} requiredRole="student">
              <Chatbot />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <RoleProtectedRoute user={userWithRole} requiredRole="student">
              <ResourcesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <RoleProtectedRoute user={userWithRole} requiredRole="student">
              <ResourcesDetail />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/counselors"
          element={
            <RoleProtectedRoute user={userWithRole} requiredRole="student">
              <CounselorsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/schedule-session/:id"
          element={
            <RoleProtectedRoute user={userWithRole} requiredRole="student">
              <ScheduleSessionPage />
            </RoleProtectedRoute>
          }
        />

        {/* Shared */}
        <Route
          path="/my-sessions"
          element={
            <PrivateRoute user={userWithRole}>
              <MySessions user={userWithRole} />
            </PrivateRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <PrivateRoute user={userWithRole}>
              <VideoCallRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/choose-role"
          element={
            <PrivateRoute user={userWithRole}>
              <ChooseRole />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
      <ReminderWatcher />
      <ToastContainer />
    </div>
  );
}

export default App;
