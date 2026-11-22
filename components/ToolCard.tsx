import Link from 'next/link'
import type {calculatorCatalog} from '../lib/calculator-catalog'

type Tool = typeof calculatorCatalog[number]

export function ToolCard({tool, headingLevel = 3}: {tool: Tool; headingLevel?: 2 | 3}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link href={`/calculators/${tool.slug}`} className="calculator-card" data-category={tool.category}>
      <span className="tool-code" title={tool.categoryLabel}>{tool.categoryCode}</span>
      <Heading>{tool.title}</Heading>
      <p>{tool.desc}</p>
      <span className="tool-open" aria-hidden="true">打开工具</span>
    </Link>
  )
}
