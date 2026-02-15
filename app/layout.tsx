import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomAuthProvider } from "./context/CustomAuthProvider";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bytegush",
  description: "Indie developer site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomAuthProvider>
          <Navbar />
          <div className="pt-[64px]  min-h-screen">
            {children}
          </div>
        </CustomAuthProvider>
        <div className="grow-0 text-center text-gray-900 mb-4 mt-[-44px]">© 2024 Bytegush. All rights reserved.</div>
      </body>
    </html>
  );
}
