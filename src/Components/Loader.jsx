import styles from './loader.module.css';
export default function Loader(){
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
        <h3>CalmConnect... making your student life better</h3>
      </div>
    );
}