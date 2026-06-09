import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const CACHE_FILE = path.join(DATA_DIR, 'articles.json');
const META_FILE = path.join(DATA_DIR, 'meta.json');

const REGIONS = {
  us: 'United States',
  gb: 'United Kingdom',
  in: 'India',
  jp: 'Japan',
  cn: 'China',
  au: 'Australia',
  eu: 'Europe',
};

const CATEGORIES = ['top', 'world', 'technology', 'business', 'sports',
  'science', 'health', 'entertainment'];

// RSS feed sources by region and category (free, no API key needed)
const RSS_FEEDS = [
  // Global/International
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', region: 'gb', category: 'top' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', region: 'gb', category: 'world' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', region: 'gb', category: 'technology' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', region: 'gb', category: 'business' },
  { url: 'https://feeds.bbci.co.uk/news/sports/rss.xml', region: 'gb', category: 'sports' },
  { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', region: 'gb', category: 'health' },
  { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', region: 'gb', category: 'entertainment' },
  { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', region: 'gb', category: 'science' },
  // Reuters
  { url: 'https://www.reutersagency.com/feed/', region: 'us', category: 'top' },
  // US
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', region: 'us', category: 'top' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', region: 'us', category: 'world' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', region: 'us', category: 'technology' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', region: 'us', category: 'business' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', region: 'us', category: 'sports' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml', region: 'us', category: 'science' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', region: 'us', category: 'health' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml', region: 'us', category: 'entertainment' },
  { url: 'https://feeds.npr.org/1001/rss.xml', region: 'us', category: 'top' },
  { url: 'https://feeds.npr.org/1004/rss.xml', region: 'us', category: 'world' },
  // Canada (also North America)
  { url: 'https://www.cbc.ca/cmlink/rss-topstories', region: 'us', category: 'top' },
  { url: 'https://www.cbc.ca/cmlink/rss-world', region: 'us', category: 'world' },
  // India
  { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', region: 'in', category: 'top' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms', region: 'in', category: 'world' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms', region: 'in', category: 'technology' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1898055.cms', region: 'in', category: 'business' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms', region: 'in', category: 'sports' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/3908999.cms', region: 'in', category: 'entertainment' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/2647163.cms', region: 'in', category: 'science' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/2127026318.cms', region: 'in', category: 'health' },
  { url: 'https://www.thehindu.com/feeder/default.rss', region: 'in', category: 'top' },
  // Japan
  { url: 'https://www3.nhk.or.jp/rss/news/cat0.xml', region: 'jp', category: 'top' },
  { url: 'https://www3.nhk.or.jp/rss/news/cat3.xml', region: 'jp', category: 'world' },
  { url: 'https://www3.nhk.or.jp/rss/news/cat6.xml', region: 'jp', category: 'technology' },
  { url: 'https://www3.nhk.or.jp/rss/news/cat4.xml', region: 'jp', category: 'business' },
  { url: 'https://www3.nhk.or.jp/rss/news/cat5.xml', region: 'jp', category: 'sports' },
  { url: 'https://www3.nhk.or.jp/rss/news/cat7.xml', region: 'jp', category: 'entertainment' },
  // China
  { url: 'https://www.chinadaily.com.cn/rss/top_news.rss', region: 'cn', category: 'top' },
  { url: 'https://www.chinadaily.com.cn/rss/world_news.rss', region: 'cn', category: 'world' },
  { url: 'https://www.chinadaily.com.cn/rss/business_news.rss', region: 'cn', category: 'business' },
  { url: 'https://www.chinadaily.com.cn/rss/tech_news.rss', region: 'cn', category: 'technology' },
  { url: 'https://www.chinadaily.com.cn/rss/sports_news.rss', region: 'cn', category: 'sports' },
  { url: 'https://www.chinadaily.com.cn/rss/culture_news.rss', region: 'cn', category: 'entertainment' },
  // Australia
  { url: 'https://www.abc.net.au/news/feed/51120/rss.xml', region: 'au', category: 'top' },
  { url: 'https://www.abc.net.au/news/feed/51240/rss.xml', region: 'au', category: 'world' },
  { url: 'https://www.abc.net.au/news/feed/86110/rss.xml', region: 'au', category: 'technology' },
  { url: 'https://www.abc.net.au/news/feed/51260/rss.xml', region: 'au', category: 'business' },
  { url: 'https://www.abc.net.au/news/feed/51280/rss.xml', region: 'au', category: 'sports' },
  { url: 'https://www.abc.net.au/news/feed/51340/rss.xml', region: 'au', category: 'science' },
  { url: 'https://www.abc.net.au/news/feed/51330/rss.xml', region: 'au', category: 'health' },
  { url: 'https://www.abc.net.au/news/feed/51320/rss.xml', region: 'au', category: 'entertainment' },
  // Europe / EU
  { url: 'https://www.euronews.com/rss', region: 'eu', category: 'top' },
  { url: 'https://www.euronews.com/rss/world', region: 'eu', category: 'world' },
  { url: 'https://www.euronews.com/rss/next', region: 'eu', category: 'technology' },
  { url: 'https://www.euronews.com/rss/business', region: 'eu', category: 'business' },
  { url: 'https://www.euronews.com/rss/sport', region: 'eu', category: 'sports' },
  { url: 'https://www.euronews.com/rss/culture', region: 'eu', category: 'entertainment' },
  { url: 'https://www.euronews.com/rss/health', region: 'eu', category: 'health' },
  { url: 'https://www.euronews.com/rss/sci-tech', region: 'eu', category: 'science' },
  // France
  { url: 'https://www.france24.com/en/rss', region: 'eu', category: 'top' },
  // Germany
  { url: 'https://rss.dw.com/rdf/rss-en-top', region: 'eu', category: 'top' },
  { url: 'https://rss.dw.com/rdf/rss-en-world', region: 'eu', category: 'world' },
  { url: 'https://rss.dw.com/rdf/rss-en-science', region: 'eu', category: 'science' },
  { url: 'https://rss.dw.com/rdf/rss-en-business', region: 'eu', category: 'business' },
  { url: 'https://rss.dw.com/rdf/rss-en-sports', region: 'eu', category: 'sports' },
  { url: 'https://rss.dw.com/rdf/rss-en-cul', region: 'eu', category: 'entertainment' },
  // Al Jazeera (Qatar, good for Middle East + World)
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'eu', category: 'world' },
  // Additional science/tech
  { url: 'https://www.sciencedaily.com/rss/all.xml', region: 'us', category: 'science' },
  { url: 'https://rss.techcrunch.com/feed', region: 'us', category: 'technology' },
];

