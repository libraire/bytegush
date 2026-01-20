"use client"
import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Link from "next/link";
import collection from './indie/[...name]/collection';
import { useRouter } from 'next/navigation'
import { LucideIcon, Languages, Sparkles, Wrench, Puzzle, ExternalLink, FileText, PlayCircle } from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const featuredProducts = [
  {
    name: 'howtosay',
    description: 'Master the art of natural pronunciation. A minimal and powerful tool to help you speak any language with confidence.',
    icon: Languages,
    href: 'https://say.bytegush.com',
    color: 'bg-blue-500',
    shadow: 'shadow-blue-200',
  },
  {
    name: 'Bona',
    description: 'The elegant digital workspace. Streamline your productivity and elevate your daily workflow with thoughtful design.',
    icon: Sparkles,
    href: 'https://www.bytegush.com/product/bona',
    color: 'bg-indigo-500',
    shadow: 'shadow-indigo-200',
  },
  {
    name: 'Woop',
    description: 'The essential Swiss Army knife for developers. A curated suite of high-performance tools to accelerate your building process.',
    icon: Wrench,
    href: 'https://woop.bytegush.com',
    color: 'bg-teal-500',
    shadow: 'shadow-teal-200',
  },
  {
    name: 'PDF Reader',
    description: 'Transform how you read and learn. A web-based PDF viewer enhanced with an AI sidebar for deep document insights.',
    icon: FileText,
    href: 'https://app.bytegush.com/pdf',
    color: 'bg-orange-500',
    shadow: 'shadow-orange-200',
  },
  {
    name: 'AI Player',
    description: 'The intelligent media player for learners. Master new languages with real-time AI assistance and contextual sidebars.',
    icon: PlayCircle,
    href: 'https://app.bytegush.com/player',
    color: 'bg-rose-500',
    shadow: 'shadow-rose-200',
  },
  {
    name: 'Focus AI',
    description: 'Uninterrupted intelligence for Gemini. Ask questions and get AI insights without switching tabs or losing your place.',
    icon: Puzzle,
    href: '#',
    color: 'bg-gray-400',
    shadow: 'shadow-gray-200',
    isComingSoon: true,
  },
]

const items = collection.map((item) => {
  const newItem = { ...item };
  newItem.rows = item.rows.slice(0, 3)
  newItem.rows.push({ name: "View More", herf: "/indie/" + item.key })
  return newItem
})

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fcfcfd] selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
        {/* Hero Section */}
        {/* <header className="text-center mb-24 animate-slide-up">
          <h1 className="text-7xl font-bold tracking-tight text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Bytegush
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Crafting beautiful digital experiences. Discover our suite of tools designed to empower your creativity and productivity.
          </p>
        </header> */}

        {/* Featured Products Grid */}
        <section className="mb-32 animate-slide-up animate-delayed-1">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <div className="h-px flex-1 bg-gray-100 mx-8 hidden sm:block"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.name}
                className={classNames(
                  "group relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1",
                  product.isComingSoon ? "opacity-75" : ""
                )}
              >
                <div className={classNames(
                  "p-4 rounded-2xl w-fit mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                  product.color,
                  "bg-opacity-10"
                )}>
                  <product.icon className={classNames("h-8 w-8", `text-gray-900`)} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.isComingSoon ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Coming Soon
                  </span>
                ) : (
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-gray-900 hover:gap-x-2 transition-all"
                  >
                    Visit Site <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Collection Section */}
        <section className="animate-slide-up animate-delayed-2">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Explore Collection</h2>
            <div className="h-px flex-1 bg-gray-100 mx-8 hidden sm:block"></div>
          </div>
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((client) => (
              <li key={client.id} className="group overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-x-4 border-b border-gray-50 bg-gray-50/50 p-6">
                  <div className="h-10 w-10 flex justify-center items-center text-xl rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
                    {client.emoji}
                  </div>
                  <div className="text-sm font-bold text-gray-900">{client.name}</div>
                  <div className="flex-1"></div>
                  <Link href={`/indie/${client.key}`} className="text-gray-400 hover:text-gray-600">
                    <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50 px-6 py-2">
                  {client.rows.map((row) => (
                    <a
                      key={row.name}
                      href={row.herf}
                      className="flex justify-between items-center py-4 group/item hover:translate-x-1 transition-transform"
                    >
                      <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors">
                        {row.name}
                      </span>
                      {row.name !== "View More" ? (
                        <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover/item:text-gray-500 transition-colors" />
                      ) : (
                        <ChevronUpDownIcon className="h-4 w-4 text-indigo-400" />
                      )}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

