import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AI_CACHE = new Map<string, string>();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-c5029eb6276b4ef89df68903c80ffb06'; // default or env
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

function buildPrompt(promptType: string, targetText: string, context?: string): string {
  const ctxPart = context ? `\n【上下文语境】：${context}` : '';
  switch (promptType) {
    case 'grammar':
      return `你是一名世界顶尖的资深英语语法名师。请对以下英文句子进行精准、透彻且易懂的语法结构拆解：
【目标句子】：${targetText}${ctxPart}
要求：
1. 提取主谓宾等核心骨架结构；
2. 剖析关键从句、非谓语动词或高级句型用法；
3. 指出中国学习者易错细节与地道考点；
4. 语言通俗生动，格式清晰排版。`;
    case 'alternatives':
      return `你是一名母语为英语的语言学专家。请针对以下句子或表达，提供 3-5 种在不同语境（如口语日常、商务职场、学术写作、文学表达）下的地道高阶替换说法：
【目标表达】：${targetText}${ctxPart}
要求给出每种替换的使用场景和细微语气差异。`;
    case 'simplify':
      return `请将以下句子改写为初中生（CEFR A2-B1 水平）也能完全看懂的基础英语句子，并附带核心词汇替换对照：
【原句】：${targetText}${ctxPart}`;
    case 'deep_translation':
      return `请对以下英文段落或句子提供【信达雅】的文学级深度精译，并附带翻译思路点评：
【英文原文】：${targetText}${ctxPart}`;
    default:
      return `关于英语表达“${targetText}”${ctxPart}，请提供专业指导与解答。`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt_type = 'grammar', target_text = '', full_context = '' } = body;

    if (!target_text.trim()) {
      return NextResponse.json({ error: 'target_text cannot be empty' }, { status: 400 });
    }

    const cacheKey = `${prompt_type}::${target_text.trim().toLowerCase()}`;
    if (AI_CACHE.has(cacheKey)) {
      return NextResponse.json({
        prompt_type,
        target_text,
        reply: AI_CACHE.get(cacheKey),
        cached: true,
        model: DEEPSEEK_MODEL,
      });
    }

    const systemPrompt = "你是由 Bytegush FlappyFeed 打造的专属 AI 英语伴学导师。你的回答专业、严谨、排版赏心悦目，致力于帮助学习者彻底掌握地道英语思维。";
    const userPrompt = buildPrompt(prompt_type, target_text, full_context);

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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 1500,
      }),
    });

    if (!dsResp.ok) {
      const errText = await dsResp.text();
      console.warn('DeepSeek upstream error:', errText);
      return NextResponse.json({
        prompt_type,
        target_text,
        reply: `【AI 私教解析】\n核心表达：“${target_text}”\n语法提示：该句结构完整，语境契合。请结合发音跟读沉浸式体会语感。`,
        cached: false,
        fallback: true,
      });
    }

    const dsJson = await dsResp.json();
    const reply = dsJson.choices?.[0]?.message?.content || '未能生成解析，请稍后重试。';

    if (AI_CACHE.size > 2000) {
      const firstKey = AI_CACHE.keys().next().value;
      if (firstKey) AI_CACHE.delete(firstKey);
    }
    AI_CACHE.set(cacheKey, reply);

    return NextResponse.json({
      prompt_type,
      target_text,
      reply,
      cached: false,
      model: DEEPSEEK_MODEL,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
