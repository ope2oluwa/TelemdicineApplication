import React from "react";
import { Heart, Mail, Phone } from "lucide-react";
import styles from "./footer.module.css"
export default function Footer() {
  return (

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.section}>
              <h3 className={styles.heading}>CalmConnect</h3>
              <p className={styles.text}>
                Supporting university students' mental health through technology
                and community.
              </p>
              <div className={styles.iconText}>
                <span className={styles.heartIcon}><Heart/></span>
                <span>Made with care for students</span>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.heading}>Quick Links</h3>
              <ul className={styles.linkList}>
                <li>
                  <a href="/" className={styles.link}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/ai-chat" className={styles.link}>
                    AI Chat
                  </a>
                </li>
                <li>
                  <a href="/counselors" className={styles.link}>
                    Counselors
                  </a>
                </li>
                <li>
                  <a href="/my-sessions" className={styles.link}>
                    Sessions
                  </a>
                </li>
                <li>
                  <a href="/resources" className={styles.link}>
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.heading}>Contact</h3>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Mail/>{" "}
                  <a href="oluwatimilehinopeoluwa@gmail.com" className={styles.link}>
                    oluwatimilehinopeoluwa@gmail.com
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <Phone/>{" "}
                  <a href="tel:+08110770438" className={styles.link}>
                    + 234 811-077-0438
                  </a>
                </div>
              </div>
              <div className={styles.emergency}>
                <p>In case of emergency, please call the campus crisis line:</p>
                <span className={styles.importantText}>1-800-CRISIS-HELP</span>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>
              &copy; {new Date().getFullYear()} CalmConnect. All rights reserved.<br/> Made with 💖 by TimiMikes
            </p>
          </div>
        </div>
      </footer>
  );
}
