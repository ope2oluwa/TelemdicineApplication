import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resourceData } from "../data/resourceData";
import { SquareArrowOutUpRight, VideoIcon } from "lucide-react";
import styles from "./resources.module.css";

const categories = ["All", "Stress", "Anxiety", "Depression", "Sleep"];
const types = ["All", "Video", "Article", "Exercise"];

export default function ResourcesPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(
    location.state?.searchTerm || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.selectedCategory || "All"
  );
  const [selectedType, setSelectedType] = useState(
    location.state?.selectedType || "All"
  );
  /*  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
 */
  const filteredResources = resourceData.filter((res) => {
    const matchSearch = res.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" || res.category === selectedCategory;
    const matchType = selectedType === "All" || res.type === selectedType;
    return matchSearch && matchCategory && matchType;
  });

  return (
    <div className={styles.container}>
      <div className={styles.containerHeading}>
        <h1>Mental Health Resources</h1>
        <p>
          Explore videos, articles, and exercises to help you understand and
          manage your mental health.
        </p>
      </div>
      <div className={styles.containerFirstDiv}>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.filters}>
          <div>
            <p>Filter by Category</p>
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? styles.active : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <p>Filter by Type</p>
            {types.map((type) => (
              <button
                key={type}
                className={selectedType === type ? styles.active : ""}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {filteredResources.map((res) => (
          <div key={res.id} className={styles.card}>
            <img src={res.image} alt={res.title} />
            <span className={styles.tag}>{res.category}</span>
            <p className={styles.type}>{res.type}</p>
            <h3>{res.title}</h3>
            <p>{res.description}</p>
            {/* <Link to={`/resources/${res.id}`} className={styles.link}>
              {res.type === "Video" ? "Watch Video" : res.type==="Exercise" ? "Try Exercise": "Read Article"}{" "}
              <SquareArrowOutUpRight  size={13}/>
            </Link> */}
            <Link
              to={{
                pathname: `/resources/${res.id}`,
                state: {
                  searchTerm,
                  selectedCategory,
                  selectedType,
                },
              }}
              className={styles.link}
            >
              {res.type === "Video"
                ? "Watch Video"
                : res.type === "Exercise"
                ? "Try Exercise"
                : "Read Article"}{" "}
              <SquareArrowOutUpRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
