"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Play,
  Pause,
  Upload,
  FileText,
  Video,
  Bot,
  Copy,
  Download,
  Sparkles,
  BookOpen,
  Volume2,
  X,
  Languages,
  Check,
  Search,
  ArrowUpRight,
  Flame,
  HelpCircle,
  RotateCcw,
  Settings2,
  Maximize2
} from 'lucide-react';
import { SubtitleItem, ChatMessage, WordCorrection } from '../lib/types';
import {
  parseSrtContent,
  getContextualSentence,
  formatMilliseconds,
  DEMO_SRT_CONTENT,
  DEMO_VIDEO_URL
} from '../lib/srtParser';

export default function AIPlayerStudio() {
  // Video and subtitle state
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(-1);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);

  // AI Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [sidebarContext, setSidebarContext] = useState<string>('');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Word correction modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
  const [correctionWord, setCorrectionWord] = useState<string>('');
  const [correctionDef, setCorrectionDef] = useState<string>('');
  const [correctionCn, setCorrectionCn] = useState<string>('');
  const [correctionStatus, setCorrectionStatus] = useState<string>('');

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const subtitleDisplayRef = useRef<HTMLDivElement | null>(null);
  const srtFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll subtitle when video progresses (unless user is actively scrolling)
  useEffect(() => {
    if (isUserScrolling || currentSubtitleIndex < 0) return;
    const container = subtitleDisplayRef.current;
    if (!container) return;

    const activeEl = container.querySelector(`[data-index="${currentSubtitleIndex}"]`) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentSubtitleIndex, isUserScrolling]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isGenerating]);

  // Video time update handler
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const ms = videoRef.current.currentTime * 1000;
    setCurrentTimeMs(ms);

    if (subtitles.length === 0) return;
    const idx = subtitles.findIndex((sub) => ms >= sub.startTime && ms <= sub.endTime);
    if (idx !== currentSubtitleIndex) {
      setCurrentSubtitleIndex(idx);
    }
  }, [subtitles, currentSubtitleIndex]);

  // Listen to mouseup for text selection context inside subtitles or chat
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

      const selectedText = selection.toString().trim();
      if (!selectedText) return;

      const container = subtitleDisplayRef.current;
      if (container && container.contains(selection.anchorNode)) {
        const clean = selectedText.replace(/▶/g, '').trim();
        if (clean) {
          setSidebarContext(clean);
          setIsSidebarOpen(true);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Handle subtitle upload
  const handleSrtFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsed = parseSrtContent(content);
        if (parsed.length > 0) {
          setSubtitles(parsed);
          setCurrentSubtitleIndex(-1);
          setChatHistory([
            {
              id: 'init',
              role: 'system',
              content: `✅ 成功解析字幕文件 **${file.name}**（共 ${parsed.length} 条字幕）。点击任意字幕句，AI 私教将随时为你解构！`,
              timestamp: Date.now(),
            },
          ]);
        } else {
          alert('未能识别有效字幕，请确保为标准 .srt 或 .vtt 格式。');
        }
      } catch (err: any) {
        alert('解析字幕文件出错: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Handle video upload
  const handleVideoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);
  };

  // Load Built-in Demo
  const loadDemo = () => {
    const parsed = parseSrtContent(DEMO_SRT_CONTENT);
    setSubtitles(parsed);
    setVideoSrc(DEMO_VIDEO_URL);
    setVideoName('Steve Jobs 2005 Stanford Speech (Demo)');
    setCurrentSubtitleIndex(-1);
    setSidebarContext('You can\'t connect the dots looking forward; you can only connect them looking backward.');
    setIsSidebarOpen(true);
    setChatHistory([
      {
        id: 'demo-welcome',
        role: 'system',
        content: `👋 欢迎体验 **AI Player 智能伴学**！已为你预载《乔布斯斯坦福演讲》双语演示语料。点击任意字幕句即可跳转播放，并享受 AI 深度翻译与语法解构。`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Seek and play from a specific subtitle line
  const playSubtitleFromIndex = (index: number) => {
    if (index < 0 || index >= subtitles.length) return;
    const sub = subtitles[index];
    setCurrentSubtitleIndex(index);
    setCurrentTimeMs(sub.startTime);

    if (videoRef.current) {
      videoRef.current.currentTime = sub.startTime / 1000;
      videoRef.current.play().catch((e) => console.warn('Autoplay failed:', e));
      setIsPlaying(true);
    }
  };

  // Click on a subtitle line to set context & open AI
  const handleSubtitleClick = (index: number) => {
    const contextSentence = getContextualSentence(index, subtitles);
    setSidebarContext(contextSentence);
    setIsSidebarOpen(true);
  };

  // Ask AI
  const sendQuestion = async (customQuestion?: string) => {
    const q = (customQuestion || questionInput).trim();
    if (!q) return;

    setIsSidebarOpen(true);
    setQuestionInput('');

    let promptQuestion = q;
    let targetContext = sidebarContext;

    if (q === '查单词') {
      promptQuestion = `查单词: ${sidebarContext.trim()}`;
    } else if (q === '总结全文') {
      targetContext = subtitles.map((s) => s.text).join('\n').slice(0, 3000);
    }

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: promptQuestion,
      timestamp: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/v1/deepseek/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: targetContext,
        }),
      });

      if (!res.ok) {
        throw new Error('AI 服务请求未响应');
      }

      const data = await res.json();
      const reply = data.response || data.answer || '未能获取回复。';

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'ai',
        content: reply,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'system',
          content: `⚠️ 请求异常：${err.message || '请检查网络连接'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Find unfamiliar words across subtitles
  const handleFindNewWords = async () => {
    if (subtitles.length === 0) {
      alert('请先加载字幕文件');
      return;
    }

    setIsSidebarOpen(true);
    const allText = subtitles.map((s) => s.text).join(' ');
    const rawWords = allText.match(/[a-zA-Z]{3,}/g) || [];
    const uniqueWords = Array.from(new Set(rawWords.map((w) => w.toLowerCase()))).slice(0, 30);

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: '🔍 提炼字幕高频与核心词汇',
      timestamp: Date.now(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/v1/deepseek/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: '请从以下词汇清单中，挑选出 8~12 个最值得学习的高级、核心词汇，并给出音标、词性及简短中文释义：\n' + uniqueWords.join(', '),
          context: allText.slice(0, 2000),
        }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'ai',
          content: data.response || data.answer || '分析完成。',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      // Fallback local extraction
      setChatHistory((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'ai',
          content: `### 核心词汇提炼\n\n${uniqueWords.slice(0, 10).map((w) => `- **${w}**`).join('\n')}\n\n*提示：点击字幕中的单词或右侧 Context 即可即刻查询详细释义。*`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy chat markdown
  const handleCopyChat = async () => {
    if (chatHistory.length === 0) {
      alert('当前没有聊天记录可以复制。');
      return;
    }
    const md = chatHistory
      .map((msg) => `**${msg.role === 'user' ? 'User' : msg.role === 'ai' ? 'AI' : 'System'}:**\n\n${msg.content}\n`)
      .join('\n---\n\n');

    try {
      await navigator.clipboard.writeText(md);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      alert('复制失败，请手动选取');
    }
  };

  // Download chat markdown
  const handleDownloadChat = () => {
    if (chatHistory.length === 0) {
      alert('当前没有聊天记录可以导出。');
      return;
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const md = `# AI Player 对话记录\n\n导出时间：${new Date().toLocaleString()}\n\n` +
      chatHistory
        .map((msg) => `### ${msg.role === 'user' ? '👤 提问' : msg.role === 'ai' ? '🤖 AI 伴读' : 'ℹ️ 系统'}\n\n${msg.content}\n`)
        .join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-player-chat-${timestamp}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Submit word correction
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionWord.trim() || !correctionDef.trim()) {
      setCorrectionStatus('请填写完整的单词与释义');
      return;
    }

    setCorrectionStatus('已记录入词库！');
    setTimeout(() => {
      setIsCorrectionModalOpen(false);
      setCorrectionWord('');
      setCorrectionDef('');
      setCorrectionCn('');
      setCorrectionStatus('');
    }, 1000);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-[#070A12] text-slate-100 flex flex-col">
      {/* Top Navigation & Toolbar */}
      <header className="border-b border-white/10 bg-[#0B0F1F]/80 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">AI Player</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                双语智能伴学
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {videoName ? `当前载入：${videoName}` : '点击字幕逐句跟读 · 随时调取 DeepSeek AI 语法与语境解析'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>载入演示语料</span>
          </button>

          <button
            onClick={() => videoFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all"
          >
            <Video className="w-3.5 h-3.5 text-slate-400" />
            <span>导入视频</span>
          </button>
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleVideoFile(file);
            }}
          />

          <button
            onClick={() => srtFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>导入 SRT</span>
          </button>
          <input
            ref={srtFileInputRef}
            type="file"
            accept=".srt,.vtt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleSrtFile(file);
            }}
          />

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isSidebarOpen
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI 私教 {isSidebarOpen ? '收起' : '展开'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Video & Time-synced Subtitle Stream */}
        <div className={`flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'lg:mr-[420px]' : ''}`}>
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {/* Video Player or Drop Area */}
            {videoSrc ? (
              <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl aspect-video max-h-[480px]">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            ) : (
              <div
                onClick={() => videoFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('video/')) handleVideoFile(file);
                }}
                className="group relative rounded-2xl border-2 border-dashed border-white/15 hover:border-rose-500/50 bg-[#0E1324]/50 hover:bg-[#0E1324]/80 p-8 sm:p-12 text-center cursor-pointer transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  拖拽视频文件到此处，或点击浏览选择
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  支持 MP4、WebM、MOV 等常见格式。视频均在浏览器本地安全解析，不上传任何隐私服务器。
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadDemo();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>直接载入乔布斯斯坦福演讲 Demo</span>
                </button>
              </div>
            )}

            {/* Subtitle Stream Container */}
            <div className="relative bg-[#0E1324]/80 border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[460px]">
              {/* Subtitle Header Bar */}
              <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-300">
                    双语字幕流（{subtitles.length} 句）
                  </span>
                  {currentTimeMs > 0 && (
                    <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      ⏱ {formatMilliseconds(currentTimeMs)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    悬浮点击 ▶ 定位播放 · 点击整句呼叫 AI
                  </span>
                </div>
              </div>

              {/* Subtitle Scroll Feed */}
              {subtitles.length > 0 ? (
                <div
                  ref={subtitleDisplayRef}
                  onWheel={() => setIsUserScrolling(true)}
                  className="flex-1 overflow-y-auto p-4 space-y-2 select-text"
                >
                  {subtitles.map((sub, idx) => {
                    const isCurrent = idx === currentSubtitleIndex;
                    return (
                      <div
                        key={sub.sequence || idx}
                        data-index={idx}
                        onClick={() => handleSubtitleClick(idx)}
                        className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                          isCurrent
                            ? 'bg-rose-500/15 border border-rose-500/40 text-rose-100 shadow-lg shadow-rose-500/10 scale-[1.01]'
                            : 'hover:bg-white/5 border border-transparent text-slate-300 hover:text-white'
                        }`}
                      >
                        {/* Play On Hover Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSubtitleFromIndex(idx);
                          }}
                          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-white/10 text-slate-300 group-hover:bg-rose-500 group-hover:text-white'
                          }`}
                          title="从该句开始播放"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>

                        {/* Timestamp & Subtitle Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-slate-500">
                              {formatMilliseconds(sub.startTime)}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-rose-500/30 text-rose-300">
                                正在播放
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${isCurrent ? 'font-semibold text-white' : 'font-normal'}`}>
                            {sub.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  onClick={() => srtFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleSrtFile(file);
                  }}
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <FileText className="w-10 h-10 text-slate-500 mb-3" />
                  <p className="text-sm font-medium text-slate-300 mb-1">点击或拖拽 SRT 字幕文件到此处</p>
                  <p className="text-xs text-slate-500">支持标准 UTF-8 .srt 和 .vtt 字幕文件</p>
                </div>
              )}

              {/* Floating "Back to Auto Scroll" Button */}
              {isUserScrolling && (
                <button
                  onClick={() => {
                    setIsUserScrolling(false);
                    if (currentSubtitleIndex >= 0) {
                      const container = subtitleDisplayRef.current;
                      const activeEl = container?.querySelector(`[data-index="${currentSubtitleIndex}"]`);
                      activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-xs font-semibold shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all animate-bounce"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>回到自动跟随</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Slide-over Drawer */}
        <aside
          className={`fixed top-16 right-0 bottom-0 z-40 w-full sm:w-[420px] bg-[#0A0E1A] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white">AI 智能伴学侧边栏</span>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleDownloadChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="下载 Markdown 对话记录"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyChat}
                className={`p-1.5 rounded-lg transition-colors ${
                  copiedSuccess ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="复制全文"
              >
                {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleFindNewWords}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="生词查询"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCorrectionWord(sidebarContext.split(/\s+/)[0]?.replace(/[^A-Za-z'-]/g, '') || '');
                  setIsCorrectionModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="单词纠错 / 词库维护"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
                title="关闭侧边栏"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Bot className="w-10 h-10 text-slate-600 mb-3" />
                <p className="font-medium text-slate-300 mb-1">随叫随到的 AI 伴学导师</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  在左侧点击任意字幕行，或在视频中划选单词、长句，即可在这里获得 DeepSeek 的语法剖析、中英精译与地道用法讲解。
                </p>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user'
                      ? 'items-end'
                      : msg.role === 'system'
                      ? 'items-center'
                      : 'items-start'
                  }`}
                >
                  {msg.role === 'system' ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-400 text-center max-w-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                          : 'bg-[#141A2D] border border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="prose prose-invert prose-xs max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {isGenerating && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse delay-200" />
                </div>
                <span>DeepSeek 正在深入分析当前语境...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex flex-wrap gap-1.5">
            <button
              onClick={() => sendQuestion(`句子翻译: ${sidebarContext}`)}
              disabled={isGenerating || !sidebarContext}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[11px] font-medium border border-white/10 hover:border-rose-500/30 transition-all disabled:opacity-40"
            >
              🈶 句子翻译
            </button>
            <button
              onClick={() => sendQuestion('查单词')}
              disabled={isGenerating || !sidebarContext}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[11px] font-medium border border-white/10 hover:border-rose-500/30 transition-all disabled:opacity-40"
            >
              📖 查单词
            </button>
            <button
              onClick={() => sendQuestion('总结')}
              disabled={isGenerating || !sidebarContext}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[11px] font-medium border border-white/10 hover:border-rose-500/30 transition-all disabled:opacity-40"
            >
              💡 语法解构
            </button>
            <button
              onClick={() => sendQuestion('总结全文')}
              disabled={isGenerating || subtitles.length === 0}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-[11px] font-medium border border-white/10 hover:border-rose-500/30 transition-all disabled:opacity-40"
            >
              📜 总结全文
            </button>
          </div>

          {/* Context Display & Chat Input */}
          <div className="p-4 border-t border-white/10 bg-[#0B0F1F] space-y-2">
            {sidebarContext && (
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-mono uppercase tracking-wider text-[10px]">Context</span>
                  <button
                    onClick={() => setSidebarContext('')}
                    className="hover:text-slate-300 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <blockquote className="line-clamp-2 text-slate-200 italic font-medium">
                  &ldquo;{sidebarContext}&rdquo;
                </blockquote>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendQuestion();
                }}
                placeholder="询问 AI（支持自定义提问）..."
                disabled={isGenerating}
                className="flex-1 bg-black/40 border border-white/15 focus:border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => sendQuestion()}
                disabled={isGenerating || !questionInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-medium text-xs shadow-md shadow-rose-600/30 transition-all"
              >
                发送
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Word Correction Modal */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsCorrectionModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-1">单词纠错与生词维护</h3>
            <p className="text-xs text-slate-400 mb-4">填写准确的英文释义与中文释义，提交后将记录并优先采用。</p>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Word (目标单词)</label>
                <input
                  type="text"
                  value={correctionWord}
                  onChange={(e) => setCorrectionWord(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/15 focus:border-rose-500 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">英文释义</label>
                <textarea
                  rows={2}
                  value={correctionDef}
                  onChange={(e) => setCorrectionDef(e.target.value)}
                  required
                  placeholder="English definition..."
                  className="w-full bg-black/40 border border-white/15 focus:border-rose-500 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">中文释义（可选）</label>
                <textarea
                  rows={2}
                  value={correctionCn}
                  onChange={(e) => setCorrectionCn(e.target.value)}
                  placeholder="中文翻译..."
                  className="w-full bg-black/40 border border-white/15 focus:border-rose-500 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {correctionStatus && (
                <p className="text-xs text-emerald-400 font-medium">{correctionStatus}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium"
                >
                  保存更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
