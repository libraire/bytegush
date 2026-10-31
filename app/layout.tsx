import type { Metadata } from "next";
import "./globals.css";
import { CustomAuthProvider } from "./context/CustomAuthProvider";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Bytegush · 发现有价值的数字工具与实操工作流",
  description: "精选前沿优质生产力工具，输出真实客观的深度评测、场景化工作流教学与独立自研软件。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="antialiased bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 font-sans min-h-screen flex flex-col justify-between">
        <CustomAuthProvider>
          <Navbar />
          <main className="pt-[64px] flex-grow">
            {children}
          </main>
        </CustomAuthProvider>
      </body>
    </html>
  );
}
