export const REGIONS = {
  us: { name: 'US Markets', flag: '🇺🇸', slug: 'us', keywords: 'NYSE NASDAQ S&P 500 Dow Jones Wall Street US stocks' },
  gb: { name: 'UK & Europe', flag: '🇪🇺', slug: 'gb', keywords: 'FTSE 100 DAX CAC 40 European stocks London' },
  in: { name: 'India Markets', flag: '🇮🇳', slug: 'in', keywords: 'NSE BSE Sensex Nifty 50 Indian stocks' },
  jp: { name: 'Japan Markets', flag: '🇯🇵', slug: 'jp', keywords: 'Nikkei 225 TOPIX Japanese stocks Tokyo' },
  cn: { name: 'China Markets', flag: '🇨🇳', slug: 'cn', keywords: 'Shanghai Composite Hang Seng Shenzhen China stocks' },
  au: { name: 'Australia Markets', flag: '🇦🇺', slug: 'au', keywords: 'ASX 200 Australian stocks Sydney' },
  em: { name: 'Emerging Markets', flag: '🌏', slug: 'em', keywords: 'emerging markets BRICS developing economies' },
};

export const CATEGORIES = [
  { id: 'markets', name: 'Market Overview' },
  { id: 'stocks', name: 'Stocks' },
  { id: 'commodities', name: 'Commodities' },
  { id: 'etf', name: 'ETFs' },
  { id: 'mutual-funds', name: 'Mutual Funds' },
  { id: 'forex', name: 'Forex' },
  { id: 'economy', name: 'Economy' },
  { id: 'futures', name: 'Futures & Options' },
];

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
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

export const MARKET_INDICES = [
  { name: 'S&P 500', region: 'us', ticker: 'SPX' },
  { name: 'Dow Jones', region: 'us', ticker: 'DJI' },
  { name: 'NASDAQ', region: 'us', ticker: 'IXIC' },
  { name: 'FTSE 100', region: 'gb', ticker: 'UKX' },
  { name: 'DAX', region: 'gb', ticker: 'DAX' },
  { name: 'CAC 40', region: 'gb', ticker: 'CAC' },
  { name: 'Sensex', region: 'in', ticker: 'SENSEX' },
  { name: 'Nifty 50', region: 'in', ticker: 'NIFTY' },
  { name: 'Nikkei 225', region: 'jp', ticker: 'NKY' },
  { name: 'Shanghai Comp', region: 'cn', ticker: 'SHCOMP' },
  { name: 'Hang Seng', region: 'cn', ticker: 'HSI' },
  { name: 'ASX 200', region: 'au', ticker: 'AS51' },
];