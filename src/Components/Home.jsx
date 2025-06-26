import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Video,
  Calendar,
  ArrowRight,
} from "lucide-react";
import styles from "./home.module.css";
export default function Home() {
  return (
    <div className={styles.homepageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Supporting Your Mental Wellbeing Journey</h1>
          <p>
            Connect with AI support, professional counselors to
            navigate stress, anxiety, depression, and sleep challenges.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/ai-chat" className={`${styles.btn} ${styles.primaryBtn}`}>
              Start Chatting <ArrowRight className={styles.btnIcon} />
            </Link>
            <Link
              to="/resources"
              className={`${styles.btn} ${styles.secondaryBtn}`}
            >
              Explore Resources
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1000&q=80"
            alt="Students supporting each other"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.supportSection}>
        <div className={styles.supportContent}>
          <h2>How We Support You</h2>
          <div className={styles.supportGrid}>
            <div className={styles.supportItem}>
              <div className={`${styles.supportIcon} ${styles.aiSupport}`}>
                <MessageSquare className={styles.icon} />
              </div>
              <h3>AI Chat Support</h3>
              <p>
                24/7 AI-powered chat assistance for immediate support and
                guidance.
              </p>
            </div>
            <div className={styles.supportItem}>
              <div
                className={`${styles.supportIcon} ${styles.counselorSupport}`}
              >
                <Calendar className={styles.icon} />
              </div>
              <h3>Counselor Sessions</h3>
              <p>
                Connect with counselors for personalized guidance
                and support.
              </p>
            </div>
            <div className={styles.supportItem}>
              <div
                className={`${styles.supportIcon} ${styles.educationSupport}`}
              >
                <Video className={styles.icon} />
              </div>
              <h3>Educational Resources</h3>
              <p>
                Access videos, articles, and exercises to build mental health
                skills.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

