import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const META_FILE = path.join(DATA_DIR, 'meta.json');

const SITE_URL = process.env.SITE_URL || 'https://gauravsengar24.github.io/global-news-hub';
const SITE_NAME = 'MarketPulse';
const SITE_DESC = 'Real-time financial market news covering stocks, commodities, ETFs, mutual funds, forex, and global economic impact';
const REGIONS = ['us', 'gb', 'in', 'jp', 'cn', 'au', 'em'];
const CATEGORIES = ['markets', 'stocks', 'commodities', 'etf', 'mutual-funds', 'forex', 'economy', 'futures'];

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateFiles() {
  let articles = [];
  let meta = { updatedAt: new Date().toISOString() };
  try {
    articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
    meta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
  } catch {
    // Use defaults
  }

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // RSS Feed
  const items = articles.slice(0, 50).map(a => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${escapeXml(a.url)}</link>
    <description>${escapeXml(a.description)}</description>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    <guid isPermaLink="false">${escapeXml(a.id || a.url)}</guid>
    <source>${escapeXml(a.source)}</source>
    <category>${escapeXml(a.category)}</category>
  </item>`).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME} - Financial Markets News</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml);

  // Sitemap
  const lastmod = new Date(meta.updatedAt).toISOString().split('T')[0];
  const sitemapUrls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'hourly' },
    ...REGIONS.map(r => ({ loc: `${SITE_URL}/region/${r}`, priority: '0.9', changefreq: 'hourly' })),
    ...CATEGORIES.map(c => ({ loc: `${SITE_URL}/category/${c}`, priority: '0.8', changefreq: 'hourly' })),
  ];
  sitemapUrls.push({ loc: `${SITE_URL}/rss.xml`, priority: '0.7', changefreq: 'hourly' });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  console.log('RSS feed + sitemap written to public/');
}

generateFiles();
