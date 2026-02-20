import styles from './Loading.module.css';


export const Loading = () => {
  return (
    <div
      className={styles.main_root}
    >
      <div>
        <img
          className={styles.loading_spinner}
          alt="loading gif"
          src="src/assets/loading-spinner.gif"
        />
      </div>

      <div
        className={styles.loading_text}
      >
        Loading...
      </div>
    </div>
  )
}
