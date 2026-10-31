import { GameWord, CefrLevel } from './types';

export const LEVEL_METADATA: Record<
  CefrLevel,
  { label: string; badge: string; color: string; desc: string }
> = {
  A1: {
    label: 'A1 · 启蒙入门',
    badge: '入门',
    color: 'from-blue-500 to-cyan-500 text-cyan-300 border-cyan-500/30',
    desc: '最常用的日常基础词汇，高频无阻力',
  },
  A2: {
    label: 'A2 · 初阶应用',
    badge: '初级',
    color: 'from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30',
    desc: '日常生活、工作环境的基础交流表达',
  },
  B1: {
    label: 'B1 · 进阶拓展',
    badge: '中级',
    color: 'from-amber-500 to-yellow-500 text-amber-300 border-amber-500/30',
    desc: '能够描述经历、观点与工作日常细节',
  },
  B2: {
    label: 'B2 · 高阶学术',
    badge: '高级',
    color: 'from-orange-500 to-rose-500 text-orange-300 border-orange-500/30',
    desc: '复杂文献、学术报告与抽象概念讨论',
  },
  C1: {
    label: 'C1 · 深度母语',
    badge: '精通',
    color: 'from-purple-500 to-pink-500 text-purple-300 border-purple-500/30',
    desc: '自然流利的母语级深度表达、精准修辞',
  },
  C2: {
    label: 'C2 · 殿堂大师',
    badge: '大师',
    color: 'from-rose-500 to-red-600 text-rose-300 border-rose-500/30',
    desc: '古典名著精萃、细微语境幽默与哲学词汇',
  },
};

