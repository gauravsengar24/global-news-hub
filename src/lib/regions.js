export const REGIONS = {
  us: { name: 'United States', flag: '🇺🇸', slug: 'us', keywords: 'US news, America, United States' },
  gb: { name: 'United Kingdom', flag: '🇬🇧', slug: 'gb', keywords: 'UK news, Britain, London' },
  in: { name: 'India', flag: '🇮🇳', slug: 'in', keywords: 'India news, Mumbai, Delhi' },
  jp: { name: 'Japan', flag: '🇯🇵', slug: 'jp', keywords: 'Japan news, Tokyo, Asia' },
  cn: { name: 'China', flag: '🇨🇳', slug: 'cn', keywords: 'China news, Beijing, Shanghai' },
  au: { name: 'Australia', flag: '🇦🇺', slug: 'au', keywords: 'Australia news, Sydney' },
  eu: { name: 'Europe', flag: '🇪🇺', slug: 'eu', keywords: 'Europe news, EU, European Union' },
};

export const CATEGORIES = [
  { id: 'top', name: 'Top Stories' },
  { id: 'world', name: 'World' },
  { id: 'technology', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'sports', name: 'Sports' },
  { id: 'science', name: 'Science' },
  { id: 'health', name: 'Health' },
  { id: 'entertainment', name: 'Entertainment' },
];

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}