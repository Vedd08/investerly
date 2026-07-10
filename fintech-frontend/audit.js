import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/tools/home-loan-calculator',
  '/tools/marriage-calculator',
  '/tools/education-calculator',
  '/tools/tax-calculator',
  '/login',
  '/register'
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const PORT = 5173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let html = `<html><head><style>
    body { font-family: sans-serif; }
    img { border: 1px solid #ccc; margin-bottom: 20px; max-width: 100%; height: auto; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .route-section { margin-bottom: 40px; }
    .screenshot-container { display: flex; gap: 20px; overflow-x: auto; align-items: flex-start; }
    .screenshot-item { display: flex; flex-direction: column; align-items: center; }
  </style></head><body><h1>Responsiveness Audit Report</h1>`;

  for (const route of routes) {
    console.log(`Auditing ${route}...`);
    html += `<div class="route-section"><h2>Route: ${route || '/'}</h2><div class="screenshot-container">`;
    
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
      
      // Wait for any animations
      await new Promise(r => setTimeout(r, 1000));

      const safeRouteName = route === '/' ? 'home' : route.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${safeRouteName}_${vp.name}.png`;
      const filePath = path.join(OUT_DIR, fileName);
      
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  Saved ${fileName}`);

      html += `<div class="screenshot-item"><h3>${vp.name} (${vp.width}px)</h3><img src="screenshots/${fileName}" alt="${vp.name}" /></div>`;
    }
    
    html += `</div></div>`;
  }

  html += `</body></html>`;
  fs.writeFileSync(path.join(process.cwd(), 'report.html'), html);

  await browser.close();
  console.log('Audit complete. Check report.html');
}

run().catch(console.error);
