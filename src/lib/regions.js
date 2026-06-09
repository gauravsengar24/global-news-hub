export const REGIONS = {
  us: { name: 'US Markets', flag: '🇺🇸', slug: 'us', keywords: 'NYSE NASDAQ S&P 500 Dow Jones', short: 'US' },
  gb: { name: 'UK & Europe', flag: '🇪🇺', slug: 'gb', keywords: 'FTSE 100 DAX CAC 40 European stocks', short: 'EU' },
  in: { name: 'India Markets', flag: '🇮🇳', slug: 'in', keywords: 'NSE BSE Sensex Nifty 50', short: 'IN' },
  jp: { name: 'Japan Markets', flag: '🇯🇵', slug: 'jp', keywords: 'Nikkei 225 TOPIX Japanese stocks', short: 'JP' },
  cn: { name: 'China Markets', flag: '🇨🇳', slug: 'cn', keywords: 'Shanghai Composite Hang Seng', short: 'CN' },
  au: { name: 'Australia Markets', flag: '🇦🇺', slug: 'au', keywords: 'ASX 200 Australian stocks', short: 'AU' },
  em: { name: 'Emerging Markets', flag: '🌏', slug: 'em', keywords: 'emerging markets BRICS', short: 'EM' },
};

export const CATEGORIES = [
  { id: 'markets', name: 'Market Overview', icon: '📊' },
  { id: 'stocks', name: 'Stocks', icon: '🏢' },
  { id: 'commodities', name: 'Commodities', icon: '🛢️' },
  { id: 'etf', name: 'ETFs', icon: '📦' },
  { id: 'mutual-funds', name: 'Mutual Funds', icon: '💰' },
  { id: 'forex', name: 'Forex', icon: '💱' },
  { id: 'economy', name: 'Economy', icon: '📈' },
  { id: 'futures', name: 'Futures & Options', icon: '📋' },
];

export const MARKET_INDICES = [
  { name: 'S&P 500', ticker: 'SPX', change: '+0.84%', value: '5,432.15', up: true, region: 'us' },
  { name: 'Dow Jones', ticker: 'DJI', change: '+0.65%', value: '38,987.42', up: true, region: 'us' },
  { name: 'NASDAQ', ticker: 'IXIC', change: '+1.22%', value: '17,145.63', up: true, region: 'us' },
  { name: 'FTSE 100', ticker: 'UKX', change: '-0.32%', value: '8,214.56', up: false, region: 'gb' },
  { name: 'DAX', ticker: 'DAX', change: '+0.47%', value: '18,325.78', up: true, region: 'gb' },
  { name: 'Nifty 50', ticker: 'NIFTY', change: '+0.92%', value: '25,012.30', up: true, region: 'in' },
  { name: 'Nikkei 225', ticker: 'NKY', change: '-0.18%', value: '38,845.60', up: false, region: 'jp' },
  { name: 'Hang Seng', ticker: 'HSI', change: '+1.45%', value: '18,234.90', up: true, region: 'cn' },
  { name: 'ASX 200', ticker: 'AS51', change: '+0.33%', value: '7,845.20', up: true, region: 'au' },
  { name: 'Gold', ticker: 'GC=F', change: '+0.52%', value: '$2,415.30', up: true, region: 'us' },
  { name: 'Crude Oil', ticker: 'CL=F', change: '-1.15%', value: '$78.42', up: false, region: 'us' },
  { name: 'Bitcoin', ticker: 'BTC-USD', change: '+2.34%', value: '$68,432', up: true, region: 'us' },
];

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function timeAgo(dateStr) {
  return formatDate(dateStr);
}