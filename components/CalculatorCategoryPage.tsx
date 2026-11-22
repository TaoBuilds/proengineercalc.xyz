import Link from 'next/link'
import {ToolCard} from './ToolCard'
import {calculatorCatalog, categories} from '../lib/calculator-catalog'
import type {CalculatorCategory} from '../lib/calculator-catalog'

export default function CalculatorCategoryPage({id}: {id: CalculatorCategory}) {
  const category = categories.find(item => item.id === id)
  const tools = calculatorCatalog.filter(tool => tool.category === id)
  if (!category) return null

  return (
    <main id="main-content" className="container category-page">
      <header className="tool-heading">
        <div>
          <Link className="tool-section-link" href="/#calculator-directory">全部计算器</Link>
          <h1>{category.label}</h1>
          <p className="category-description">{category.description}</p>
        </div>
        <p className="category-total">{tools.length} 个工具</p>
      </header>
      <nav className="directory-filters" aria-label="工程类别">
        {categories.map(item => (
          <Link key={item.id} href={`/calculators/${item.id}`} aria-current={item.id === id ? 'page' : undefined}>{item.label}</Link>
        ))}
      </nav>
      <div className="calculator-grid">
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} headingLevel={2} />)}
      </div>
      <p className="disclaimer">结果用于初步工程估算。实际设计须按适用规范及现场条件复核。</p>
    </main>
  )
}
