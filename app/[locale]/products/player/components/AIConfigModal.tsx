"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Cpu,
  ChevronDown,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  AI_PROVIDERS,
  AIModelProvider,
  UserAIConfig,
  saveStoredAIConfig,
  clearStoredAIConfig
} from '../lib/aiProviders';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: UserAIConfig | null) => void;
  currentConfig: UserAIConfig | null;
}

export default function AIConfigModal({
  isOpen,
  onClose,
  onSave,
  currentConfig
}: AIConfigModalProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>('deepseek');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [model, setModel] = useState<string>('deepseek-chat');
  const [isCustomModel, setIsCustomModel] = useState<boolean>(false);
  const [customModelName, setCustomModelName] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('https://api.deepseek.com');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Testing status
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Active provider definition
  const currentProvider: AIModelProvider =
    AI_PROVIDERS.find((p) => p.id === selectedProviderId) || AI_PROVIDERS[0];

  // Initialize from currentConfig when opened
  useEffect(() => {
    if (isOpen) {
      if (currentConfig) {
        setSelectedProviderId(currentConfig.provider);
        setApiKey(currentConfig.apiKey);
        setBaseUrl(currentConfig.baseUrl);
        const prov = AI_PROVIDERS.find((p) => p.id === currentConfig.provider);
        if (prov && prov.models.includes(currentConfig.model)) {
          setModel(currentConfig.model);
          setIsCustomModel(false);
          setCustomModelName('');
        } else {
          setModel('custom');
          setIsCustomModel(true);
          setCustomModelName(currentConfig.model);
        }
      } else {
        // Default to DeepSeek
        const def = AI_PROVIDERS[0];
        setSelectedProviderId(def.id);
        setApiKey('');
        setBaseUrl(def.defaultBaseUrl);
        setModel(def.defaultModel);
        setIsCustomModel(false);
        setCustomModelName('');
      }
      setTestResult(null);
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleProviderChange = (providerId: string) => {
    setSelectedProviderId(providerId);
    const prov = AI_PROVIDERS.find((p) => p.id === providerId) || AI_PROVIDERS[0];
    setBaseUrl(prov.defaultBaseUrl);
    setModel(prov.defaultModel);
    setIsCustomModel(false);
    setCustomModelName('');
    setTestResult(null);
  };

  const handleModelChange = (value: string) => {
    if (value === '__custom__') {
      setIsCustomModel(true);
      setModel('__custom__');
    } else {
      setIsCustomModel(false);
      setModel(value);
    }
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ ok: false, msg: '请先填写 API Key' });
      return;
    }

    const targetModel = isCustomModel ? customModelName.trim() : model;
    if (!targetModel) {
      setTestResult({ ok: false, msg: '请指定模型名称' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/v1/deepseek/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTest: true,
          config: {
            provider: selectedProviderId,
            apiKey: apiKey.trim(),
            baseUrl: baseUrl.trim(),
            model: targetModel,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setTestResult({
          ok: true,
          msg: `✅ 连接成功！${data.message || '模型已就绪'}`,
        });
      } else {
        setTestResult({
          ok: false,
          msg: `❌ 连接失败：${data.error || '无法与模型接口连通，请检查 Key 与地址'}`,
        });
      }
    } catch (e: any) {
      setTestResult({
        ok: false,
        msg: `❌ 网络请求异常：${e.message || '请检查网络'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('请填写有效的 API Key');
      return;
    }

    const targetModel = isCustomModel ? customModelName.trim() : model;
    if (!targetModel) {
      alert('请指定模型名称');
      return;
    }

    const newConfig: UserAIConfig = {
      provider: selectedProviderId,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim() || currentProvider.defaultBaseUrl,
      model: targetModel,
    };

    saveStoredAIConfig(newConfig);
    onSave(newConfig);
    onClose();
  };

  const handleClear = () => {
    if (confirm('确定清除已保存的 API Key 吗？')) {
      clearStoredAIConfig();
      setApiKey('');
      setTestResult(null);
      onSave(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0F1424] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">配置 AI 大模型 API Key</h3>
              <p className="text-[11px] text-slate-400">
                支持国内外 9+ 主流模型。Key 仅私密保存在本地浏览器，不入服务器数据库。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4 text-xs">
          {/* Provider Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>选择大模型服务商</span>
              <span className="text-[11px] font-normal text-rose-400">
                推荐：DeepSeek (超低成本) / Claude / GPT-4o
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_PROVIDERS.map((p) => {
                const isSelected = p.id === selectedProviderId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/50 text-white shadow-sm shadow-rose-500/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="font-semibold text-xs tracking-tight line-clamp-1">
                        {p.name.split(' ')[0]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono line-clamp-1">
                      {p.defaultModel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Card Tip & Doc Link */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold text-slate-200">{currentProvider.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentProvider.description}
              </p>
            </div>
            {currentProvider.docUrl && (
              <a
                href={currentProvider.docUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-all"
              >
                <span>获取 Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {currentProvider.name.split(' ')[0]} API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder={currentProvider.keyPlaceholder}
                className="w-full bg-black/40 border border-white/15 focus:border-rose-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none pr-10 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              选用模型 (Model)
            </label>
            <div className="space-y-2">
              <select
                value={isCustomModel ? '__custom__' : model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-[#0A0E1A] border border-white/15 focus:border-rose-500/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
              >
                {currentProvider.models.map((m) => (
                  <option key={m} value={m}>
                    {m} {m === currentProvider.defaultModel ? '(推荐默认)' : ''}
                  </option>
                ))}
                <option value="__custom__">⚙️ 自定义输入其他模型名称...</option>
              </select>

              {isCustomModel && (
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="例如：deepseek-ai/DeepSeek-R1 或 llama3.3:70b"
                  className="w-full bg-black/40 border border-white/15 focus:border-rose-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              )}
            </div>
          </div>

          {/* Advanced Collapsible: Base URL */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-3.5 py-2 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="font-medium text-[11px]">高级设置：自定义 API 接口地址 (Base URL)</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>
            {showAdvanced && (
              <div className="p-3 bg-black/20 border-t border-white/10 space-y-1.5">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder={currentProvider.defaultBaseUrl}
                  className="w-full bg-black/40 border border-white/15 focus:border-rose-500/50 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">
                  仅在您使用自建反向代理、海外加速镜像或 OneAPI 聚合网关时修改。
                </p>
              </div>
            )}
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                testResult.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.msg}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div>
            {currentConfig && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs transition-colors"
                title="清除本地配置的 Key"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清除配置</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all disabled:opacity-40"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
              <span>测试连接</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存配置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

