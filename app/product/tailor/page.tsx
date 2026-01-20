"use client"
import Price from '@/app/components/price';
import Review from '@/app/components/review';
import Image from "next/image";
import Introduction, { IntroductionProps } from '@/app/components/introduction';
import React, { useState, useEffect } from "react";

const props: IntroductionProps = {
  name: "Tailor",
  icon: "/tailor/tailor.png",
  description: "Tailor is a MacOS screenshot app that automatically detects rectangle edges and allows you to copy them with just one click. Or open with Preview for further selection and editing.",
  features: [
    "Capture. Capture the whole screen and detect rectangles. Turn to selection mode if no rectangles detected.",
    "Selection. Select a rectangle manually.",
    "Preview Rectangle. Open the largest rectangle with MacOS Preview app for editing.",
    "Preview Screen. Open the whole screen with Preview app."
  ],
  download_url: "https://github.com/libraire/Tailor/releases/download/1.2.0/Tailor.dmg",
  info: [
    {
      name: 'Requires',
      info: 'macOS 14.1',
    },
    {
      name: 'Size',
      info: '2.33 MB',
    },
    {
      name: 'Downloads',
      info: '-'
    }
  ],
  download_number: 0,
};


const ProductsPage = () => {

  const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
  const [url, setDownload] = useState<number>(1);
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const u = token != "" ? '/profile' : '/signin';
    fetch(API_HOST + "/api/v1/app/Tailor").then(response => {
      return response.json()
    }).then(res => {
      setDownload(res.data.download)
      for (let index = 0; index < props.info.length; index++) {
        const element = props.info[index];
        if (element.name === "Downloads") {
          element.info = res.data.download
        }
      }
    });

  })

  return (

    <>
      <div className='w-full flex justify-center items-center bg-white'>
        <div className='max-w-screen-lg flex-col justify-center items-center'>
          <Image
            src="/tailor/screenshot1.png"
            alt="Vercel Logo"
            className="w-full"
            width={800}
            height={400}
            priority
          />
          <div className='flex'>
            <Introduction {...props}></Introduction>
            <Price {...props}></Price>
          </div>
          <Review />
        </div>
      </div>
    </>
  )
  return
};

export default ProductsPage;