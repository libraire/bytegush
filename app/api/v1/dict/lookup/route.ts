import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface WordLookupResult {
  word: string;
  phonetic?: string;
  part_of_speech?: string;
  translation?: string;
  definition?: string;
  example?: string;
  cn_example?: string;
  image_url?: string | null;
}

// In-memory cache for ultra-fast response
const DICT_CACHE = new Map<string, WordLookupResult>();
const MAX_CACHE_SIZE = 5000;

const CORE_WORDS: Record<string, Partial<WordLookupResult>> = {
  a: { phonetic: '/ə/', part_of_speech: 'art.', translation: '一（个）；每一', definition: 'Used before a noun to mention one person or thing.' },
  an: { phonetic: '/æn/', part_of_speech: 'art.', translation: '一（个）（元音前）', definition: 'Used instead of "a" before vowel sounds.' },
  the: { phonetic: '/ðə/', part_of_speech: 'art.', translation: '这，那（定冠词）', definition: 'Denoting one or more people or things already mentioned.' },
  china: { phonetic: '/ˈtʃaɪnə/', part_of_speech: 'n.', translation: '中国；瓷器', definition: 'A country in East Asia; fine porcelain or ceramic ware.' },
  about: { phonetic: '/əˈbaʊt/', part_of_speech: 'prep., adv.', translation: '关于；大约；到处', definition: 'Concerning; on the subject of; approximately.' },
  after: { phonetic: '/ˈæftər/', part_of_speech: 'prep., conj.', translation: '在……之后', definition: 'Following in time or order.' },
  all: { phonetic: '/ɔːl/', part_of_speech: 'det., pron.', translation: '全部的；所有的', definition: 'The whole quantity or extent of.' },
  and: { phonetic: '/ænd/', part_of_speech: 'conj.', translation: '和，而且', definition: 'Used to connect words or clauses.' },
  as: { phonetic: '/æz/', part_of_speech: 'prep., conj.', translation: '作为；正如；当……时', definition: 'Used to indicate being in a specified state or role.' },
  at: { phonetic: '/æt/', part_of_speech: 'prep.', translation: '在；向', definition: 'Expressing location or arrival in a particular place.' },
  be: { phonetic: '/biː/', part_of_speech: 'v.', translation: '是；存在', definition: 'Exist; occur; have state.' },
  because: { phonetic: '/bɪˈkɒz/', part_of_speech: 'conj.', translation: '因为', definition: 'For the reason that; since.' },
  but: { phonetic: '/bʌt/', part_of_speech: 'conj., prep.', translation: '但是，可是；除了', definition: 'Used to introduce an added statement.' },
  by: { phonetic: '/baɪ/', part_of_speech: 'prep.', translation: '通过；被；在……旁边', definition: 'Identifying the agent performing an action; near to.' },
  can: { phonetic: '/kæn/', part_of_speech: 'modal v.', translation: '能，能够；可以', definition: 'Be able to; be permitted to.' },
  do: { phonetic: '/duː/', part_of_speech: 'v., aux.', translation: '做，干；助动词', definition: 'Perform an action, activity, or job.' },
  for: { phonetic: '/fɔːr/', part_of_speech: 'prep.', translation: '为了；给；代表', definition: 'Affecting, with connection to, or in respect of.' },
  from: { phonetic: '/frɒm/', part_of_speech: 'prep.', translation: '从；来自', definition: 'Indicating the point in space or time at which an event begins.' },
  have: { phonetic: '/hæv/', part_of_speech: 'v., aux.', translation: '有；拥有；经受', definition: 'Possess, own, or hold.' },
  he: { phonetic: '/hiː/', part_of_speech: 'pron.', translation: '他', definition: 'Used to refer to a man, boy, or male animal.' },
  in: { phonetic: '/ɪn/', part_of_speech: 'prep.', translation: '在……里；在……期间', definition: 'Expressing situation inside something.' },
  is: { phonetic: '/ɪz/', part_of_speech: 'v.', translation: '是（be的第三人称单数形式）', definition: 'Third person singular present of be.' },
  it: { phonetic: '/ɪt/', part_of_speech: 'pron.', translation: '它', definition: 'Used to refer to an object, action, or condition.' },
  leisure: { phonetic: '/ˈleʒ.ər/', part_of_speech: 'n.', translation: '空闲，闲暇；休闲', definition: 'Time free from work or duties.', example: 'Leisure became a standard feature of life.' },
  of: { phonetic: '/ɒv/', part_of_speech: 'prep.', translation: '……的；由……构成', definition: 'Expressing relationship between part and whole.' },
  on: { phonetic: '/ɒn/', part_of_speech: 'prep.', translation: '在……上；关于', definition: 'Physically in contact with and supported by a surface.' },
  that: { phonetic: '/ðæt/', part_of_speech: 'det., pron., conj.', translation: '那个；那；引导从句', definition: 'Used to identify a specific person or thing.' },
  this: { phonetic: '/ðɪs/', part_of_speech: 'det., pron.', translation: '这，这个', definition: 'Used to identify something close at hand.' },
  to: { phonetic: '/tuː/', part_of_speech: 'prep., particle', translation: '向，往；到；不定式符号', definition: 'Expressing motion in direction of.' },
  with: { phonetic: '/wɪð/', part_of_speech: 'prep.', translation: '和……一起；用；伴随', definition: 'Accompanied by; using as an instrument.' },
  you: { phonetic: '/juː/', part_of_speech: 'pron.', translation: '你，你们', definition: 'The person or people being addressed.' },
};

