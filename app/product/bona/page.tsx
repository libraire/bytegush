"use client"
import Price from '@/app/components/price';
import Review from '@/app/components/review';
import Image from "next/image";
import Introduction, { IntroductionProps } from '@/app/components/introduction';
import Navbar from '@/app/components/navbar';
import React, { useState, useEffect } from "react";

const props: IntroductionProps = {
    name: "Bona",
    icon: "/bona/bona.png",
    description: "Bona is a macOS AI prompt app that resides in the menu bar, providing quick access to AI capabilities. Built-in templates help minimize redundant keywords, while history management allows users to easily revisit previously sought answers without needing to ask again.",
    features: [
        "Open route API now, more is comming",
        "Acceess to AI with shorcut key.",
        "Search history for quick reference.",
        "Managing templates for frequently asked questions.",
    ],
    download_url: "https://github.com/libraire/appstore/releases/download/bona-v1.0.0/Bona.dmg",
    info: [
        {
            name: 'Requires',
            info: 'macOS 14.0+',
        },
        {
            name: 'Requires',
            info: 'Open route key',
        },
        {
            name: 'Size',
            info: '2.69 MB',
        },
        {
            name: 'Downloads',
            info: '-'
        }
    ],
    download_number: 0,
    code_snippet: "# Set open route key first.\n:key <key>"
};

const ProductsPage = () => {

    const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
    const [downloadNumber, setDownload] = useState<number>(1);
    useEffect(() => {
        const token = localStorage.getItem("token") ?? "";
        const u = token != "" ? '/profile' : '/signin';
        fetch(API_HOST + "/api/v1/app/Bona").then(response => {
            return response.json()
        }).then(res => {
            setDownload(res.data.download)
            for (let index = 0; index < props.info.length; index++) {
                const element = props.info[index];
                if(element.name === "Downloads") {
                    console.log("set infxxxxo", res.data.download)
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
                        src="/bona/screenshot1.png"
                        alt="Vercel Logo"
                        className="w-full"
                        width={800}
                        height={400}
                        priority
                    />
                    <div className='flex'>
                        <Introduction {...props}></Introduction>
                        <Price download_url={props.download_url} info={props.info} name={props.name}  download_number={downloadNumber}></Price>
                    </div>
                    <Review />
                </div>
            </div>
        </>
    )
    return
};

export default ProductsPage;