export const WORD_BANK: GameWord[] = [
  // ================= A1 (Beginner) =================
  {
    id: 'w-a1-1',
    word: 'journey',
    phonetic: '/ˈdʒɜːni/',
    pos: 'n.',
    cn: '旅行；旅程',
    en: 'an act of traveling from one place to another',
    level: 'A1',
    levelNumber: 1,
    example: 'Life is a ______ rather than a destination.',
    exampleCn: '生活是一场旅程，而不是终点。',
    distractors: ['holiday', 'station', 'airport'],
  },
  {
    id: 'w-a1-2',
    word: 'create',
    phonetic: '/kriˈeɪt/',
    pos: 'v.',
    cn: '创造；创作',
    en: 'to bring something into existence',
    level: 'A1',
    levelNumber: 1,
    example: 'Artists use their imagination to ______ beauty.',
    exampleCn: '艺术家用他们的想象力创造美。',
    distractors: ['borrow', 'destroy', 'forget'],
  },
  {
    id: 'w-a1-3',
    word: 'simple',
    phonetic: '/ˈsɪmpl/',
    pos: 'adj.',
    cn: '简单的；朴素的',
    en: 'easily understood or done; presenting no difficulty',
    level: 'A1',
    levelNumber: 1,
    example: 'The solution turned out to be remarkably ______.',
    exampleCn: '解决方案结果异常简单。',
    distractors: ['complex', 'heavy', 'bitter'],
  },
  {
    id: 'w-a1-4',
    word: 'listen',
    phonetic: '/ˈlɪsn/',
    pos: 'v.',
    cn: '倾听；听从',
    en: 'give one’s attention to a sound',
    level: 'A1',
    levelNumber: 1,
    example: 'Good communicators always ______ carefully first.',
    exampleCn: '优秀的沟通者总是先仔细倾听。',
    distractors: ['speak', 'watch', 'write'],
  },
  {
    id: 'w-a1-5',
    word: 'breathe',
    phonetic: '/briːð/',
    pos: 'v.',
    cn: '呼吸；吐气',
    en: 'take air into the lungs and expel it',
    level: 'A1',
    levelNumber: 1,
    example: 'Take a deep breath and ______ slowly.',
    exampleCn: '深吸一口气，然后慢慢呼吸。',
    distractors: ['swallow', 'whisper', 'scream'],
  },

  // ================= A2 (Elementary) =================
  {
    id: 'w-a2-1',
    word: 'explore',
    phonetic: '/ɪkˈsplɔːr/',
    pos: 'v.',
    cn: '探索；探寻',
    en: 'travel through an unfamiliar area to learn about it',
    level: 'A2',
    levelNumber: 2,
    example: 'We decided to ______ the historic city on foot.',
    exampleCn: '我们决定徒步探索这座历史名城。',
    distractors: ['ignore', 'refuse', 'escape'],
  },
  {
    id: 'w-a2-2',
    word: 'habit',
    phonetic: '/ˈhæbɪt/',
    pos: 'n.',
    cn: '习惯；习性',
    en: 'a settled or regular tendency or practice',
    level: 'A2',
    levelNumber: 2,
    example: 'Reading every evening soon became a daily ______.',
    exampleCn: '每晚阅读很快成了一个日常习惯。',
    distractors: ['target', 'threat', 'excuse'],
  },
  {
    id: 'w-a2-3',
    word: 'patient',
    phonetic: '/ˈpeɪʃnt/',
    pos: 'adj.',
    cn: '有耐心的；能忍耐的',
    en: 'able to accept or tolerate delays or problems calmly',
    level: 'A2',
    levelNumber: 2,
    example: 'Learning a new skill requires you to be ______.',
    exampleCn: '学习新技能需要你有足够的耐心。',
    distractors: ['nervous', 'urgent', 'careless'],
  },
  {
    id: 'w-a2-4',
    word: 'connect',
    phonetic: '/kəˈnekt/',
    pos: 'v.',
    cn: '连接；沟通',
    en: 'bring together or into contact so that a real link is established',
    level: 'A2',
    levelNumber: 2,
    example: 'Books have the power to ______ people across centuries.',
    exampleCn: '书籍拥有跨越几个世纪连接人类的力量。',
    distractors: ['isolate', 'divide', 'separate'],
  },
  {
    id: 'w-a2-5',
    word: 'curious',
    phonetic: '/ˈkjʊəriəs/',
    pos: 'adj.',
    cn: '好奇的；求知欲强的',
    en: 'eager to know or learn something',
    level: 'A2',
    levelNumber: 2,
    example: 'A ______ mind is the foundation of lifelong learning.',
    exampleCn: '求知好奇的心是终身学习的基石。',
    distractors: ['boring', 'passive', 'silent'],
  },

  // ================= B1 (Intermediate) =================
  {
    id: 'w-b1-1',
    word: 'efficient',
    phonetic: '/ɪˈfɪʃnt/',
    pos: 'adj.',
    cn: '高效的；效率高的',
    en: 'achieving maximum productivity with minimum wasted effort',
    level: 'B1',
    levelNumber: 3,
    example: 'Automated pipelines make deployment remarkably ______.',
    exampleCn: '自动化流水线让发布部署变得异常高效。',
    distractors: ['sluggish', 'awkward', 'fragile'],
  },
  {
    id: 'w-b1-2',
    word: 'perspective',
    phonetic: '/pəˈspektɪv/',
    pos: 'n.',
    cn: '视角；洞察力',
    en: 'a particular attitude toward or way of regarding something',
    level: 'B1',
    levelNumber: 3,
    example: 'Living abroad gave her a broader ______ on life.',
    exampleCn: '在海外生活的经历赋予了她更广阔的人生视角。',
    distractors: ['repetition', 'dimension', 'obstacle'],
  },
  {
    id: 'w-b1-3',
    word: 'resilient',
    phonetic: '/rɪˈzɪliənt/',
    pos: 'adj.',
    cn: '有韧性的；适应力强的',
    en: 'able to withstand or recover quickly from difficult conditions',
    level: 'B1',
    levelNumber: 3,
    example: 'Independent creators need to be mentally ______.',
    exampleCn: '独立创作者需要拥有强大的心理韧性。',
    distractors: ['vulnerable', 'stubborn', 'hesitant'],
  },
  {
    id: 'w-b1-4',
    word: 'discipline',
    phonetic: '/ˈdɪsəplɪn/',
    pos: 'n.',
    cn: '自律；纪律',
    en: 'the practice of training oneself to obey rules or codes of behavior',
    level: 'B1',
    levelNumber: 3,
    example: 'Daily coding ______ turns novices into experts.',
    exampleCn: '每日坚持编写代码的自律让新手蜕变为专家。',
    distractors: ['coincidence', 'distraction', 'compromise'],
  },
  {
    id: 'w-b1-5',
    word: 'clarity',
    phonetic: '/ˈklærəti/',
    pos: 'n.',
    cn: '清晰；明确',
    en: 'the quality of being coherent, intelligible, or transparent',
    level: 'B1',
    levelNumber: 3,
    example: 'Writing down your thoughts brings incredible ______.',
    exampleCn: '将思绪写在纸上会带来意想不到的清晰。',
    distractors: ['illusion', 'confusion', 'mystery'],
  },

  // ================= B2 (Upper-Intermediate) =================
  {
    id: 'w-b2-1',
    word: 'articulate',
    phonetic: '/ɑːˈtɪkjuleɪt/',
    pos: 'v. / adj.',
    cn: '清晰表达；能言善辩的',
    en: 'expressing oneself readily, clearly, and effectively',
    level: 'B2',
    levelNumber: 4,
    example: 'She was able to ______ the core problem in two minutes.',
    exampleCn: '她能够在两分钟内将核心症结清晰表达出来。',
    distractors: ['mumble', 'hesitate', 'complicate'],
  },
  {
    id: 'w-b2-2',
    word: 'iterate',
    phonetic: '/ˈɪtəreɪt/',
    pos: 'v.',
    cn: '迭代；反复优化',
    en: 'perform repeatedly in order to approach a desired result',
    level: 'B2',
    levelNumber: 4,
    example: 'Launch early and ______ based on actual user feedback.',
    exampleCn: '尽早发布，并根据真实用户反馈不断迭代。',
    distractors: ['stagnate', 'conclude', 'abandon'],
  },
  {
    id: 'w-b2-3',
    word: 'coherent',
    phonetic: '/kəʊˈhɪərənt/',
    pos: 'adj.',
    cn: '连贯的；条理分明的',
    en: 'logical and consistent, forming a unified whole',
    level: 'B2',
    levelNumber: 4,
    example: 'The architecture doc presented a ______ design strategy.',
    exampleCn: '该架构文档呈现了一套条理极为分明的设计策略。',
    distractors: ['disjointed', 'superficial', 'redundant'],
  },
  {
    id: 'w-b2-4',
    word: 'subtle',
    phonetic: '/ˈsʌtl/',
    pos: 'adj.',
    cn: '微妙的；敏锐的',
    en: 'so delicate or precise as to be difficult to analyze or describe',
    level: 'B2',
    levelNumber: 4,
    example: 'There was a ______ nuance in the native speaker’s tone.',
    exampleCn: '母语者的声调中有一种微妙入微的语气差别。',
    distractors: ['obvious', 'coarse', 'vulgar'],
  },
  {
    id: 'w-b2-5',
    word: 'tangible',
    phonetic: '/ˈtændʒəbl/',
    pos: 'adj.',
    cn: '有形的；可感知的',
    en: 'perceptible by touch; clear and definite; real',
    level: 'B2',
    levelNumber: 4,
    example: 'The project produced ______ improvements in performance.',
    exampleCn: '该项目在系统性能上带来了实打实可感知的提升。',
    distractors: ['imaginary', 'elusive', 'abstract'],
  },

  // ================= C1 (Advanced) =================
  {
    id: 'w-c1-1',
    word: 'eloquent',
    phonetic: '/ˈeləkwənt/',
    pos: 'adj.',
    cn: '雄辩的；生动感人的',
    en: 'fluent or persuasive in speaking or writing',
    level: 'C1',
    levelNumber: 5,
    example: 'His keynote was an ______ defense of digital privacy.',
    exampleCn: '他的主旨演讲是对数字隐私的一次雄辩而有力的辩护。',
    distractors: ['incoherent', 'clumsy', 'monotonous'],
  },
  {
    id: 'w-c1-2',
    word: 'lucid',
    phonetic: '/ˈluːsɪd/',
    pos: 'adj.',
    cn: '头脑清晰的；明晰透彻的',
    en: 'expressed clearly; easy to understand; fully cognizant',
    level: 'C1',
    levelNumber: 5,
    example: 'He gave a ______ explanation of quantum cryptography.',
    exampleCn: '他对量子密码学做出了极其明晰透彻的讲解。',
    distractors: ['obscure', 'murky', 'baffling'],
  },
  {
    id: 'w-c1-3',
    word: 'meticulous',
    phonetic: '/məˈtɪkjələs/',
    pos: 'adj.',
    cn: '一丝不苟的；极度审慎的',
    en: 'showing great attention to detail; very careful and precise',
    level: 'C1',
    levelNumber: 5,
    example: 'The database schema was designed with ______ precision.',
    exampleCn: '该数据库模型以极其严谨、一丝不苟的精度设计而成。',
    distractors: ['careless', 'hasty', 'sloppy'],
  },
  {
    id: 'w-c1-4',
    word: 'ephemeral',
    phonetic: '/ɪˈfemərəl/',
    pos: 'adj.',
    cn: '转瞬即逝的；短暂的',
    en: 'lasting for a very short time',
    level: 'C1',
    levelNumber: 5,
    example: 'Trends on social media are notoriously ______.',
    exampleCn: '社交媒体上的潮流往往是转瞬即逝的。',
    distractors: ['perpetual', 'enduring', 'immutable'],
  },
  {
    id: 'w-c1-5',
    word: 'serendipity',
    phonetic: '/ˌserənˈdɪpəti/',
    pos: 'n.',
    cn: '意外奇遇；机缘巧合',
    en: 'the occurrence of events by chance in a happy or beneficial way',
    level: 'C1',
    levelNumber: 5,
    example: 'A stroke of pure ______ led to their breakthrough discovery.',
    exampleCn: '一次绝妙的机缘巧合促成了他们的突破性发现。',
    distractors: ['inevitability', 'catastrophe', 'premeditation'],
  },

  // ================= C2 (Mastery) =================
  {
    id: 'w-c2-1',
    word: 'ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    pos: 'adj.',
    cn: '无处不在的；俯拾皆是的',
    en: 'present, appearing, or found everywhere',
    level: 'C2',
    levelNumber: 6,
    example: 'Smartphones have become ______ in modern civilization.',
    exampleCn: '智能手机在现代人类文明中已变得无处不在。',
    distractors: ['scarce', 'isolated', 'sporadic'],
  },
  {
    id: 'w-c2-2',
    word: 'quintessential',
    phonetic: '/ˌkwɪntɪˈsenʃl/',
    pos: 'adj.',
    cn: '最典型的；最具代表性的',
    en: 'representing the most perfect or typical example of a quality',
    level: 'C2',
    levelNumber: 6,
    example: 'It was the ______ example of minimalist software craftsmanship.',
    exampleCn: '这是极简软件手作工艺中最具代表性的典范之作。',
    distractors: ['mediocre', 'peripheral', 'anomalous'],
  },
  {
    id: 'w-c2-3',
    word: 'ineffable',
    phonetic: '/ɪnˈefəbl/',
    pos: 'adj.',
    cn: '妙不可言的；难以言表的',
    en: 'too great or extreme to be expressed or described in words',
    level: 'C2',
    levelNumber: 6,
    example: 'The mountain sunrise evoked an ______ sense of peace.',
    exampleCn: '山顶的日出唤起了一种难以言表的宁静。',
    distractors: ['banal', 'pedestrian', 'trivial'],
  },
  {
    id: 'w-c2-4',
    word: 'cacophony',
    phonetic: '/kəˈkɒfəni/',
    pos: 'n.',
    cn: '刺耳嘈杂的声音；不和谐音',
    en: 'a harsh, discordant mixture of sounds',
    level: 'C2',
    levelNumber: 6,
    example: 'The peaceful dawn was shattered by the ______ of traffic.',
    exampleCn: '宁静的破晓被车流刺耳喧嚣的嘈杂声打破。',
    distractors: ['symphony', 'harmony', 'cadence'],
  },
  {
    id: 'w-c2-5',
    word: 'perspicacity',
    phonetic: '/ˌpɜːspɪˈkæsəti/',
    pos: 'n.',
    cn: '洞察力；敏锐的辨别力',
    en: 'the quality of having a ready insight into things; shrewdness',
    level: 'C2',
    levelNumber: 6,
    example: 'His technical ______ anticipated the shift to local-first apps.',
    exampleCn: '他敏锐的技术洞察力早已预见到了本地优先应用的浪潮。',
    distractors: ['blindness', 'folly', 'naivety'],
  },
];

