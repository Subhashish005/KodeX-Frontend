
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({
  name,
  language,
  createdAt,
  modifiedAt,
  id,
  openProject,
  deleteProject
}) => {
  let displayName = name;

  if(name.length > 60) {
    displayName = name.substring(0, 60) + "...";
  }

  return (
    <div className={styles.project_card}>
      <h2 className={styles.project_name} title={name}>
        {displayName}
      </h2>

      <div className={styles.project_desc}>
        <div className={styles.desc_item}>
          <span>Language:</span>
          {language}
        </div>

        <div className={styles.desc_item}>
          <span>Created:</span>
          {createdAt}
        </div>
        <div className={styles.desc_item}>
          <span>Modified:</span>
          {modifiedAt}
        </div>
      </div>

      <div className={styles.btn_grp}>
        <button
          className={`${styles.btn} ${styles.btn_delete}`}
          onClick={() => deleteProject(id)}
        >
          Delete
        </button>

        <button className={`${styles.btn} ${styles.btn_open}`}>
          Open Project
        </button>
      </div>
    </div>
  );
}