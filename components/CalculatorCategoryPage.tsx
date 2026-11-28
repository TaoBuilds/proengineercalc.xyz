import Link from 'next/link'
import {ToolCard} from './ToolCard'
import {calculatorCatalog, categories} from '../lib/calculator-catalog'
import type {CalculatorCategory} from '../lib/calculator-catalog'
import {localizedPath, text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'

export default function CalculatorCategoryPage({id, locale}: {id: CalculatorCategory; locale: Locale}) {
  const category = categories.find(item => item.id === id)
  const tools = calculatorCatalog.filter(tool => tool.category === id)
  if (!category) return null

  return (
    <main id="main-content" className="container category-page">
      <header className="tool-heading">
        <div>
          <Link className="tool-section-link" href={localizedPath(locale, '/#calculator-directory')}>{text(locale, '全部计算器', 'All Calculators')}</Link>
          <h1>{text(locale, category.label, category.enTitle)}</h1>
          <p className="category-description">{text(locale, category.description, category.enDescription)}</p>
        </div>
        <p className="category-total">{tools.length} {text(locale, '个工具', 'tools')}</p>
      </header>
      <nav className="directory-filters" aria-label={text(locale, '工程类别', 'Engineering categories')}>
        {categories.map(item => (
          <Link key={item.id} href={localizedPath(locale, `/calculators/${item.id}`)} aria-current={item.id === id ? 'page' : undefined}>{text(locale, item.label, item.enTitle)}</Link>
        ))}
      </nav>
      <div className="calculator-grid">
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} locale={locale} headingLevel={2} />)}
      </div>
      <p className="disclaimer">{text(locale, '结果用于初步工程估算。实际设计须按适用规范及现场条件复核。', 'Use these results for preliminary estimates. Verify final designs against applicable standards and site conditions.')}</p>
    </main>
  )
}
