// Render Elite Spa meeting summary -> PDF (A4) and PNG-per-page
const puppeteer = require('C:/Users/acer/AppData/Roaming/npm/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const F = { html: 'meeting-summary.html', pdf: 'Oilo-Spa-Meeting-Summary-May-2026.pdf', pngDir: 'png' };

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });

  const url = 'file:///' + path.resolve(HERE, F.html).replace(/\\/g, '/');
  const pdfPath = path.join(HERE, F.pdf);
  const pngOut = path.join(HERE, F.pngDir);
  if (!fs.existsSync(pngOut)) fs.mkdirSync(pngOut, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 800));

  await page.addStyleTag({ content: `
    body { background: #fff !important; padding: 0 !important; margin: 0 !important; }
    .page { margin: 0 !important; box-shadow: none !important; }
  ` });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  console.log(`✓ PDF  ${path.basename(pdfPath)}`);

  const handles = await page.$$('.page');
  for (let i = 0; i < handles.length; i++) {
    const file = path.join(pngOut, `page-${String(i + 1).padStart(2, '0')}.png`);
    await handles[i].evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 150));
    await handles[i].screenshot({ path: file, type: 'png' });
  }
  console.log(`✓ PNG  ${handles.length} pages -> ${F.pngDir}/`);

  await browser.close();
  console.log('Done.');
})();
