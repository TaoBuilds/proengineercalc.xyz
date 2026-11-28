import {calculatorCatalog, categories} from '@/lib/calculator-catalog'
import {locales, localizedPath, siteOrigin} from '@/lib/locale'
import {miniCategories} from '@/lib/miniprogram-catalog'

export const dynamic = 'force-static'

export function GET() {
  const categoryIds = new Set([...miniCategories.map(item => item.id), ...categories.map(item => item.id)])
  const paths = [
    '/', '/wechat', '/terms', '/privacy',
    ...Array.from(categoryIds, id => '/calculators/' + id),
    ...calculatorCatalog.map(tool => '/calculators/' + tool.slug),
  ]
  const urls = paths.flatMap(path => {
    const variants = locales.map(locale => ({locale, url: siteOrigin + localizedPath(locale, path)}))
    const alternates = variants.map(({locale, url}) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${url}" />`).join('\n')
    return variants.map(({url}) => `  <url>\n    <loc>${url}</loc>\n${alternates}\n  </url>`)
  })
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n')
  return new Response(xml, {headers: {'Content-Type': 'application/xml; charset=utf-8'}})
}
