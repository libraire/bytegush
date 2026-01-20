import styles from "./PhotoComponent.module.css";

type Props = {
  uploadPhoto: () => void;
  deletePhoto: () => void;
};

const PerformComponent: React.FC<Props> = ({ uploadPhoto, deletePhoto }) => {
  return (
    <div className={styles.performBoard}>
      <button
        style={{ mixBlendMode: "normal" }}
        className={styles.uploadButton}
        onClick={() => uploadPhoto()}
      >
        <p style={{mixBlendMode:"normal"}}>UPLOAD</p>
      </button>
      <button className={styles.deleteButton} onClick={() => deletePhoto()}>
        DELETE
      </button>
    </div>
  );
};

export default PerformComponent;
