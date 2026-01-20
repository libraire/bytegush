import { User } from "./types";
import Image from "next/image";
import React, { useState,useEffect } from "react";
import { imageLoader } from "./utils";
import styles from "./PhotoComponent.module.css"

const AvatarComponent: React.FC<{ user: User | undefined }> = ({ user }) => {

  const [imageSrc, setImageSrc] = useState("/user.png");

  useEffect(() => {
    setImageSrc(user?.avatar || '');
  }, [user?.avatar]);

  return (
    <div className={styles.userContainer}>
      <div className={styles.user}>
        <Image
          loader={imageLoader}
          src={imageSrc ?? ""}
          onError={() => setImageSrc("/user.png")}
          alt={user?.name ?? "Avatar"}
          width={200}
          height={200}
          priority
        />
        <div className="artis-caption">
          <h1>{user?.name}</h1>
          <p>{user?.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default AvatarComponent;
