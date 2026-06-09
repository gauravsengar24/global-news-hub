import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const CACHE_FILE = path.join(DATA_DIR, 'articles.json');
const META_FILE = path.join(DATA_DIR, 'meta.json');

const CATEGORIES = ['markets', 'stocks', 'commodities', 'etf', 'mutual-funds', 'forex', 'economy', 'futures'];

const RSS_FEEDS = [
  // Global Market News
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_top_stories', region: 'us', category: 'markets' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_market_pulse', region: 'us', category: 'markets' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', region: 'us', category: 'markets' },
  // Stocks
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', region: 'us', category: 'stocks' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_stocks', region: 'us', category: 'stocks' },
  { url: 'https://finance.yahoo.com/news/rssindex', region: 'us', category: 'stocks' },
  // Commodities
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000100', region: 'us', category: 'commodities' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_commodities', region: 'us', category: 'commodities' },
  // ETFs
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_etfs', region: 'us', category: 'etf' },
  { url: 'https://www.etftrends.com/feed/', region: 'us', category: 'etf' },
  // Mutual Funds
  { url: 'https://www.morningstar.com/feed/mutual-fund-news', region: 'us', category: 'mutual-funds' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_funds', region: 'us', category: 'mutual-funds' },
  // Forex
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000671', region: 'us', category: 'forex' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_currencies', region: 'us', category: 'forex' },
  // Economy
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000115', region: 'us', category: 'economy' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_economy_calendar', region: 'us', category: 'economy' },
  // Futures
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_futures', region: 'us', category: 'futures' },
  // UK / Europe Markets
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000738', region: 'gb', category: 'markets' },
  { url: 'https://www.ft.com/rss/home', region: 'gb', category: 'markets' },
  { url: 'https://www.ft.com/rss/markets', region: 'gb', category: 'markets' },
  { url: 'https://www.ft.com/rss/companies/financials', region: 'gb', category: 'stocks' },
  { url: 'https://www.ft.com/rss/commodities', region: 'gb', category: 'commodities' },
  // India Markets
  { url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', region: 'in', category: 'markets' },
  { url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms', region: 'in', category: 'stocks' },
  { url: 'https://economictimes.indiatimes.com/markets/commodities/rssfeeds/2796838.cms', region: 'in', category: 'commodities' },
  { url: 'https://economictimes.indiatimes.com/mf/rssfeeds/2142137.cms', region: 'in', category: 'mutual-funds' },
  { url: 'https://economictimes.indiatimes.com/news/economy/rssfeeds/1378982.cms', region: 'in', category: 'economy' },
  // Japan Markets
  { url: 'https://www3.nhk.or.jp/rss/news/cat4.xml', region: 'jp', category: 'markets' },
  { url: 'https://www.japantimes.co.jp/feed/top-stories', region: 'jp', category: 'markets' },
  // China Markets
  { url: 'https://www.chinadaily.com.cn/rss/business_news.rss', region: 'cn', category: 'markets' },
  { url: 'https://www.chinadaily.com.cn/rss/world_news.rss', region: 'cn', category: 'economy' },
  // Australia Markets
  { url: 'https://www.abc.net.au/news/feed/51260/rss.xml', region: 'au', category: 'markets' },
  { url: 'https://www.abc.net.au/news/feed/51240/rss.xml', region: 'au', category: 'economy' },
  // Emerging Markets
  { url: 'https://www.ft.com/rss/emerging-markets', region: 'em', category: 'markets' },
  // General Business News (broader coverage)
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', region: 'gb', category: 'economy' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', region: 'gb', category: 'markets' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', region: 'us', category: 'economy' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml', region: 'us', category: 'economy' },
  { url: 'https://www.euronews.com/rss/business', region: 'gb', category: 'economy' },
  // Additional financial news
  { url: 'https://www.investing.com/rss/news.rss', region: 'us', category: 'markets' },
  { url: 'https://www.investing.com/rss/market_overview.rss', region: 'us', category: 'markets' },
  { url: 'https://www.investing.com/rss/commodities.rss', region: 'us', category: 'commodities' },
  { url: 'https://www.investing.com/rss/forex.rss', region: 'us', category: 'forex' },
  { url: 'https://www.investing.com/rss/etfs.rss', region: 'us', category: 'etf' },
  { url: 'https://www.investing.com/rss/mutual_funds.rss', region: 'us', category: 'mutual-funds' },
];

