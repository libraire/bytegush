"use client"
import { useState } from 'react'
import { Search, Heart, MessageCircle, Share2, PlayCircle } from 'lucide-react'

const archiveData = [
    {
        month: "JANUARY 2026",
        articles: [
            {
                id: 1,
                title: "Mastering the Art of Digital Minimalism in 2026",
                description: "How to stay focused in an era of constant AI-driven distractions and notifications.",
                date: "JAN 15, 2026",
                author: "ALFONSO PECCATIELLO",
                likes: 124,
                comments: 18,
                image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60",
                type: "post"
            },
            {
                id: 2,
                title: "The Future of AI-First Applications",
                description: "Why the next generation of software won't just 'include' AI, but will be built around it from day one.",
                date: "JAN 10, 2026",
                author: "ALFONSO PECCATIELLO",
                likes: 89,
                comments: 12,
                audio: "15:20",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
                type: "podcast"
            }
        ]
    },
    {
        month: "DECEMBER 2025",
        articles: [
            {
                id: 3,
                title: "Why We Built Bytegush: Our Journey Thus Far",
                description: "A deep dive into the philosophy behind our suite of tools and what we hope to achieve.",
                date: "DEC 28, 2025",
                author: "ALFONSO PECCATIELLO",
                likes: 210,
                comments: 45,
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
                type: "post"
            },
            {
                id: 4,
                title: "Productivity Systems that Actually Work",
                description: "Moving beyond To-Do lists into systems that drive real impact and satisfaction.",
                date: "DEC 20, 2025",
                author: "ALFONSO PECCATIELLO",
                likes: 156,
                comments: 24,
                image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60",
                type: "post"
            }
        ]
    }
]

export default function ArchivePage() {
    const [activeTab, setActiveTab] = useState('Latest')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="min-h-screen bg-white selection:bg-orange-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                {/* Tabs & Search */}
                <div className="flex items-center justify-between border-b border-gray-100 mb-12">
                    <div className="flex space-x-8">
                        {['Latest', 'Top', 'Discussions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="pb-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Search Input (Conditional or persistent) */}
                {/* <div className="mb-8">...</div> */}

                {/* Article List */}
                <div className="space-y-16">
                    {archiveData.map((section) => (
                        <div key={section.month}>
                            <h2 className="text-xs font-bold tracking-widest text-orange-600 mb-8">
                                {section.month}
                            </h2>
                            <div className="space-y-12">
                                {section.articles.map((article) => (
                                    <article key={article.id} className="group relative flex flex-col md:flex-row gap-8 items-start pb-12 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                                                    <a href="#">{article.title}</a>
                                                </h3>
                                                <p className="text-gray-500 line-clamp-2 text-[17px] leading-relaxed font-sans">
                                                    {article.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-2 text-[13px] font-medium text-gray-400 uppercase tracking-wide">
                                                <span>{article.date}</span>
                                                <span>•</span>
                                                <span>{article.author}</span>
                                            </div>

                                            <div className="flex items-center space-x-6 pt-2">
                                                <button className="flex items-center space-x-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Heart className="h-4 w-4" />
                                                    <span className="text-sm">{article.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                                    <MessageCircle className="h-4 w-4" />
                                                    <span className="text-sm">{article.comments}</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-40 flex-shrink-0">
                                            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 relative group-hover:opacity-90 transition-opacity">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {article.audio && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <div className="bg-white/90 p-2 rounded-full shadow-lg flex items-center space-x-1 pr-3">
                                                            <PlayCircle className="h-5 w-5 text-orange-600" />
                                                            <span className="text-[11px] font-bold text-gray-900 tracking-tight">{article.audio}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        {/* <div className="absolute -bottom-8 left-0 right-0 h-px bg-gray-50" /> */}
                                    </article>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
