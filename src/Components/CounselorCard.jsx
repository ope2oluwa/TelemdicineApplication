import React from "react";
import styles from "./counselorcard.module.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const CounselorCard = ({ counselor }) => {
  const { id, name, specialties = [], description, image } = counselor;

  return (
    <div className={styles.card}>
      <img
        src={image || "https://via.placeholder.com/150"}
        alt={name}
        className={styles.image}
      />
      <div className={styles.cardContent}>
        <h3 className={styles.name}>{name}</h3>

        <div className={styles.tags}>
          {specialties.map((tag, index) => {
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            return (
              <span
                key={index}
                className={`${styles.tag} ${
                  capitalizedTag === "Anxiety"
                    ? styles.anxiety
                    : capitalizedTag === "Stress"
                    ? styles.stress
                    : capitalizedTag === "Depression"
                    ? styles.depression
                    : capitalizedTag === "Sleep"
                    ? styles.sleep
                    : ""
                }`}
              >
                {capitalizedTag}
              </span>
            );
          })}
        </div>

        <p className={styles.description}>{description}</p>
        <Link to={`/schedule-session/${id}`} className={styles.button}>
          <FaCalendarAlt /> Schedule Session
        </Link>
      </div>
    </div>
  );
};

export default CounselorCard;
