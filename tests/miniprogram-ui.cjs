const assert = require('node:assert/strict');
const {existsSync} = require('node:fs');
const {mkdir} = require('node:fs/promises');
const {chromium} = require('playwright');

const origin = process.env.CALCULATOR_TEST_ORIGIN || 'http://127.0.0.1:3000';
const name = '智效动力计算器';
const webTools = [
  'air-changes', 'battery-capacity', 'beam-load', 'cable-ampacity', 'concrete-mix', 'cooling-load',
  'dewpoint', 'duct-velocity', 'flow-conversion', 'illuminance', 'motor-current', 'pipe-pressure',
  'power', 'psychrometric', 'pump-head', 'reynolds', 'steel-weight', 'transformer-capacity',
  'unit-converter', 'voltage-drop',
];
const exampleInputs = {
  'duct-velocity': {2: '2000', 3: '300'},
  'flow-conversion': {1: '120'},
  power: {4: '10', 5: '230'},
  psychrometric: {2: '25'},
  'steel-weight': {2: '20', 10: '6'},
  'voltage-drop': {2: '230', 3: '20', 4: '100'},
};
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
    await page.goto(origin + '/');
    await page.getByRole('link', {name: 'English', exact: true}).click();
    assert.equal(new URL(page.url()).pathname, '/en');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('h1').innerText(), 'ProEngineerCalc');
    assert.equal(await page.locator('link[hreflang="zh-CN"]').getAttribute('href'), 'https://www.proengineercalc.xyz/');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    await page.getByRole('button', {name: 'Favorites', exact: true}).click();
    assert.ok(await page.getByRole('link', {name: 'Dew Point Calculator — open web tool'}).isVisible());
    await page.getByRole('searchbox', {name: 'Search tools'}).fill('voltage drop');
    assert.equal(await page.getByRole('link', {name: 'Voltage Drop — open web tool', exact: true}).getAttribute('href'),
      '/en/calculators/voltage-drop');

    for (const category of [...categories, 'structure']) {
      assert.equal((await page.goto(origin + '/en/calculators/' + category)).status(), 200);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
      assert.match(await page.locator('h1').innerText(), /^[A-Z]/);
    }
    for (const slug of webTools) {
      const path = '/calculators/' + slug;
      assert.equal((await page.goto(origin + '/en' + path)).status(), 200, slug);
      assert.equal(await page.locator('html').getAttribute('lang'), 'en', slug);
      assert.equal(await page.locator('.language-switch').getAttribute('href'), path, slug);
      assert.ok(await page.getByRole('heading', {name: 'Inputs', exact: true}).isVisible(), slug);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), slug);
      for (const [field, value] of Object.entries(exampleInputs[slug] || {})) {
        await page.locator('#' + slug + '-field-' + field).fill(value);
      }
      const submit = page.locator('button.tool-submit');
      if (await submit.count()) await submit.click();
      await page.locator('.tool-output .result-value').first().waitFor({timeout: 5000});
      assert.doesNotMatch(await page.locator('main').innerText(), /\p{Script=Han}/u, slug);
    }

    await page.goto(origin + '/en/calculators/dewpoint');
    const humidity = page.getByLabel('Relative humidity (%)', {exact: true});
    await humidity.fill('0');
    assert.match(await page.locator('.calculator-form').getByRole('alert').innerText(), /Relative humidity must be greater than 0/);
    await humidity.fill('50');
    const englishDewPoint = await page.locator('.tool-output .result-value').first().innerText();
    await page.getByRole('link', {name: '中文', exact: true}).click();
    assert.equal(new URL(page.url()).pathname, '/calculators/dewpoint');
    await page.locator('.tool-output .result-value').first().waitFor();
    assert.equal(await page.locator('.tool-output .result-value').first().innerText(), englishDewPoint);

    await page.goto(origin + '/calculators/unit-converter?category=mass#reference');
    await page.getByRole('link', {name: 'English', exact: true}).click();
    assert.equal(new URL(page.url()).search + new URL(page.url()).hash, '?category=mass#reference');
    assert.equal(new URL(page.url()).pathname, '/en/calculators/unit-converter');
    await page.waitForFunction(() => document.querySelector('#unit-converter-field-2').value === 'mass');
    assert.equal(await page.getByLabel('From unit').inputValue(), 'kg');

    for (const path of ['/en/wechat', '/en/privacy', '/en/terms']) {
      assert.equal((await page.goto(origin + path)).status(), 200);
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    }
    await page.goto(origin + '/en/wechat');
    await page.getByRole('button', {name: 'Copy Mini Program name'}).click();
    await page.getByText('Copied', {exact: true}).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), name);
    assert.ok(await page.getByAltText('Zhixiao Facilities WeChat Official Account QR code').isVisible());

    for (const [path, locale] of [['/missing-tool', 'zh-CN'], ['/en/missing-tool', 'en']]) {
      assert.equal((await page.goto(origin + path)).status(), 404);
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
    }
    console.log('Verified both languages, 20 calculators, mobile layout, search, favorites, preset links, input validation, and WeChat.');

  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