function parseFeedItem(item) {
  const title = item.title || '';
  const link = item.link || '';
  const description = item.contentSnippet || item.content || item.description || '';
  const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
  const image = item.enclosure?.url || item.image?.url ||
    (item['media:content']?.['$']?.url) || '';
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
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
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

async function fetchRSS(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const xml = await resp.text();
    const items = parseRSSXml(xml);
    return items;
  } catch (err) {
    console.warn(`  RSS failed: ${url} - ${err.message}`);
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
      content: getTag('content:encoded'),
    });
  }
  return items;
}

async function fetchNewsAPI() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) { console.log('  NewsAPI: no key'); return []; }

  const all = [];
  for (const [code] of Object.entries(REGIONS)) {
    try {
      const resp = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${code}&pageSize=20&apiKey=${apiKey}`
      );
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data.articles) {
        all.push(...data.articles.map(a => ({
          title: a.title || '',
          description: (a.description || '').slice(0, 300),
          url: a.url || '',
          image: a.urlToImage || '',
          publishedAt: a.publishedAt || new Date().toISOString(),
          source: a.source?.name || '',
          region: code,
          category: 'top',
        })));
      }
    } catch (e) {
      console.warn(`  NewsAPI ${code}: ${e.message}`);
    }
  }
  console.log(`  NewsAPI: ${all.length} articles`);
  return all;
}

async function fetchGNews() {
  const apiKey = process.env.GNEWS_KEY;
  if (!apiKey) { console.log('  GNews: no key'); return []; }

  const all = [];
  for (const [code] of Object.entries(REGIONS)) {
    try {
      const resp = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=${code}&max=10&apikey=${apiKey}`
      );
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data.articles) {
        all.push(...data.articles.map(a => ({
          title: a.title || '',
          description: (a.description || '').slice(0, 300),
          url: a.url || '',
          image: a.image || '',
          publishedAt: a.publishedAt || new Date().toISOString(),
          source: a.source?.name || a.source || '',
          region: code,
          category: 'top',
        })));
      }
    } catch (e) {
      console.warn(`  GNews ${code}: ${e.message}`);
    }
  }
  console.log(`  GNews: ${all.length} articles`);
  return all;
}

function getRssCategory(url) {
  const feed = RSS_FEEDS.find(f => f.url === url);
  return feed ? feed.category : 'top';
}

function getRssRegion(url) {
  const feed = RSS_FEEDS.find(f => f.url === url);
  return feed ? feed.region : 'us';
}

async function main() {
  console.log('Fetching news...\n');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 1. Try APIs (if keys available)
  console.log('1. Fetching from APIs...');
  let articles = [];

  try {
    const apiArticles = await fetchNewsAPI();
    articles.push(...apiArticles);
  } catch (e) {
    console.warn(`  NewsAPI error: ${e.message}`);
  }

  try {
    const gnewsArticles = await fetchGNews();
    articles.push(...gnewsArticles);
  } catch (e) {
    console.warn(`  GNews error: ${e.message}`);
  }

  // 2. RSS feeds (always works, no API key needed)
  console.log('\n2. Fetching RSS feeds...');
  const rssResults = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchRSS(feed.url))
  );

  rssResults.forEach((result, i) => {
    const url = RSS_FEEDS[i].url;
    const region = getRssRegion(url);
    const category = getRssCategory(url);
    if (result.status === 'fulfilled' && result.value.length > 0) {
      result.value.forEach(item => {
        articles.push({
          ...parseFeedItem(item),
          region,
          category,
        });
      });
    }
  });

  console.log(`  Total RSS items: ${articles.length - (articles.filter(a => a.region).length)}`);

  // 3. Deduplicate and sort
  articles = deduplicate(articles);
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // 4. Enrich with slug and id
  articles = articles.map((a, i) => ({
    id: slugify(a.title).slice(0, 60) + '-' + i,
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

  // 5. Write data files
  const now = new Date().toISOString();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(articles, null, 2));
  fs.writeFileSync(META_FILE, JSON.stringify({
    updatedAt: now,
    totalArticles: articles.length,
    buildDate: now,
  }));

  // 6. Write per-region data files
  for (const [code, name] of Object.entries(REGIONS)) {
    const regionArticles = articles.filter(a =>
      a.region === code || a.source?.toLowerCase().includes(REGIONS[code]?.toLowerCase() || code)
    );
    const file = path.join(DATA_DIR, `region-${code}.json`);
    fs.writeFileSync(file, JSON.stringify(regionArticles, null, 2));
  }

  // 7. Write per-category data files
  for (const cat of CATEGORIES) {
    const catArticles = articles.filter(a => a.category === cat);
    const file = path.join(DATA_DIR, `category-${cat}.json`);
    fs.writeFileSync(file, JSON.stringify(catArticles, null, 2));
  }

  console.log('News data saved successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
