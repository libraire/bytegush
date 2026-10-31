import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AI_CACHE = new Map<string, string>();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-c5029eb6276b4ef89df68903c80ffb06';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question = '', context = '' } = body;

    if (!question.trim() && !context.trim()) {
      return NextResponse.json({ error: 'Question or context is required' }, { status: 400 });
    }

    const cacheKey = `${question.trim()}::${context.trim().slice(0, 200)}`;
    if (AI_CACHE.has(cacheKey)) {
      return NextResponse.json({
        response: AI_CACHE.get(cacheKey),
        cached: true,
      });
    }

    let systemPrompt = "你是由 Bytegush AI Player 打造的专属智能音视频双语伴学导师。你的回答专业、清晰、排版美观（使用 Markdown 列表与粗体），帮助用户深入理解视频语音语境、掌握母语级地道表达。";

    if (question.includes('翻译') || question.startsWith('句子翻译')) {
      systemPrompt = "你是由 Bytegush AI Player 打造的字幕信达雅双语精译专家。请提供高水准中文翻译，剖析句中地道表达与文化语感。";
    } else if (question === '查单词' || question.startsWith('查单词')) {
      systemPrompt = "你是由 Bytegush AI Player 打造的权威词典专家。请提供音标、词性、地道中英释义、在本句中的具体含义以及 1~2 个典型实用例句。";
    } else if (question === '总结' || question.includes('语法')) {
      systemPrompt = "你是由 Bytegush AI Player 打造的语言精析专家。请剖析核心语法骨架、从句用法及易错细节。";
    } else if (question === '总结全文') {
      systemPrompt = "你是由 Bytegush AI Player 打造的全局提炼专家。请梳理整篇字幕的核心主题、结构大纲与核心词汇总结。";
    }

    const userContent = context
      ? `【字幕语境】：\n${context}\n\n【用户问题】：\n${question}`
      : question;

    const dsResp = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.6,
        max_tokens: 1800,
      }),
    });

    if (!dsResp.ok) {
      const errText = await dsResp.text().catch(() => '');
      console.warn('DeepSeek upstream warning:', errText);
      // Fallback response for offline or rate-limited cases
      let fallbackText = `**【AI 伴读回复】**\n\n针对语境：“${context.slice(0, 80)}”\n\n${question.includes('翻译') ? '✨ **参考释义**：请注意本句语调与连读，建议结合原音重复播放 2~3 次建立母语直觉。' : '💡 **提示**：建议点按字母或上下文多维感知语意。'}`;
      return NextResponse.json({
        response: fallbackText,
        fallback: true,
      });
    }

    const dsJson = await dsResp.json();
    const content = dsJson.choices?.[0]?.message?.content || '未能生成回复，请稍后再试。';

    if (AI_CACHE.size > 1000) {
      const firstKey = AI_CACHE.keys().next().value;
      if (firstKey) AI_CACHE.delete(firstKey);
    }
    AI_CACHE.set(cacheKey, content);

    return NextResponse.json({
      response: content,
      answer: content,
      cached: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error', response: '服务暂时繁忙，请稍后重试。' },
      { status: 500 }
    );
  }
}
