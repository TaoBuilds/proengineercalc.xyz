import type {ReactNode} from 'react'
import Link from 'next/link'
import {calculatorCatalog} from '../lib/calculator-catalog'
import CalculatorWechatCode from './CalculatorWechatCode'

type Props = {
  slug: string
  inputs: ReactNode
  result: ReactNode
  children: ReactNode
  onCalculate?: () => void
  action?: string
}

export default function CalculatorWorkbench({slug, inputs, result, children, onCalculate, action = '计算'}: Props) {
  const tool = calculatorCatalog.find(item => item.slug === slug)
  if (!tool) return null

  const related = calculatorCatalog.filter(item => item.category === tool.category && item.slug !== slug).slice(0, 3)
  return (
    <main id="main-content" className="container calculator-workbench">
      <nav className="calculator-breadcrumb" aria-label="当前位置">
        <Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span>
        <Link href={`/calculators/${tool.category}`}>{tool.categoryLabel}</Link>
      </nav>

      <header className="tool-heading">
        <div>
          <span className="tool-code">{tool.categoryCode}</span>
          <h1>{tool.title}</h1>
          <p>{tool.desc}</p>
        </div>
        <div className="workbench-links">
          <a href="#reference" className="tool-section-link">计算依据</a>
          <Link href="/wechat#mini-program" className="tool-section-link">微信小程序</Link>
        </div>
      </header>

      <div className="tool-workspace">
        <section className="tool-panel" aria-labelledby="input-title">
          <div className="tool-panel-heading"><h2 id="input-title">输入参数</h2></div>
          {onCalculate ? (
            <form className="calculator-form" noValidate onSubmit={event => { event.preventDefault(); onCalculate() }}>
              {inputs}
              <button className="tool-submit" type="submit">{action}</button>
            </form>
          ) : (
            <div className="calculator-form">{inputs}</div>
          )}
        </section>

        <section className="tool-panel tool-panel-output" aria-labelledby="result-title">
          <div className="tool-panel-heading"><h2 id="result-title">计算结果</h2></div>
          <div className="tool-output" aria-live="polite" aria-atomic="true">
            {result || <p className="tool-output-empty">{onCalculate ? '填写参数并提交后，结果将在这里显示。' : '填写有效参数后，结果将在这里显示。'}</p>}
          </div>
        </section>
      </div>

      <CalculatorWechatCode />

      <section id="reference" className="tool-reference" aria-labelledby="reference-title">
        <h2 id="reference-title">计算依据</h2>
        <div className="tool-reference-grid">
          <div className="tool-reference-copy">{children}</div>
          {related.length > 0 && (
            <aside className="tool-related" aria-labelledby="related-title">
              <h3 id="related-title">相关计算器</h3>
              <ul>
                {related.map(item => <li key={item.slug}><Link href={`/calculators/${item.slug}`}>{item.title}</Link></li>)}
              </ul>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
