'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ALL_TOOLS,
  PRESET_RECIPES,
  ALL_CHEAT_SHEETS,
} from '../lib/tools';
import { ToolDefinition, PipelineStep, ToolCategory } from '../lib/types';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Command,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sliders,
  X,
  FileCode,
  ShieldCheck,
  Zap,
  CornerDownLeft,
} from 'lucide-react';

export default function PipelineStudio() {
  const [input, setInput] = useState<string>(PRESET_RECIPES[0].sampleInput);
  const [pipeline, setPipeline] = useState<PipelineStep[]>([
    { id: 'step-init-1', toolId: 'HTTPHeadersToJSON' },
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const [latency, setLatency] = useState<number>(0.1);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>('headers-to-json');

  // Command Palette State
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [activePaletteIndex, setActivePaletteIndex] = useState<number>(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Cheat Sheet Modal State
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [activeCheatSheetId, setActiveCheatSheetId] = useState<string>('git');
  const [cheatSheetQuery, setCheatSheetQuery] = useState<string>('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Real-time Pipeline Execution
  const output = useMemo(() => {
    const start = performance.now();
    let current = input;

    for (const step of pipeline) {
      const tool = ALL_TOOLS.find((t) => t.id === step.toolId);
      if (tool) {
        try {
          current = tool.run(current, step.arg);
        } catch (err: any) {
          current = `[工序 "${tool.name}" 执行异常]: ${err.message}`;
          break;
        }
      }
    }

    const elapsed = Math.max(0.1, Number((performance.now() - start).toFixed(2)));
    setLatency(elapsed);
    return current;
  }, [input, pipeline]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘ + K / Ctrl + K: 唤起命令面板
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
      // ⌘ + Shift + C: 复制结果
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      }
      // ⌘ + Shift + R: 管道回填 (Redirect)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRedirect();
      }
      // Escape: 关闭弹层
      if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsCheatSheetOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [output]);

  // Command palette focus
  useEffect(() => {
    if (isPaletteOpen) {
      setTimeout(() => {
        paletteInputRef.current?.focus();
      }, 50);
      setActivePaletteIndex(0);
    }
  }, [isPaletteOpen]);

  // Filter tools for Command Palette
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Handlers
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRedirect = () => {
    if (!output) return;
    setInput(output);
    // 可选清空工序或者保留工序
    setPipeline([]);
    setActiveRecipeId(null);
  };

  const addStep = (tool: ToolDefinition) => {
    const newStep: PipelineStep = {
      id: 'step-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      toolId: tool.id,
      arg: tool.defaultArg,
    };
    setPipeline((prev) => [...prev, newStep]);
    setIsPaletteOpen(false);
    setSearchQuery('');
    setActiveRecipeId(null);
  };

  const removeStep = (id: string) => {
    setPipeline((prev) => prev.filter((s) => s.id !== id));
    setActiveRecipeId(null);
  };

  const moveStep = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pipeline.length) return;
    const next = [...pipeline];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setPipeline(next);
    setActiveRecipeId(null);
  };

  const updateStepArg = (id: string, arg: string) => {
    setPipeline((prev) =>
      prev.map((s) => (s.id === id ? { ...s, arg } : s))
    );
  };

  const applyRecipe = (recipe: (typeof PRESET_RECIPES)[0]) => {
    setInput(recipe.sampleInput);
    setPipeline(
      recipe.steps.map((st, i) => ({
        id: `recipe-${recipe.id}-${i}`,
        toolId: st.toolId,
        arg: st.arg,
      }))
    );
    setActiveRecipeId(recipe.id);
  };

  // Text metrics
  const inputLines = input ? input.split('\n').length : 0;
  const inputChars = input ? input.length : 0;
  const outputLines = output ? output.split('\n').length : 0;
  const outputChars = output ? output.length : 0;
  const outputBytes = new Blob([output]).size;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ===================== 顶部常用配方快速切换条 ===================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1424]/90 border border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>高频配方</span>
          </div>

          {PRESET_RECIPES.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => applyRecipe(recipe)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeRecipeId === recipe.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>{recipe.name}</span>
              <span className="opacity-60 text-[10px]">({recipe.tag})</span>
            </button>
          ))}
        </div>

        {/* 备忘命令速查入口 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 hover:text-white text-xs border border-slate-700/70 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>命令速查</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/70 text-slate-300 font-mono">
              {ALL_CHEAT_SHEETS.length} 类
            </span>
          </button>
        </div>
      </div>

      {/* ===================== 核心工作台主容器 ===================== */}
      <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/90 shadow-2xl shadow-black/80 overflow-hidden flex flex-col">
        {/* 窗口极客头部：macOS 装饰微点 + 管道工序链 */}
        <div className="px-5 py-3.5 bg-[#0e1322] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* macOS 终端三色微点 */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">PIPELINE STREAM</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {pipeline.length} 道工序
              </span>
            </div>
          </div>

          {/* 管道工序胶囊链 */}
          <div className="flex-1 flex flex-wrap items-center gap-2 px-2 overflow-x-auto py-1">
            <span className="px-2 py-1 rounded bg-slate-800/50 text-[11px] font-mono text-slate-400 border border-slate-700/40">
              stdin (输入)
            </span>

            {pipeline.map((step, index) => {
              const tool = ALL_TOOLS.find((t) => t.id === step.toolId);
              if (!tool) return null;

              return (
                <div key={step.id} className="flex items-center gap-1.5 animate-fadeIn">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  <div className="group relative flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-xs text-emerald-200 shadow-sm">
                    <span className="font-medium">{tool.name}</span>

                    {/* 参数配置项 */}
                    {tool.needsArg && (
                      <input
                        type="text"
                        value={step.arg || ''}
                        placeholder={tool.argPlaceholder || '参数'}
                        onChange={(e) => updateStepArg(step.id, e.target.value)}
                        className="w-20 px-1.5 py-0.5 text-[11px] bg-slate-950/80 border border-emerald-500/30 rounded text-emerald-300 placeholder:text-emerald-700 focus:outline-none focus:border-emerald-400"
                      />
                    )}

                    {/* 左右移动排序 */}
                    <div className="flex items-center ml-1 border-l border-emerald-500/30 pl-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={() => moveStep(index, 'left')}
                          className="hover:text-white p-0.5"
                          title="前移工序"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                      {index < pipeline.length - 1 && (
                        <button
                          onClick={() => moveStep(index, 'right')}
                          className="hover:text-white p-0.5"
                          title="后移工序"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeStep(step.id)}
                        className="hover:text-rose-400 p-0.5 ml-0.5"
                        title="删除该工序"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="px-2 py-1 rounded bg-slate-800/50 text-[11px] font-mono text-slate-400 border border-slate-700/40">
              stdout (输出)
            </span>
          </div>

          {/* 管道追加工序与快捷键 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>追加工序</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-500/40 rounded text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {pipeline.length > 0 && (
              <button
                onClick={() => setPipeline([])}
                className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                title="清空所有工序"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ===================== 中间双栏实时编辑器 ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 min-h-[460px]">
          {/* 左栏：INPUT */}
          <div className="flex flex-col bg-[#090D18]">
            {/* Input 头部小操作条 */}
            <div className="px-4 py-2.5 bg-[#0C1120] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
                  INPUT
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({inputLines} 行 · {inputChars} 字符)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInput('')}
                  className="px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  清空
                </button>
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setInput(text);
                    } catch {}
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  从剪贴板粘贴
                </button>
              </div>
            </div>

            {/* Input 编辑文本域 */}
            <div className="flex-1 p-4 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此贴入或键入需要清洗、转换的原始文本内容..."
                className="w-full h-full min-h-[380px] bg-transparent text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-emerald-500/30 selection:text-emerald-200 placeholder:text-slate-600"
                spellCheck={false}
              />
            </div>
          </div>

          {/* 右栏：OUTPUT */}
          <div className="flex flex-col bg-[#090D18]">
            {/* Output 头部小操作条 */}
            <div className="px-4 py-2.5 bg-[#0C1120] border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                  OUTPUT (实时演算)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({outputLines} 行 · {outputChars} 字符 · {outputBytes} B)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 核心极客动作：管道回填 (Redirect) */}
                <button
                  onClick={handleRedirect}
                  className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="把当前计算结果送入输入区，开启下一轮清洗 [⌘+Shift+R]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>回填至输入</span>
                  <kbd className="hidden sm:inline-block px-1 py-0.2 bg-emerald-900/60 rounded text-[9px] font-mono">
                    ⌘⇧R
                  </kbd>
                </button>

                {/* 复制结果 */}
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                  title="复制当前转换结果 [⌘+Shift+C]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制 ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制结果</span>
                      <kbd className="hidden sm:inline-block px-1 py-0.2 bg-slate-900/60 rounded text-[9px] font-mono">
                        ⌘⇧C
                      </kbd>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output 只读展示区 */}
            <div className="flex-1 p-4 relative bg-[#070A12]/40">
              <textarea
                value={output}
                readOnly
                placeholder="工序处理后的数据将实时在此渲染..."
                className="w-full h-full min-h-[380px] bg-transparent text-emerald-300/90 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-emerald-500/30 selection:text-emerald-100 placeholder:text-slate-600"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* ===================== 底部 Vim 极客状态条 ===================== */}
        <div className="px-4 py-2 bg-[#090C16] border-t border-slate-800/90 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>纯本地毫秒级执行 ({latency}ms)</span>
            </div>
            <span>·</span>
            <span>无网络传输 (100% 隐私离线安全)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>
              快捷键：
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 ml-1">⌘K</kbd> 算子库
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 ml-2">⌘⇧C</kbd> 复制
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 ml-2">⌘⇧R</kbd> 回填
            </span>
          </div>
        </div>
      </div>

      {/* ===================== ⌘K 命令面板 (Command Palette Modal) ===================== */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div
            className="w-full max-w-2xl rounded-2xl bg-[#0F1424] border border-emerald-500/30 shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 搜索输入头 */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#13192B]">
              <Search className="w-5 h-5 text-emerald-400" />
              <input
                ref={paletteInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActivePaletteIndex(0);
                }}
                placeholder="搜索任意处理算子 (如: base64, 驼峰, json, 行去重, sql)..."
                className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none font-mono"
              />
              <button
                onClick={() => setIsPaletteOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 分类快捷标签 */}
            <div className="px-4 py-2 border-b border-slate-800/80 bg-[#0C101E] flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: '全部算子' },
                { id: 'case', label: '大小写' },
                { id: 'lines', label: '行与空白' },
                { id: 'encoding', label: '编解码' },
                { id: 'data', label: '数据格式' },
                { id: 'sql', label: 'SQL/模板' },
                { id: 'geek', label: '极客调试' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 算子列表 */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
              {filteredTools.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  未匹配到相关算子，试试其他关键词？
                </div>
              ) : (
                filteredTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    onClick={() => addStep(tool)}
                    onMouseEnter={() => setActivePaletteIndex(index)}
                    className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      activePaletteIndex === index
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 font-mono text-xs">
                        ⚡
                      </div>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <span>{tool.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {tool.categoryLabel}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{tool.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {tool.needsArg && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          支持参数
                        </span>
                      )}
                      <span className="text-xs text-emerald-400 font-mono opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <span>追加</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 底部提示 */}
            <div className="px-4 py-2 bg-[#090C16] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>点击或按 Enter 添加到当前数据管道</span>
              <span>ESC 关闭</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 开发者常用命令速查中心 (Command Cheat Sheet Hub) ===================== */}
      {isCheatSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl rounded-3xl bg-[#0F1424] border border-slate-800 shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh]">
            {/* 弹窗头部 */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#13192B]">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>开发者高频命令速查</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      CHEATSHEET
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    点击任意命令即可快速复制，支持快速检索
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCheatSheetOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 搜索与分类切换栏 */}
            <div className="px-5 py-3 border-b border-slate-800/80 bg-[#0C101E] flex flex-wrap items-center justify-between gap-3">
              {/* 分类 Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_CHEAT_SHEETS.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCheatSheetId(category.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      activeCheatSheetId === category.id
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/40 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">
                      ({category.items.length})
                    </span>
                  </button>
                ))}
              </div>

              {/* 弹窗内搜索框 */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cheatSheetQuery}
                  onChange={(e) => setCheatSheetQuery(e.target.value)}
                  placeholder="检索命令或用途..."
                  className="w-full pl-8 pr-3 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                {cheatSheetQuery && (
                  <button
                    onClick={() => setCheatSheetQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 速查表格主体 */}
            <div className="p-6 overflow-y-auto flex-1">
              {(() => {
                const currentCategory =
                  ALL_CHEAT_SHEETS.find((c) => c.id === activeCheatSheetId) ||
                  ALL_CHEAT_SHEETS[0];
                const items = currentCategory.items.filter((item) => {
                  if (!cheatSheetQuery) return true;
                  const q = cheatSheetQuery.toLowerCase();
                  return (
                    item.command.toLowerCase().includes(q) ||
                    item.explain.toLowerCase().includes(q)
                  );
                });

                if (items.length === 0) {
                  return (
                    <div className="py-16 text-center text-slate-400 text-sm">
                      在「{currentCategory.name}」中未搜索到匹配项，换个关键词试试？
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-sm font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs">
                        <th className="pb-3 w-7/12">COMMAND / KEY (点击复制)</th>
                        <th className="pb-3 w-5/12 font-sans">说明与用途</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {items.map((item, i) => {
                        const isCopied = copiedCommand === item.command;
                        return (
                          <tr
                            key={i}
                            onClick={() => {
                              navigator.clipboard.writeText(item.command);
                              setCopiedCommand(item.command);
                              setTimeout(() => setCopiedCommand(null), 1200);
                            }}
                            className="hover:bg-slate-800/40 cursor-pointer group transition-colors"
                          >
                            <td className="py-3 pr-4 text-emerald-300 font-semibold flex items-center justify-between gap-2">
                              <span className="font-mono text-xs sm:text-sm select-all">
                                {item.command}
                              </span>
                              <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isCopied ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold">
                                    已复制 ✓
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                                )}
                              </span>
                            </td>
                            <td className="py-3 font-sans text-slate-300 text-xs sm:text-sm leading-relaxed">
                              {item.explain}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {/* 弹窗底部操作条 */}
            <div className="px-5 py-3 bg-[#090C16] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">提示：点击表格内任意行可直接复制命令</span>
              <button
                onClick={() => setIsCheatSheetOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
