const assert = require('node:assert/strict');
const {existsSync} = require('node:fs');
const {mkdir} = require('node:fs/promises');
const {chromium} = require('playwright');

const origin = 'http://127.0.0.1:3000';
const name = '智效动力计算器';
const categories = ['hvac', 'electrical', 'fluid', 'quick-reference', 'units', 'energy'];

(async () => {
  await mkdir('test-artifacts/wechat', {recursive: true});
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({viewport: {width: 390, height: 860}, isMobile: true, hasTouch: true});
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {origin});
    await context.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    const page = await context.newPage();
    assert.equal((await page.goto(origin)).status(), 200);
    assert.equal(await page.locator('h1').innerText(), name);
    assert.equal(await page.locator('.mini-category-list a').count(), categories.length);
    assert.equal(await page.locator('.mini-featured-list article').count(), 3);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await page.screenshot({path: 'test-artifacts/wechat/mobile-home.png'});

    const search = page.getByRole('searchbox', {name: '搜索工具'});
    await search.fill('电缆选型');
    assert.equal(await page.locator('.mini-tool').count(), 1);
    assert.equal(await page.getByRole('link', {name: '电缆选型，进入微信小程序'}).getAttribute('href'), '/wechat#mini-program');
    await search.fill('');
    await page.getByRole('button', {name: '收藏 露点计算器'}).click();
    await page.reload();
    await page.getByRole('button', {name: '我的收藏'}).click();
    assert.equal(await page.locator('.mini-tool').count(), 1);
    assert.ok(await page.getByRole('link', {name: '露点计算器，打开网页工具'}).isVisible());

    for (const category of categories) {
      assert.equal((await page.goto(origin + '/calculators/' + category)).status(), 200);
      assert.ok(await page.getByRole('searchbox', {name: '搜索工具'}).isVisible());
      assert.ok(await page.locator('.mini-tool').count() >= 5);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    }
    await page.screenshot({path: 'test-artifacts/wechat/mobile-category.png'});
    assert.equal((await page.goto(origin + '/calculators/unit-converter?category=mass')).status(), 200);
    await page.waitForFunction(() => document.querySelector('#unit-converter-field-2').value === 'mass');
    assert.equal(await page.locator('#unit-converter-field-3').inputValue(), 'kg');

    assert.equal((await page.goto(origin + '/wechat')).status(), 200);
    assert.ok(await page.getByAltText('智效厂务微信公众号二维码').isVisible());
    const hasCode = ['png', 'jpg'].some(extension => existsSync('public/wechat-miniprogram.' + extension));
    assert.equal(await page.getByAltText('智效动力计算器微信小程序码').count(), hasCode ? 1 : 0);
    await page.getByRole('button', {name: '复制小程序名称'}).click();
    await page.getByText('已复制', {exact: true}).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), name);
    await page.screenshot({path: 'test-artifacts/wechat/mobile-wechat.png'});
    console.log('Verified mobile navigation, six categories, search, favorites, unit presets, and WeChat entry.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
