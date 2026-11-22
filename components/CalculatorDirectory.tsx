'use client'

import {useState} from 'react'
import {ToolCard} from './ToolCard'
import {calculatorCatalog, categories} from '../lib/calculator-catalog'
import type {CalculatorCategory} from '../lib/calculator-catalog'

export default function CalculatorDirectory() {
  const [category, setCategory] = useState<CalculatorCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const filtered = calculatorCatalog.filter(tool => {
    const text = [tool.title, tool.desc, tool.categoryLabel, tool.categoryCode, tool.slug].join(' ').toLowerCase()
    return (category === 'all' || category === tool.category) && words.every(word => text.includes(word))
  })

  return (
    <section className="tool-directory" id="calculator-directory" aria-labelledby="directory-title">
      <div className="directory-heading">
        <div>
          <h2 id="directory-title">计算器目录</h2>
          <p aria-live="polite">{filtered.length} 个工具</p>
        </div>
        <div className="directory-search">
          <label htmlFor="tool-query">搜索工具</label>
          <input id="tool-query" type="search" placeholder="例如：露点、变压器、压损" autoComplete="off"
            value={query} onChange={event => setQuery(event.target.value)} aria-controls="tool-results" />
        </div>
      </div>
      <div className="directory-filters" role="group" aria-label="按类别筛选">
        <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部</button>
        {categories.map(item => (
          <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
        ))}
      </div>
      <div id="tool-results" className="calculator-grid">
        {filtered.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
      {!filtered.length && (
        <div className="directory-empty">
          <p>没有找到匹配的计算器。</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('all') }}>清除筛选</button>
        </div>
      )}
    </section>
  )
}
