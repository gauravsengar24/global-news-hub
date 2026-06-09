import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const META_FILE = path.join(DATA_DIR, 'meta.json');

const SITE_URL = 'https://global-news.pages.dev';
const REGIONS = ['us', 'gb', 'in', 'jp', 'cn', 'au', 'eu'];
const CATEGORIES = ['top', 'world', 'technology', 'business', 'sports', 'science', 'health', 'entertainment'];

function generateSitemap() {
  const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
  const lastmod = new Date(meta.updatedAt).toISOString().split('T')[0];

  const urls = [];

  // Homepage
  urls.push({ loc: SITE_URL, priority: '1.0', changefreq: 'hourly' });

  // Region pages
  for (const region of REGIONS) {
    urls.push({
      loc: `${SITE_URL}/region/${region}`,
      priority: '0.9',
      changefreq: 'hourly',
    });
  }

  // Category pages
  for (const cat of CATEGORIES) {
    urls.push({
      loc: `${SITE_URL}/category/${cat}`,
      priority: '0.8',
      changefreq: 'hourly',
    });
  }

  // RSS feed
  urls.push({
    loc: `${SITE_URL}/rss.xml`,
    priority: '0.7',
    changefreq: 'hourly',
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outDir = process.env.DIST_DIR || DIST_DIR;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
  console.log('Sitemap generated');
}

function generateRSS() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));

  const items = articles.slice(0, 50).map(a => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${escapeXml(a.url)}</link>
    <description>${escapeXml(a.description)}</description>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    <guid>${escapeXml(a.url)}</guid>
    <source>${escapeXml(a.source)}</source>
    <category>${escapeXml(a.category)}</category>
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Global News Hub</title>
    <link>${SITE_URL}</link>
    <description>Latest breaking news from around the world - US, UK, India, Japan, China, Australia, and Europe</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>Global News Hub</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  const distDir = process.env.DIST_DIR || DIST_DIR;
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, 'rss.xml'), xml);
  console.log('RSS feed generated');
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// Actually write to the public dir since Astro copies it to dist
function generateRSSForPublic() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
  const publicDir = path.join(__dirname, '..', 'public');

  const items = articles.slice(0, 50).map(a => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${escapeXml(a.url)}</link>
    <description>${escapeXml(a.description)}</description>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    <guid>${escapeXml(a.url)}</guid>
    <source>${escapeXml(a.source)}</source>
    <category>${escapeXml(a.category)}</category>
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Global News Hub</title>
    <link>${SITE_URL}</link>
    <description>Latest breaking news from around the world</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, 'rss.xml'), xml);

  // Also write sitemap to public
  const meta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
  const lastmod = new Date(meta.updatedAt).toISOString().split('T')[0];
  const sitemapUrls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'hourly' },
    ...REGIONS.map(r => ({ loc: `${SITE_URL}/region/${r}`, priority: '0.9', changefreq: 'hourly' })),
    ...CATEGORIES.map(c => ({ loc: `${SITE_URL}/category/${c}`, priority: '0.8', changefreq: 'hourly' })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

  console.log('RSS feed + sitemap written to public/');
}

generateRSSForPublic();
