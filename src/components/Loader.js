import styles from "../styles/loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loadingWave}>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
        <div className={styles.loadingBar}></div>
      </div>
    </div>
  );
};

export default Loader;
