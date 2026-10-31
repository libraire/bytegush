import type { Metadata } from "next";
import "@/app/globals.css";
import { CustomAuthProvider } from "@/app/context/CustomAuthProvider";
import Navbar from "@/app/components/navbar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Bytegush · 发现有价值的数字工具与实操工作流",
  description: "精选前沿优质生产力工具，输出真实客观的深度评测、场景化工作流教学与独立自研软件。",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="antialiased bg-[#080B14] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 font-sans min-h-screen flex flex-col justify-between">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomAuthProvider>
            <Navbar />
            <main className="pt-[64px] flex-grow">
              {children}
            </main>
          </CustomAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
