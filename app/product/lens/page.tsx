"use client";
import React, { useState, useEffect } from "react";
import HomeGalleryComponent from "./components/HomeGalleryComponent"
import { GalleryUser } from "./components/types";
import styles from "./components/PhotoComponent.module.css";

const LensTitle: React.FC = ({ }) => {

  const [url, setURL] = useState<string>('/signin');
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const u = token != "" ? '/profile' : '/signin';
    setURL(u)
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", position: "fixed", width: "100%", background: "rgb(0 0 0 / 40%)", padding: "40px" }}>
      <div className={styles.subTitle}>What you see, what you think, and what you take.</div>
    </div>
  );
};

const Gallery: React.FC<{ name: string }> = ({ name }) => {
  const [data, setData] = useState<GalleryUser[]>();
  const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

  function shuffleList(list: GalleryUser[]) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  useEffect(() => {
    // Fetch data here and update the state
    const fetchData = async () => {
      try {
        const response = await fetch(API_HOST + "/api/v1/gallery");
        const jsonData = await response.json();
        setData(shuffleList(jsonData.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (data === undefined) {
      fetchData();
    }
  }, []);

  return (
    <div
      className={styles.container}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "999999px",
        alignItems: "center"
      }}
    >
      <LensTitle />
      <HomeGalleryComponent items={data} />
    </div>
  );
};

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between bg-black">
        <Gallery name='' />
      </main>
    </>
  )
}
