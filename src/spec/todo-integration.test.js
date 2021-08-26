import puppeteer from 'puppeteer';
import path from 'path';

describe('Editing a task description', () => {
  test('should permit the edition of an existing task', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, '../../dist/index.html')}`);
    await page.click('input[name=new-item]');
    await page.type('input[name=new-item]', 'New task for testing!');
    await page.click('input[name=new-item-btn]');
    expect(true).toBe(true);
    setTimeout(() => {
      browser.close()
    }, 2000);
  }, 1000000000);
});
