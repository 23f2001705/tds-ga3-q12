const { chromium } = require('playwright');

const seeds = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
const baseUrl = 'https://exam.sanand.workers.dev/tds2025-01-ga3?seed=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = baseUrl + seed;
    console.log('Scraping: ' + url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('table', { timeout: 30000 }).catch(() => {});

    const numbers = await page.evaluate(() => {
      const nums = [];
      document.querySelectorAll('table td, table th').forEach(cell => {
        const text = cell.innerText.trim().replace(/,/g, '');
        const n = parseFloat(text);
        if (!isNaN(n) && text !== '') nums.push(n);
      });
      return nums;
    });

    const seedSum = numbers.reduce((a, b) => a + b, 0);
    console.log('Seed ' + seed + ': ' + numbers.length + ' numbers, sum = ' + seedSum);
    grandTotal += seedSum;
  }

  await browser.close();
  console.log('Total Sum: ' + grandTotal);
})();
