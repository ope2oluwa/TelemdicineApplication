import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import CounselorCard from "./CounselorCard";
import styles from "./counselors.module.css";

const CounselorsPage = () => {
  const [counselors, setCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const specialtyOptions = [
    { label: "Stress", value: "Stress" },
    { label: "Anxiety", value: "Anxiety" },
    { label: "Depression", value: "Depression" },
    { label: "Sleep", value: "Sleep" },
  ];

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "counselors"));
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCounselors(list);
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };

    fetchCounselors();
  }, []);

  const filteredCounselors = counselors.filter((counselor) => {
    const nameMatch = counselor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const specialtyMatch =
      selectedSpecialty === "" ||
      counselor.specialties?.some((spec) =>
        spec.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    return nameMatch && specialtyMatch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.containerHeading}>
        <h1>Connect with Professional Counselors</h1>
        <p>
          Schedule sessions with experienced mental health professionals
          specialized in student support.
        </p>
      </div>

      <div className={styles.containerFirstDiv}>
        <input
          type="text"
          placeholder="Search by name or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.SpecializeDiv}>
          <Dropdown
            value={selectedSpecialty}
            options={specialtyOptions}
            onChange={(e) => setSelectedSpecialty(e.value)}
            placeholder="All Specializations"
            className={styles.Dropdown}
          />
        </div>
      </div>
      <div className={styles.cardsGrid}>
        {filteredCounselors.length > 0 ? (
          filteredCounselors.map((counselor) => (
            <CounselorCard key={counselor.id} counselor={counselor} />
          ))
        ) : (
          <p className={styles.noResults}>
            No counselors found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default CounselorsPage;
