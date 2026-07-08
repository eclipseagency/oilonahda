// Render Oilo Q2 2026 Report — each .page → PNG
const puppeteer = require('C:/Users/acer/AppData/Roaming/npm/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const HTML = 'file:///C:/Users/acer/oilo-spa/reports/2026-Q2/report.html';
const OUT_DIR = 'C:/Users/acer/oilo-spa/reports/2026-Q2/png';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox','--font-render-hinting=none']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
  await page.goto(HTML, { waitUntil: 'networkidle0' });

  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  await page.addStyleTag({ content: `
    body { background: #0a0a0c !important; padding: 0 !important; margin: 0 !important; }
    .page { margin: 0 !important; box-shadow: none !important; }
  ` });

  const handles = await page.$$('.page');
  console.log(`Found ${handles.length} pages`);

  for (let i = 0; i < handles.length; i++) {
    const file = path.join(OUT_DIR, `page-${String(i+1).padStart(2,'0')}.png`);
    await handles[i].evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 200));
    await handles[i].screenshot({ path: file, type: 'png' });
    console.log(`  ✓ page-${String(i+1).padStart(2,'0')}.png`);
  }

  await browser.close();
  console.log(`\nDone. ${handles.length} PNGs saved to:\n  ${OUT_DIR}`);
})();
