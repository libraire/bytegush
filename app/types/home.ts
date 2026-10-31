export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Open Source';
export type PlatformType = 'Web' | 'Mac' | 'Windows' | 'iOS' | 'Android' | 'Chrome';

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  verdict: string; // 核心推荐理由 / 评测结论
  category: 'all' | 'ai' | 'dev' | 'productivity' | 'learning' | 'design' | 'lab';
  categoryLabel?: string;
  iconName?: string;
  emoji?: string;
  color?: string;
  websiteUrl: string;
  githubUrl?: string;
  platforms: PlatformType[];
  pricing: PricingType;
  rating?: number; // 评测评分，例如 9.5
  badge?: string; // 标签，如 "编辑推荐", "装机必备", "自研精选"
  isOriginal?: boolean; // 是否为 Bytegush 自研
  reviewSlug?: string; // 关联的评测或教学文章路径
  highlights?: string[]; // 核心亮点列表
}

export interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  type: 'review' | 'tutorial' | 'workflow';
  typeLabel: string;
  summary: string;
  coverImage?: string;
  readTime: string;
  publishedAt: string;
  featuredTools: string[];
}

export interface WorkflowTool {
  name: string;
  role: string;
  websiteUrl?: string;
  isOriginal?: boolean;
}

export interface WorkflowStack {
  id: string;
  title: string;
  summary: string;
  targetAudience: string;
  tools: WorkflowTool[];
  guideSlug?: string;
}
