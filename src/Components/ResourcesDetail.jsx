/* import React from "react";
import styles from "./resourcesdetail.module.css";
import { Link, useParams } from "react-router-dom";
import {ArrowLeftIcon} from "lucide-react";
import { resourceData } from "../data/resourceData.js";

const ResourceDetail = () => {
  const { id } = useParams();
  const resource = resourceData.find((item) => item.id === id);

  if (!resource) return <p>Resource not found.</p>;

  return (
    <div className={styles.container}>
      <Link to="/resources" className={styles.backLink}>
        <ArrowLeftIcon size={13} /> Back to Resources
      </Link>
      <h1 className={styles.title}>{resource.title}</h1>
      <span className={styles.categoryTag}>{resource.category}</span>

      {resource.type === "Video" || resource.type=== "Exercise" ? (
        <iframe
          src={resource.link}
          className={styles.videoFrame}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={resource.title}
        />
      ) : (
        <>
          <img
            src={resource.image}
            alt={resource.title}
            className={styles.image}
          />
          <div className={styles.content}>
            <p>{resource.description}</p>
            <p>
              You can read the full article{" "}
              <a href={resource.link} target="_blank" rel="noreferrer">
                here
              </a>
              .
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceDetail; */

import React from "react";
import styles from "./resourcesdetail.module.css";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { resourceData } from "../data/resourceData.js";

const ResourceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const resource = resourceData.find((item) => item.id === id);

  if (!resource) return <p>Resource not found.</p>;

  return (
    <div className={styles.container}>
      <Link
        to={{
          pathname: "/resources",
          state: location.state, // Pass the state back to the resources page
        }}
        className={styles.backLink}
      >
        <ArrowLeftIcon size={13} /> Back to Resources
      </Link>
      <h1 className={styles.title}>{resource.title}</h1>
      <span className={styles.categoryTag}>{resource.category}</span>

      {resource.type === "Video" || resource.type === "Exercise" ? (
        <iframe
          src={resource.link}
          className={styles.videoFrame}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={resource.title}
        />
      ) : (
        <>
          <img
            src={resource.image}
            alt={resource.title}
            className={styles.image}
          />
          <div className={styles.content}>
            <p>{resource.description}</p>
            <p>
              You can read the full article{" "}
              <a href={resource.link} target="_blank" rel="noreferrer">
                here
              </a>
              .
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceDetail;

