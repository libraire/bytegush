import Image from "next/image";
import { imageLoader } from "./utils";
import { GalleryUser } from "./types";
import Link from "next/link";
import styles from "./PhotoComponent.module.css";

interface Props {
  user: GalleryUser;
}

const AvatarImageComponent: React.FC<Props> = ({ user }) => {
  return (
    <div className={styles.userAvatar}>
      <Link href={"/user/" + user.name}>
        <Image
          loader={imageLoader}
          src={user.avatar}
          alt={user.caption ?? "Avatar"}
          width={50}
          height={50}
          sizes="100vw"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            borderWidth: 2,
            marginRight: 10,
          }}
          priority
        />
      </Link>
      <div>{user.caption}</div>
    </div>
  );
};

const PhotoComponent: React.FC<Props> = ({ user }) => {
  return (
    <div className={styles.homePhotography}>
      <Image
        loader={imageLoader}
        src={user.imgurl}
        alt={user.title ?? "Photo"}
        width={0}
        height={0}
        // sizes="100vw"
        style={{ width: "100%", maxHeight: "50vh" }}
        priority
      />

      <AvatarImageComponent user={user} />
    </div>
  );
};

const HomeGalleryComponent: React.FC<{ items: GalleryUser[] | undefined }> = ({
  items,
}) => {
  return (
    <div className={styles.newHomeGallery}>
      {items?.map((item, index) => (
        <Link key={index} href={"/user/" + item.name} style={{ display: "flex", flexGrow: 1 }}>
          <Image
            loader={imageLoader}
            src={item.imgurl}
            alt={item.title ?? "Photo"}
            width={0}
            height={0}
            style={{
              width: "200px",
              height: "200px",
              flexGrow: 1,
              objectFit: "cover",
            }}
            priority
          />
        </Link>
      ))}
    </div>
  );
};

export default HomeGalleryComponent;