async function fetchWithTimeout(url: string, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function queryChineseTranslation(word: string): Promise<string> {
  try {
    // 1. Google Translate GTX
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(word)}`;
    const res = await fetchWithTimeout(gtxUrl, 2000);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0]) && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }
    }
  } catch {
    // ignore and try fallback
  }

  try {
    // 2. MyMemory fallback
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`;
    const res = await fetchWithTimeout(mmUrl, 2000);
    if (res.ok) {
      const data = await res.json();
      const txt = data?.responseData?.translatedText;
      if (txt && !txt.includes('MYMEMORY WARNING')) {
        return txt;
      }
    }
  } catch {
    // ignore
  }

  return '';
}

async function queryEnglishDefinition(word: string): Promise<{
  phonetic?: string;
  part_of_speech?: string;
  definition?: string;
  example?: string;
}> {
  try {
    const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await fetchWithTimeout(dictUrl, 2500);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        let phonetic = item.phonetic || '';
        if (!phonetic && Array.isArray(item.phonetics)) {
          const found = item.phonetics.find((p: any) => p.text);
          if (found) phonetic = found.text;
        }

        let pos = '';
        let def = '';
        let example = '';

        if (Array.isArray(item.meanings) && item.meanings.length > 0) {
          const m = item.meanings[0];
          pos = m.partOfSpeech || '';
          if (Array.isArray(m.definitions) && m.definitions.length > 0) {
            def = m.definitions[0].definition || '';
            example = m.definitions[0].example || '';
          }
        }

        return {
          phonetic: phonetic || undefined,
          part_of_speech: pos || undefined,
          definition: def || undefined,
          example: example || undefined,
        };
      }
    }
  } catch {
    // ignore
  }
  return {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const word = (searchParams.get('word') || '').trim();
  const cleanWord = word.replace(/[^a-zA-Z'-]/g, '').toLowerCase();

  if (!cleanWord) {
    return NextResponse.json({ error: 'word parameter required' }, { status: 400 });
  }

  // 1. Check in-memory cache
  if (DICT_CACHE.has(cleanWord)) {
    return NextResponse.json(DICT_CACHE.get(cleanWord), {
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    });
  }

  // 2. Check Core Words
  const core = CORE_WORDS[cleanWord];
  if (core && core.translation) {
    const result: WordLookupResult = {
      word: cleanWord,
      phonetic: core.phonetic || '',
      part_of_speech: core.part_of_speech || '',
      translation: core.translation,
      definition: core.definition || '',
      example: core.example || '',
      cn_example: core.cn_example || '',
      image_url: null,
    };
    DICT_CACHE.set(cleanWord, result);
    return NextResponse.json(result);
  }

  // 3. Parallel external lookup: Chinese translation + English definition
  const [translation, enDef] = await Promise.all([
    queryChineseTranslation(cleanWord),
    queryEnglishDefinition(cleanWord),
  ]);

  const result: WordLookupResult = {
    word: cleanWord,
    phonetic: enDef.phonetic || '',
    part_of_speech: enDef.part_of_speech || (core?.part_of_speech ?? 'word'),
    translation: translation || core?.translation || '暂无释义',
    definition: enDef.definition || core?.definition || `English vocabulary: ${cleanWord}`,
    example: enDef.example || core?.example || '',
    cn_example: core?.cn_example || '',
    image_url: null,
  };

  if (DICT_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = DICT_CACHE.keys().next().value;
    if (firstKey) DICT_CACHE.delete(firstKey);
  }
  DICT_CACHE.set(cleanWord, result);

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
  });
}