function parseFeedItem(item) {
  const title = item.title || '';
  const link = item.link || '';
  const description = item.contentSnippet || item.content || item.description || '';
  const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
  const image = item.enclosure?.url || item.image?.url || (item['media:content']?.['$']?.url) || '';
  const source = link ? new URL(link).hostname.replace('www.', '') : '';
  return {
    title: title.trim(),
    description: description.replace(/<[^>]+>/g, '').slice(0, 300).trim(),
    url: link,
    image,
    publishedAt: new Date(pubDate).toISOString(),
    source,
  };
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

function deduplicate(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = slugify(a.title).slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchRSS(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const items = parseRSSXml(xml);
    return items;
  } catch (err) {
    console.warn(`  RSS fail: ${url.slice(0, 60)}... - ${err.message}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function parseRSSXml(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const getTag = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return m ? m[1].trim() : '';
    };
    const getCDATA = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
      return m ? m[1].trim() : getTag(tag);
    };
    items.push({
      title: getCDATA('title'),
      link: getTag('link'),
      description: getCDATA('description'),
      pubDate: getTag('pubDate'),
    });
  }
  return items;
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  if (/\b(gold|silver|oil|crude|copper|commodity|natural gas|wheat|corn)\b/.test(lower)) return 'commodities';
  if (/\b(etf|exchange traded|ishares|vanguard.*etf)\b/.test(lower)) return 'etf';
  if (/\b(mutual fund|nav|folio|mf scheme)\b/.test(lower)) return 'mutual-funds';
  if (/\b(forex|currency|fx|usd|eur\/|dollar index|exchange rate)\b/.test(lower)) return 'forex';
  if (/\b(futures|options|derivative|f&o|expiry)\b/.test(lower)) return 'futures';
  if (/\b(stock|share|equity|bull run|bear|rally|nse|bse|nyse|nasdaq)\b/.test(lower)) return 'stocks';
  if (/\b(gdp|inflation|interest rate|fed|reserve bank|fiscal|monetary|unemployment)\b/.test(lower)) return 'economy';
  return 'markets';
}

async function main() {
  console.log('Fetching financial market news...\n');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  let articles = [];

  // Fetch RSS feeds
  console.log(`Fetching ${RSS_FEEDS.length} financial RSS feeds...`);
  const rssResults = await Promise.allSettled(RSS_FEEDS.map(f => fetchRSS(f.url)));

  rssResults.forEach((result, i) => {
    const feed = RSS_FEEDS[i];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      result.value.forEach(item => {
        articles.push({
          ...parseFeedItem(item),
          region: feed.region,
          category: feed.category,
        });
      });
    }
  });

  // Auto-detect categories for articles without explicit ones
  articles = articles.map(a => ({
    ...a,
    category: a.category || detectCategory(a.title + ' ' + a.description),
  }));

  // Deduplicate and sort
  articles = deduplicate(articles);
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Enrich with id
  articles = articles.map((a, i) => ({
    id: (slugify(a.title) || 'article-' + i).slice(0, 60) + '-' + i,
    ...a,
  }));

  console.log(`\nTotal unique articles: ${articles.length}`);

  // Fall back to cached data if fetch returns nothing
  if (articles.length === 0 && fs.existsSync(CACHE_FILE)) {
    const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    if (cached.length > 0) {
      console.log(`  Using cached data (${cached.length} articles)`);
      articles = cached;
    }
  }

  // Write data files
  const now = new Date().toISOString();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2));
  fs.writeFileSync(META_FILE, JSON.stringify({
    updatedAt: now, totalArticles: articles.length, buildDate: now,
  }));

  // Per-region files
  const regionCodes = ['us', 'gb', 'in', 'jp', 'cn', 'au', 'em'];
  for (const code of regionCodes) {
    const filtered = articles.filter(a => a.region === code);
    fs.writeFileSync(path.join(DATA_DIR, `region-${code}.json`), JSON.stringify(filtered, null, 2));
  }

  // Per-category files
  for (const cat of CATEGORIES) {
    const filtered = articles.filter(a => a.category === cat);
    fs.writeFileSync(path.join(DATA_DIR, `category-${cat}.json`), JSON.stringify(filtered, null, 2));
  }

  console.log('Market news data saved successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});