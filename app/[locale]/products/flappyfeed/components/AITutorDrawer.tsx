'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, X, Sparkles, Send, Copy, Check, RefreshCw, BookOpen, Layers, Lightbulb, Volume2, Square } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetText: string;
  contextSentence?: string;
  onPlaySentence?: () => void;
  isPlayingSentence?: boolean;
}

type PromptType = 'grammar' | 'simplify' | 'alternatives' | 'deep_translation' | 'custom';

const PROMPT_MODES: { type: PromptType; label: string; icon: string; desc: string }[] = [
  { type: 'grammar', label: '语法拆解', icon: '📐', desc: '主谓宾成分与从句修饰分析' },
  { type: 'simplify', label: 'A2 降级', icon: '🌱', desc: '初中水平通俗词汇改写' },
  { type: 'alternatives', label: '地道替换', icon: '🔄', desc: '口语/职场/书面 3 组表达' },
  { type: 'deep_translation', label: '深度精译', icon: '🏮', desc: '信达雅文学修辞剖析' },
];

export default function AITutorDrawer({
  isOpen,
  onClose,
  targetText,
  contextSentence,
  onPlaySentence,
  isPlayingSentence,
}: Props) {
  const [activeMode, setActiveMode] = useState<PromptType>('grammar');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [localPlaying, setLocalPlaying] = useState(false);

  const isAudioActive = isPlayingSentence ?? localPlaying;

  const handlePlaySentence = () => {
    if (onPlaySentence) {
      onPlaySentence();
      return;
    }

    // Fallback: self-contained SpeechSynthesis if no parent handler is passed
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (localPlaying) {
      window.speechSynthesis.cancel();
      setLocalPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(targetText);
    u.lang = 'en-US';
    setLocalPlaying(true);
    u.onend = () => setLocalPlaying(false);
    u.onerror = () => setLocalPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const fetchAIAnalysis = async (mode: PromptType, customPrompt?: string) => {
    if (!targetText.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/v1/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_type: mode,
          target_text: customPrompt ? `${targetText}\n【用户提问】：${customPrompt}` : targetText,
          full_context: contextSentence || targetText,
        }),
      });

      if (!res.ok) {
        throw new Error('网络请求异常');
      }

      const data = await res.json();
      setResponse(data.reply || '未能获取解析结果');
    } catch (err: any) {
      setResponse(`【私教提示】\n核心表达：“${targetText}”\n抱歉，AI 伴学服务连接微颤，请稍后刷新重试。您亦可在设置中配置自有 DeepSeek Key。`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && targetText) {
      setActiveMode('grammar');
      setCustomQuestion('');
      fetchAIAnalysis('grammar');
    }
  }, [isOpen, targetText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || loading) return;
    setActiveMode('custom');
    fetchAIAnalysis('custom', customQuestion.trim());
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#101426] border border-purple-500/30 rounded-2xl flex flex-col text-slate-100 shadow-2xl shadow-purple-950/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#12182B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>上下文感知 AI 伴学私教</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/60 px-1.5 py-0.2 rounded font-mono">
                  DeepSeek
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">针对当前语境进行深度拆解与随身答疑</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 目标句子/单词展示 */}
        <div className="px-4 py-3 bg-[#161D33]/90 border-b border-slate-800/60">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-purple-300">当前聚焦语料</span>
            {targetText.split(' ').length > 1 ? (
              <span className="text-[10px] text-slate-500">单句模式</span>
            ) : (
              <span className="text-[10px] text-purple-400">词汇模式</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 bg-black/20 p-2.5 rounded-lg border border-white/5">
            <div className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed font-sans flex-1">
              “{targetText}”
            </div>
            <button
              type="button"
              onClick={handlePlaySentence}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isAudioActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 animate-pulse'
                  : 'bg-white/10 hover:bg-purple-600/20 text-purple-300 hover:text-purple-200 border border-purple-500/30'
              }`}
              title={isAudioActive ? "停止播放" : "播放本句一次"}
            >
              {isAudioActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>播放中</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>播放本句</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 大核心模式切换胶囊 */}
        <div className="p-3 grid grid-cols-4 gap-1.5 bg-[#0F1424] border-b border-slate-800/60">
          {PROMPT_MODES.map((m) => {
            const isActive = activeMode === m.type;
            return (
              <button
                key={m.type}
                onClick={() => {
                  setActiveMode(m.type);
                  fetchAIAnalysis(m.type);
                }}
                disabled={loading}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 text-xs'
                }`}
                title={m.desc}
              >
                <span className="text-sm mb-0.5">{m.icon}</span>
                <span className="text-[11px] font-medium leading-none">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* 解析内容展示区 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3 text-purple-300">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <div className="text-xs text-slate-400 font-mono animate-pulse">
                AI 正在剖析语法与母语表达...
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-purple max-w-none text-xs sm:text-sm space-y-2">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* 底部：复制与自由向 AI 提问 */}
        <div className="p-3 border-t border-slate-800/80 bg-[#12182B] space-y-2">
          {response && !loading && (
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>回答由 FlappyFeed AI 私教生成</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制解析'}</span>
              </button>
            </div>
          )}

          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="对这句有疑问？随时向 AI 私教发问..."
              className="flex-1 bg-[#0A0D18] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!customQuestion.trim() || loading}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-all shadow-md shadow-purple-600/25"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
