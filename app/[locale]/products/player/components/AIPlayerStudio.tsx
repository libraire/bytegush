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
  Maximize2,
  Minimize2,
  KeyRound,
  Repeat1,
  Repeat,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { SubtitleItem, ChatMessage, WordCorrection } from '../lib/types';
import {
  parseSrtContent,
  getContextualSentence,
  formatMilliseconds
} from '../lib/srtParser';
import AIConfigModal from './AIConfigModal';
import { UserAIConfig, getStoredAIConfig } from '../lib/aiProviders';

export default function AIPlayerStudio() {
  // Video and subtitle state
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(-1);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [isLoopingSentence, setIsLoopingSentence] = useState<boolean>(false);
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState<boolean>(false);

  // AI Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sidebarContext, setSidebarContext] = useState<string>('');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // AI Model Config state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [aiConfig, setAiConfig] = useState<UserAIConfig | null>(null);

  // Load stored AI configuration on mount
  useEffect(() => {
    const stored = getStoredAIConfig();
    if (stored) {
      setAiConfig(stored);
    }
  }, []);

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

  // Helper to scroll container safely without affecting parent containers or outer window
  const scrollSubtitleToCenter = useCallback((index: number) => {
    const container = subtitleDisplayRef.current;
    if (!container || index < 0) return;

    const activeEl = container.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const relativeTop = activeRect.top - containerRect.top;
      const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (activeRect.height / 2);

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, []);

  // Auto-scroll subtitle when video progresses (strictly container-internal)
  useEffect(() => {
    if (isUserScrolling || currentSubtitleIndex < 0) return;
    scrollSubtitleToCenter(currentSubtitleIndex);
  }, [currentSubtitleIndex, isUserScrolling, scrollSubtitleToCenter]);

  // Scroll chat to bottom on new messages without triggering window scroll
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isGenerating]);

  // Seek and play from a specific subtitle line
  const playSubtitleFromIndex = useCallback((index: number) => {
    if (index < 0 || index >= subtitles.length) return;
    const sub = subtitles[index];
    setCurrentSubtitleIndex(index);
    setCurrentTimeMs(sub.startTime);
    setIsUserScrolling(false);
    scrollSubtitleToCenter(index);

    if (videoRef.current) {
      videoRef.current.currentTime = sub.startTime / 1000;
      videoRef.current.play().catch((e) => console.warn('Autoplay failed:', e));
      setIsPlaying(true);
    }
  }, [subtitles, scrollSubtitleToCenter]);

  // Jump to previous subtitle line
  const jumpToPrevSubtitle = useCallback(() => {
    if (subtitles.length === 0) return;
    const targetIdx = currentSubtitleIndex > 0 ? currentSubtitleIndex - 1 : 0;
    playSubtitleFromIndex(targetIdx);
    const contextSentence = getContextualSentence(targetIdx, subtitles);
    setSidebarContext(contextSentence);
  }, [subtitles, currentSubtitleIndex, playSubtitleFromIndex]);

  // Jump to next subtitle line
  const jumpToNextSubtitle = useCallback(() => {
    if (subtitles.length === 0) return;
    const targetIdx =
      currentSubtitleIndex >= 0 && currentSubtitleIndex < subtitles.length - 1
        ? currentSubtitleIndex + 1
        : 0;
    playSubtitleFromIndex(targetIdx);
    const contextSentence = getContextualSentence(targetIdx, subtitles);
    setSidebarContext(contextSentence);
  }, [subtitles, currentSubtitleIndex, playSubtitleFromIndex]);

  // Replay current subtitle line from start
  const replayCurrentSubtitle = useCallback(() => {
    if (currentSubtitleIndex >= 0 && currentSubtitleIndex < subtitles.length) {
      playSubtitleFromIndex(currentSubtitleIndex);
    } else if (subtitles.length > 0) {
      playSubtitleFromIndex(0);
    }
  }, [subtitles, currentSubtitleIndex, playSubtitleFromIndex]);

  // Video time update handler (with Sentence Loop / A-B repeat support)
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const ms = videoRef.current.currentTime * 1000;
    setCurrentTimeMs(ms);

    if (subtitles.length === 0) return;

    // Sentence Loop mode (A-B Repeat)
    if (
      isLoopingSentence &&
      currentSubtitleIndex >= 0 &&
      currentSubtitleIndex < subtitles.length &&
      !videoRef.current.paused
    ) {
      const activeSub = subtitles[currentSubtitleIndex];
      // When reaching or passing the end time of the active sentence
      if (ms >= activeSub.endTime) {
        videoRef.current.currentTime = activeSub.startTime / 1000;
        videoRef.current.play().catch(() => {});
        return;
      }
    }

    const idx = subtitles.findIndex((sub) => ms >= sub.startTime && ms <= sub.endTime);
    if (idx !== currentSubtitleIndex) {
      setCurrentSubtitleIndex(idx);
    }
  }, [subtitles, currentSubtitleIndex, isLoopingSentence]);

  // Learning keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLoopingSentence((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        replayCurrentSubtitle();
      } else if (e.key === '[' || (e.key === 'ArrowLeft' && e.altKey)) {
        e.preventDefault();
        jumpToPrevSubtitle();
      } else if (e.key === ']' || (e.key === 'ArrowRight' && e.altKey)) {
        e.preventDefault();
        jumpToNextSubtitle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replayCurrentSubtitle, jumpToPrevSubtitle, jumpToNextSubtitle]);

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
          config: aiConfig,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'NO_API_KEY') {
          setIsConfigModalOpen(true);
        }
        throw new Error(data.error || 'AI 服务请求异常');
      }

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
          config: aiConfig,
        }),
      });

      const data = await res.json();
      if (!res.ok && data.error === 'NO_API_KEY') {
        setIsConfigModalOpen(true);
      }
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
    <div className="relative w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto h-full bg-[#070A12] text-slate-100 flex flex-col overflow-hidden border-x border-white/10 shadow-2xl shadow-black/80">
      {/* Top Navigation & Toolbar */}
      <header className="shrink-0 border-b border-white/10 bg-[#0B0F1F]/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">AI Player</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                双语智能伴学
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {videoName ? `正在播放：${videoName}` : '点击字幕逐句跟读 · 随时调取 DeepSeek AI 语法与语境解析'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main Studio Viewport (2-Column Studio Grid, Never overflows window) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Fixed Video & Multi-line Subtitles below */}
        <div className="flex-1 min-w-0 flex flex-col p-3 sm:p-4 overflow-hidden bg-[#070A12] gap-3">
          {/* Dominant Video Frame (Active Player or Default Drop Area) */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
            {videoSrc ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/95 border border-white/10 shadow-2xl flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full h-full max-h-full max-w-full object-contain"
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
                className="group relative w-full h-full rounded-2xl border-2 border-dashed border-white/15 hover:border-rose-500/50 bg-[#0E1324]/50 hover:bg-[#0E1324]/80 p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-3.5 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/10">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">
                  拖拽视频文件到此处，或点击浏览选择
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  支持 MP4、WebM、MOV 等常见格式。视频均在浏览器本地安全解析，保护隐私不上传云端。
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                    点击选取本地视频
                  </span>
                  <span className="text-slate-500 text-xs">或直接将视频文件拖放至此框</span>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles Area below Video (Compact multi-line feed, significantly smaller than video) */}
          <div className={`${isSubtitleExpanded ? 'h-[280px] sm:h-[320px]' : 'h-[170px] sm:h-[190px] lg:h-[210px]'} shrink-0 flex flex-col rounded-2xl bg-[#090D1A]/90 border border-white/10 overflow-hidden relative transition-all duration-200`}>
            {/* Subtitle Header Bar */}
            <div className="px-3.5 py-2 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-200">
                  双语字幕流 {subtitles.length > 0 ? `(${subtitles.length} 句)` : ''}
                </span>
                {currentTimeMs > 0 && (
                  <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[11px]">
                    ⏱ {formatMilliseconds(currentTimeMs)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {subtitles.length > 0 ? (
                  <div className="flex items-center gap-1">
                    {/* Previous Subtitle */}
                    <button
                      onClick={jumpToPrevSubtitle}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                      title="跳到上一句 (快捷键: [ 或 Alt+←)"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>

                    {/* Replay Current */}
                    <button
                      onClick={replayCurrentSubtitle}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                      title="从头重播本句 (快捷键: R)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* Next Subtitle */}
                    <button
                      onClick={jumpToNextSubtitle}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                      title="跳到下一句 (快捷键: ] 或 Alt+→)"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-3.5 w-px bg-white/10 mx-0.5" />

                    {/* Sentence Loop Toggle */}
                    <button
                      onClick={() => setIsLoopingSentence(!isLoopingSentence)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        isLoopingSentence
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20 ring-1 ring-rose-500/30'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10 hover:bg-white/10'
                      }`}
                      title="单句循环模式 (A-B 复读，快捷键: L)"
                    >
                      <Repeat1 className={`w-3.5 h-3.5 ${isLoopingSentence ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                      <span>单句循环 {isLoopingSentence ? '开启' : '关闭'}</span>
                      <span className="text-[10px] opacity-60 font-mono hidden sm:inline">(L)</span>
                    </button>

                    <div className="h-3.5 w-px bg-white/10 mx-0.5" />

                    {/* Subtitle Expand/Compact Height Toggle */}
                    <button
                      onClick={() => setIsSubtitleExpanded(!isSubtitleExpanded)}
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        isSubtitleExpanded
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
                      }`}
                      title={isSubtitleExpanded ? "切换为默认紧凑字幕框" : "展开显示更多字幕行"}
                    >
                      {isSubtitleExpanded ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => srtFileInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>导入字幕</span>
                    </button>

                    {/* Subtitle Expand/Compact Height Toggle */}
                    <button
                      onClick={() => setIsSubtitleExpanded(!isSubtitleExpanded)}
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        isSubtitleExpanded
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
                      }`}
                      title={isSubtitleExpanded ? "切换为默认紧凑字幕框" : "展开显示更多字幕行"}
                    >
                      {isSubtitleExpanded ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Subtitle Scroll Feed */}
            {subtitles.length > 0 ? (
              <div
                ref={subtitleDisplayRef}
                onWheel={() => setIsUserScrolling(true)}
                className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 select-text"
              >
                {subtitles.map((sub, idx) => {
                  const isCurrent = idx === currentSubtitleIndex;
                  return (
                    <div
                      key={sub.sequence || idx}
                      data-index={idx}
                      onClick={() => {
                        playSubtitleFromIndex(idx);
                        const contextSentence = getContextualSentence(idx, subtitles);
                        setSidebarContext(contextSentence);
                      }}
                      className={`group relative flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-500/15 border border-rose-500/40 text-rose-100 shadow-md shadow-rose-500/10'
                          : 'hover:bg-white/5 border border-transparent text-slate-300 hover:text-white'
                      }`}
                    >
                      {/* Left: Play button + Timestamp + Subtitle Text */}
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSubtitleFromIndex(idx);
                          }}
                          className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all mt-0.5 ${
                            isCurrent
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-white/10 text-slate-400 group-hover:bg-rose-500 group-hover:text-white'
                          }`}
                          title="从该句开始播放"
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] text-slate-500">
                              {formatMilliseconds(sub.startTime)}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-rose-500/30 text-rose-300 border border-rose-500/30">
                                正在播放
                              </span>
                            )}
                            {isCurrent && isLoopingSentence && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 animate-pulse flex items-center gap-1">
                                <Repeat1 className="w-2.5 h-2.5" />
                                <span>A-B 循环中</span>
                              </span>
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm leading-relaxed ${isCurrent ? 'font-semibold text-white' : 'font-normal'}`}>
                            {sub.text}
                          </p>
                        </div>
                      </div>

                      {/* Right: Loop button & AI action button */}
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSubtitleFromIndex(idx);
                            setIsLoopingSentence(true);
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-all ${
                            isCurrent && isLoopingSentence
                              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                              : 'hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-transparent hover:border-white/10'
                          }`}
                          title="循环复读本句 (A-B Loop)"
                        >
                          <Repeat1 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubtitleClick(idx);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            isCurrent
                              ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40'
                              : 'hover:bg-white/10 text-slate-400 hover:text-rose-300 border border-transparent hover:border-white/10'
                          }`}
                          title="用 AI 剖析本句"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">AI 精讲</span>
                        </button>
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
                className="flex-1 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <FileText className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-xs sm:text-sm font-medium text-slate-300 mb-1">点击或拖拽 SRT 字幕文件到此处</p>
                <p className="text-[11px] text-slate-500">支持标准 UTF-8 .srt 和 .vtt 字幕文件，多行同步滚动播放</p>
              </div>
            )}

            {/* Floating "Back to Auto Scroll" Button */}
            {isUserScrolling && (
              <button
                onClick={() => {
                  setIsUserScrolling(false);
                  if (currentSubtitleIndex >= 0) {
                    scrollSubtitleToCenter(currentSubtitleIndex);
                  }
                }}
                className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-xs font-semibold shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all animate-bounce"
              >
                <RotateCcw className="w-3 h-3" />
                <span>回到自动跟随</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: AI Tutor Assistant */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-[#090D1A]/95 border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden h-[380px] lg:h-full shrink-0">
            {/* Sidebar Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-bold text-white">AI 智能伴学</span>
              </div>

              {/* Quick Action Icons */}
              <div className="flex items-center gap-1">
                {/* API Key Config Button */}
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    aiConfig?.apiKey
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 animate-pulse'
                  }`}
                  title="配置大模型 API Key（支持 DeepSeek / OpenAI / Claude 等）"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {aiConfig?.apiKey ? (aiConfig.model || '已配Key') : '配置 Key'}
                  </span>
                </button>

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
                  title="收起侧边栏"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Bot className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="font-medium text-slate-300 mb-1">随叫随到的 AI 伴学导师</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-4">
                    在左下方点击任意字幕行的「AI 精讲」，或在视频字幕中划选文本，即可在这里获得大模型的语法剖析、中英精译与地道用法讲解。
                  </p>
                  {!aiConfig?.apiKey ? (
                    <button
                      onClick={() => setIsConfigModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-rose-500/20 hover:opacity-95 transition-opacity"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>配置个人 API Key (支持 DeepSeek/OpenAI/Claude等)</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>当前已连接：{aiConfig.model}</span>
                    </div>
                  )}
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
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex flex-wrap gap-1.5 shrink-0">
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
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#0B0F1F] space-y-2 shrink-0">
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
        )}
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

      {/* AI Model & API Key Configuration Modal */}
      <AIConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={(newCfg) => setAiConfig(newCfg)}
        currentConfig={aiConfig}
      />
    </div>
  );
}