/**
 * 根据连击数自适应计算当前应该出的单词难度
 */
export function getAdaptiveLevel(streak: number): CefrLevel {
  if (streak < 3) return 'A1';
  if (streak < 6) return 'A2';
  if (streak < 10) return 'B1';
  if (streak < 15) return 'B2';
  if (streak < 22) return 'C1';
  return 'C2';
}

/**
 * 根据连击数自适应计算当前推荐的 CEFR 难度级别
 */
export function getLevelForStreak(streak: number): CefrLevel {
  if (streak < 3) return 'A1';
  if (streak < 6) return 'A2';
  if (streak < 10) return 'B1';
  if (streak < 15) return 'B2';
  if (streak < 21) return 'C1';
  return 'C2';
}

/**
 * 获取当前自适应连击进阶的下一个等级目标与进度
 */
export function getStreakProgress(streak: number): {
  currentTier: CefrLevel;
  nextTier: CefrLevel | null;
  neededForNext: number;
  progressPercent: number;
} {
  if (streak < 3) {
    return {
      currentTier: 'A1',
      nextTier: 'A2',
      neededForNext: 3 - streak,
      progressPercent: (streak / 3) * 100,
    };
  }
  if (streak < 6) {
    return {
      currentTier: 'A2',
      nextTier: 'B1',
      neededForNext: 6 - streak,
      progressPercent: ((streak - 3) / 3) * 100,
    };
  }
  if (streak < 10) {
    return {
      currentTier: 'B1',
      nextTier: 'B2',
      neededForNext: 10 - streak,
      progressPercent: ((streak - 6) / 4) * 100,
    };
  }
  if (streak < 15) {
    return {
      currentTier: 'B2',
      nextTier: 'C1',
      neededForNext: 15 - streak,
      progressPercent: ((streak - 10) / 5) * 100,
    };
  }
  if (streak < 21) {
    return {
      currentTier: 'C1',
      nextTier: 'C2',
      neededForNext: 21 - streak,
      progressPercent: ((streak - 15) / 6) * 100,
    };
  }
  return {
    currentTier: 'C2',
    nextTier: null,
    neededForNext: 0,
    progressPercent: 100,
  };
}

/**
 * 获取随机单词（可指定难度级别）
 */
export function getRandomWord(level?: CefrLevel, excludeWordId?: string): GameWord {
  let pool = WORD_BANK;
  if (level) {
    const levelFiltered = pool.filter((w) => w.level === level);
    if (levelFiltered.length > 0) {
      pool = levelFiltered;
    }
  }
  if (excludeWordId && pool.length > 1) {
    pool = pool.filter((w) => w.id !== excludeWordId);
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

