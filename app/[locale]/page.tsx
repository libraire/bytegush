import ProductParallaxShowcase from '@/app/components/home/ProductParallaxShowcase';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="w-full bg-[#080B14] min-h-screen">
      <ProductParallaxShowcase />
    </main>
  );
}
