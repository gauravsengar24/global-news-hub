export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  region: string;
  category: string;
}

export interface RegionInfo {
  name: string;
  flag: string;
  slug: string;
  keywords: string;
}

export interface SiteMeta {
  updatedAt: string;
  totalArticles: number;
  buildDate: string;
}