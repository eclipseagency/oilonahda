// Render Oilo Q2 2026 Report → single A4 PDF (vector text, backgrounds kept)
const puppeteer = require('C:/Users/acer/AppData/Roaming/npm/node_modules/puppeteer-core');

const HTML = 'file:///C:/Users/acer/oilo-spa/reports/2026-Q2/report.html';
const OUT = 'C:/Users/acer/oilo-spa/reports/2026-Q2/Oilo-Q2-2026-Report.pdf';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none']
  });
  const page = await browser.newPage();
  await page.goto(HTML, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Done → ' + OUT);
})();
