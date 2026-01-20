import PhotoComponent from "./PhotoComponent";
import { Photo } from "./types"
import styles from "./PhotoComponent.module.css"


const GalleryComponent: React.FC<{ items: Photo[] | undefined }> = ({
  items,
}) => {
  return (
    <div className={styles.gallery}>
      {items?.map((item, index) => (
        <PhotoComponent
          key={index}
          title={item.title}
          imgurl={item.imgurl}
          position={item.position}
        />
      ))}
    </div>
  );
};

export default GalleryComponent;