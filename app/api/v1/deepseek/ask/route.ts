import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AI_CACHE = new Map<string, string>();

interface AIConfigPayload {
  provider?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string; model: string }> = {
  deepseek: { baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  claude: { baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-sonnet-20241022' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
  moonshot: { baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  zhipu: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash' },
  siliconflow: { baseUrl: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'deepseek/deepseek-chat' },
  custom: { baseUrl: 'http://localhost:11434/v1', model: 'llama3' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question = '',
      context = '',
      config: rawConfig,
      isTest = false,
    } = body as {
      question?: string;
      context?: string;
      config?: AIConfigPayload;
      isTest?: boolean;
    };

    const config = rawConfig || {};
    const provider = (config.provider || 'deepseek').toLowerCase();
    const defaults = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.deepseek;

    // Resolve API Key: User config > Server environment
    const apiKey = config.apiKey?.trim() || process.env.DEEPSEEK_API_KEY || '';
    const baseUrl = (config.baseUrl?.trim() || defaults.baseUrl).replace(/\/+$/, '');
    const model = config.model?.trim() || defaults.model;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'NO_API_KEY',
          response:
            '💡 **当前未配置大模型 API Key**\n\n请点击右上角 **「⚙️ API 设置」**，配置您的专属 API Key（支持 DeepSeek、OpenAI、Claude、Gemini、通义千问、Kimi 等国内外主流大模型），即可开启真正的母语级语法剖析、中英精译与答疑！',
        },
        { status: 400 }
      );
    }

    // Ping / Test connection mode
    if (isTest) {
      const testContent = '请回复五字以内的测试问候，如“API连接成功”。';
      const testSystem = '你是一个API连接测试助手，只简短回复确认信息。';

      if (provider === 'claude') {
        const anthropicUrl = baseUrl.endsWith('/v1')
          ? `${baseUrl}/messages`
          : `${baseUrl}/v1/messages`;

        const testResp = await fetch(anthropicUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            system: testSystem,
            messages: [{ role: 'user', content: testContent }],
            max_tokens: 40,
          }),
        });

        if (!testResp.ok) {
          const errText = await testResp.text().catch(() => '');
          let errMsg = `Claude 接口返回 HTTP ${testResp.status}`;
          try {
            const p = JSON.parse(errText);
            if (p.error?.message) errMsg = p.error.message;
          } catch {}
          return NextResponse.json({ error: errMsg }, { status: testResp.status });
        }
        return NextResponse.json({ ok: true, message: 'Claude API 连接成功！' });
      } else {
        const completionsUrl = baseUrl.endsWith('/chat/completions')
          ? baseUrl
          : `${baseUrl}/chat/completions`;

        const testHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        if (provider === 'openrouter') {
          testHeaders['HTTP-Referer'] = 'https://bytegush.com';
          testHeaders['X-Title'] = 'Bytegush AI Player';
        }

        const testResp = await fetch(completionsUrl, {
          method: 'POST',
          headers: testHeaders,
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: testSystem },
              { role: 'user', content: testContent },
            ],
            max_tokens: 40,
          }),
        });

        if (!testResp.ok) {
          const errText = await testResp.text().catch(() => '');
          let errMsg = `模型接口返回 HTTP ${testResp.status}`;
          try {
            const p = JSON.parse(errText);
            if (p.error?.message) errMsg = p.error.message;
            else if (p.message) errMsg = p.message;
          } catch {}
          return NextResponse.json({ error: errMsg }, { status: testResp.status });
        }
        return NextResponse.json({ ok: true, message: `${model} 连接成功！` });
      }
    }

    if (!question.trim() && !context.trim()) {
      return NextResponse.json({ error: 'Question or context is required' }, { status: 400 });
    }

    // Cache lookup
    const cacheKey = `${model}::${question.trim()}::${context.trim().slice(0, 200)}`;
    if (AI_CACHE.has(cacheKey)) {
      return NextResponse.json({
        response: AI_CACHE.get(cacheKey),
        cached: true,
      });
    }

    // Build tailored system prompt based on query intent
    let systemPrompt =
      '你是由 Bytegush AI Player 打造的专属智能音视频双语伴学导师。你的回答专业、透彻、排版美观（精通 Markdown、加粗与列表），结合英语母语语感与中国学习者的思维盲区，提供极具启发性的深度语言伴学指导。';

    if (question.includes('翻译') || question.startsWith('句子翻译')) {
      systemPrompt =
        '你是由 Bytegush AI Player 打造的字幕信达雅双语精译专家。请提供高水准中文翻译，剖析句中地道表达、语境潜台词与文化语感。';
    } else if (question === '查单词' || question.startsWith('查单词')) {
      systemPrompt =
        '你是由 Bytegush AI Player 打造的权威词典与语境专家。请针对目标词汇提供：国际音标、准确词性、在本句特定语境中的确切含义、2个实用经典例句及易混辨析。';
    } else if (question === '总结' || question.includes('语法')) {
      systemPrompt =
        '你是由 Bytegush AI Player 打造的资深英语语法精析名师。请透彻剖析本句核心语法主干结构（主谓宾）、关键从句与高级修辞，点拨易错语法细节。';
    } else if (question === '总结全文') {
      systemPrompt =
        '你是由 Bytegush AI Player 打造的音视频全局提炼专家。请梳理整篇字幕的核心主旨大意、结构脉络大纲与最具学习价值的核心词汇/表达清单。';
    }

    const userContent = context
      ? `【字幕语境】：\n${context}\n\n【用户提问 / 需求】：\n${question}`
      : question;

    let responseContent = '';

    if (provider === 'claude') {
      // Anthropic Messages API
      const anthropicUrl = baseUrl.endsWith('/v1')
        ? `${baseUrl}/messages`
        : `${baseUrl}/v1/messages`;

      const upstreamResp = await fetch(anthropicUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
          temperature: 0.6,
          max_tokens: 2000,
        }),
      });

      if (!upstreamResp.ok) {
        const errText = await upstreamResp.text().catch(() => '');
        let errMsg = `Claude API 响应异常 (${upstreamResp.status})`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error?.message) errMsg = parsed.error.message;
        } catch {
          if (errText) errMsg = errText.slice(0, 200);
        }
        return NextResponse.json(
          {
            error: errMsg,
            response: `⚠️ **Claude 请求失败** (${upstreamResp.status})：\n\n> ${errMsg}\n\n请检查 API Key 或余额，亦可在「⚙️ API 设置」中切换其他模型。`,
          },
          { status: upstreamResp.status }
        );
      }

      const dsJson = await upstreamResp.json();
      responseContent = dsJson.content?.[0]?.text || '未能获取 Claude 响应。';
    } else {
      // Standard OpenAI-Compatible API
      const completionsUrl = baseUrl.endsWith('/chat/completions')
        ? baseUrl
        : `${baseUrl}/chat/completions`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };

      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://bytegush.com';
        headers['X-Title'] = 'Bytegush AI Player';
      }

      const upstreamResp = await fetch(completionsUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          temperature: 0.6,
          max_tokens: 2000,
        }),
      });

      if (!upstreamResp.ok) {
        const errText = await upstreamResp.text().catch(() => '');
        let errMsg = `模型接口响应异常 (${upstreamResp.status})`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.error?.message) errMsg = parsed.error.message;
          else if (parsed.message) errMsg = parsed.message;
        } catch {
          if (errText) errMsg = errText.slice(0, 200);
        }
        return NextResponse.json(
          {
            error: errMsg,
            response: `⚠️ **大模型请求失败** (${upstreamResp.status})：\n\n> ${errMsg}\n\n请点击右上角「⚙️ API 设置」检查 Key 与配置，或确认账户是否有可用额度。`,
          },
          { status: upstreamResp.status }
        );
      }

      const dsJson = await upstreamResp.json();
      responseContent = dsJson.choices?.[0]?.message?.content || '未能生成回复，请稍后再试。';
    }

    // Cache successful responses
    if (responseContent && AI_CACHE.size > 1000) {
      const firstKey = AI_CACHE.keys().next().value;
      if (firstKey) AI_CACHE.delete(firstKey);
    }
    if (responseContent) {
      AI_CACHE.set(cacheKey, responseContent);
    }

    return NextResponse.json({
      response: responseContent,
      answer: responseContent,
      model,
      provider,
      cached: false,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || 'Server error',
        response: `⚠️ 服务请求异常：${error?.message || '请检查网络连接或接口配置'}`,
      },
      { status: 500 }
    );
  }
}
