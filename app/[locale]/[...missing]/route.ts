import {defaultLocale, isLocale, localizedPath, text} from '@/lib/locale'

export function GET(_request: Request, {params}: {params: {locale: string}}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale
  const title = text(locale, '找不到此页面', 'Page not found')
  const message = text(locale, '可以返回工具目录，按名称或专业查找计算器。', 'Browse the directory to find calculators by name or category.')
  const back = text(locale, '返回计算器目录', 'Back to the calculator directory')
  return new Response(`<!doctype html>
<html lang="${locale}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} | ProEngineerCalc</title>
<style>
  body{margin:0;background:#f1f7fc;color:#173951;font:1rem/1.6 system-ui,sans-serif}
  main{width:min(36rem,calc(100% - 2rem));margin:clamp(2rem,12vh,8rem) auto}
  a{color:#07576b}
</style>
<main>
  <p>404</p>
  <h1>${title}</h1>
  <p>${message}</p>
  <a href="${localizedPath(locale, '/#calculator-directory')}">${back}</a>
</main>
</html>`, {status: 404, headers: {'Content-Type': 'text/html; charset=utf-8'}})
}
