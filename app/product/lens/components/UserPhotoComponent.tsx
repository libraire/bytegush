"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Photo} from "./types";
import { imageLoader, generateSVG } from "./utils";
import style from "./PhotoComponent.module.css"

const PhotoComponent: React.FC<Photo> = ({ title, imgurl, position }) => {
  const [imageSrc, setImageSrc] = useState(imgurl);


  return (
      <div className={[style.photography,style.userPhotography].join(" ")}>
        <Image
          alt={title ?? "Photo"}
          loader={imageLoader}
          onError={() => setImageSrc(generateSVG(position))}
          className={ style.photoImage}
          src={imageSrc}
          style={{ width: "100%", height:"100%", objectFit: "cover" }}
          width={200} 
          height={200}
          objectFit="cover"
          priority
        />
      </div>
  );
};

export default PhotoComponent;
