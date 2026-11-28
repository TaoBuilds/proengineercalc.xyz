import Link from 'next/link'
import type {calculatorCatalog} from '../lib/calculator-catalog'
import {localizedPath, text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'

type Tool = typeof calculatorCatalog[number]

export function ToolCard({tool, locale, headingLevel = 3}: {tool: Tool; locale: Locale; headingLevel?: 2 | 3}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link href={localizedPath(locale, `/calculators/${tool.slug}`)} className="calculator-card" data-category={tool.category}>
      <span className="tool-code" title={text(locale, tool.categoryLabel, tool.enCategoryLabel)}>{tool.categoryCode}</span>
      <Heading>{text(locale, tool.title, tool.enTitle)}</Heading>
      <p>{text(locale, tool.desc, tool.enDescription)}</p>
      <span className="tool-open" aria-hidden="true">{text(locale, '打开工具', 'Open tool')}</span>
    </Link>
  )
}
