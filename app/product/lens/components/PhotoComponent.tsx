"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Photo, ImageKitToken } from "./types";
import { imageLoader, generateSVG } from "./utils";
// import ImageKit from "imagekit-javascript";
import styles from "./PhotoComponent.module.css";
import PerformBoard from "./PerformComponent";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhotoComponent: React.FC<Photo> = ({ title, imgurl, position }) => {
  const [imageSrc, setImageSrc] = useState(imgurl);
  const [key, setKey] = useState(0);

  // function handleImageClick(position: number) {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.id = position.toString();
  //   input.addEventListener("change", handleFileSelect);
  //   input.click();
  // }

  // const handleFileSelect = (event: Event) => {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement && inputElement.files && inputElement.files.length > 0) {
  //     const file: File = inputElement.files[0];
  //     uploadPromise(file, inputElement.id);
  //   }
  // };

  // const uploadPromise = async (imageFile: File, position: string) => {
  //   const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
  //   const token = localStorage.getItem("token") ?? "";

  //   const promise = new Promise((resolve, reject) => {
  //     fetch(API_HOST + "/api/v1/img/token", {
  //       method: "GET",
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((resp) => {
  //         return resp.json();
  //       })
  //       .then((ikt: ImageKitToken) => {
  //         var imagekit = new ImageKit({
  //           publicKey: "public_Z/WgC0eFOh+2k7FK1gk1VmxPZzs=",
  //           urlEndpoint: "https://ik.imagekit.io/fm0mlm91hf",
  //         });

  //         return imagekit.upload({
  //           file: imageFile,
  //           fileName: imageFile.name,
  //           token: ikt.token,
  //           signature: ikt.signature,
  //           expire: ikt.expires,
  //           tags: [ikt.tag],
  //           extensions: [
  //             {
  //               name: "aws-auto-tagging",
  //               minConfidence: 80,
  //               maxTags: 10,
  //             },
  //           ],
  //         });
  //       })
  //       .then((resp) => {
  //         return fetch(API_HOST + "/api/v1/photo", {
  //           method: "PUT",
  //           headers: {
  //             Authorization: token,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             position: parseInt(position),
  //             imgurl: resp.url,
  //           }),
  //         });
  //       })
  //       .then((resp) => {
  //         if (resp.ok) {
  //           const reader: FileReader = new FileReader();
  //           reader.onload = (event) => {
  //             const newImageSrc: string = event.target!.result as string;
  //             setImageSrc(newImageSrc);
  //             setKey((prevKey) => prevKey + 1);
  //           };
  //           reader.readAsDataURL(imageFile);
  //           resolve("success");
  //         } else {
  //           reject(new Error("Upload failed."));
  //         }
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });

  //   await toast.promise(
  //     promise,
  //     {
  //       pending: "Uploading...",
  //       success: "Succeed!",
  //       error: "Failed! Please retry later!",
  //     },
  //     {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 1500,
  //     }
  //   );
  // };

  // const deletePromise = async (position: number) => {
  //   const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
  //   const token = localStorage.getItem("token") ?? "";

  //   const promise = new Promise((resolve, reject) => {
  //     fetch(API_HOST + "/api/v1/photo", {
  //       method: "PUT",
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         position: position,
  //         imgurl: "",
  //       }),
  //     })
  //       .then((resp) => {
  //         setImageSrc(generateSVG(position));
  //         setKey((prevKey) => prevKey + 1);
  //         resolve(resp.json());
  //       })
  //       .then((error) => {
  //         reject(error);
  //       });
  //   });

  //   await toast.promise(
  //     promise,
  //     {
  //       pending: "Deleting...",
  //       success: "Deleted!",
  //       error: "Failed! Please retry later!",
  //     },
  //     {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 1500,
  //     }
  //   );
  // };


  // function handleDelete() {
  //   const confirmed = window.confirm('Are you sure to delete?');
  //   if (confirmed) {
  //     deletePromise(position)
  //   }
  // }
  

  return (
    <div className={[styles.photography, styles.imageContainer].join(" ")}>
      <Image
        key={key}
        alt={title ?? "Photo"}
        loader={imageLoader}
        onError={() => setImageSrc(generateSVG(position))}
        className={styles.photoImage}
        src={imageSrc}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        width={0}
        height={0}
        priority
      />

      {/* <PerformBoard
        uploadPhoto={() => handleImageClick(position)}
        deletePhoto={() => handleDelete()}
      />
      <ToastContainer /> */}
    </div>
  );
};

export default PhotoComponent;
