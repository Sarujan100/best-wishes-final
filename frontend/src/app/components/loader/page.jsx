'use client';

import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <span className={styles.loadingText}>Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
