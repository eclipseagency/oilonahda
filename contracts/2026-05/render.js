// Render Oilo contracts (AR + EN) -> PDF (A4, mobile-friendly) and PNG-per-page
const puppeteer = require('C:/Users/acer/AppData/Roaming/npm/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const HERE = __dirname;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const FILES = [
  { html: 'contract-ar.html', pdf: 'Oilo-Contract-AR-May-2026.pdf', pngDir: 'png-ar' },
  { html: 'contract-en.html', pdf: 'Oilo-Contract-EN-May-2026.pdf', pngDir: 'png-en' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });

  for (const f of FILES) {
    const url = 'file:///' + path.resolve(HERE, f.html).replace(/\\/g, '/');
    const pdfPath = path.join(HERE, f.pdf);
    const pngOut = path.join(HERE, f.pngDir);
    if (!fs.existsSync(pngOut)) fs.mkdirSync(pngOut, { recursive: true });

    console.log(`\n→ ${f.html}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 800));

    // Strip body chrome so PDF/PNG are clean
    await page.addStyleTag({ content: `
      body { background: #0a0a0c !important; padding: 0 !important; margin: 0 !important; }
      .page { margin: 0 !important; box-shadow: none !important; }
    ` });

    // PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
    console.log(`  ✓ PDF  ${path.basename(pdfPath)}`);

    // PNG per page
    const handles = await page.$$('.page');
    for (let i = 0; i < handles.length; i++) {
      const file = path.join(pngOut, `page-${String(i + 1).padStart(2, '0')}.png`);
      await handles[i].evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await new Promise(r => setTimeout(r, 150));
      await handles[i].screenshot({ path: file, type: 'png' });
    }
    console.log(`  ✓ PNG  ${handles.length} pages -> ${f.pngDir}/`);

    await page.close();
  }

  await browser.close();
  console.log('\nDone.');
})();
