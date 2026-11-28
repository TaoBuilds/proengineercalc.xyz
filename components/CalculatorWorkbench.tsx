import type {ReactNode} from 'react'
import Link from 'next/link'
import {calculatorCatalog} from '@/lib/calculator-catalog'
import {localizedPath} from '@/lib/locale'
import {useLocale, useTranslation} from './LocaleProvider'

type Props = {
  slug: string
  inputs: ReactNode
  result: ReactNode
  children: ReactNode
  onCalculate?: () => void
  action?: string
}

export default function CalculatorWorkbench({slug, inputs, result, children, onCalculate, action}: Props) {
  const locale = useLocale()
  const t = useTranslation()
  const tool = calculatorCatalog.find(item => item.slug === slug)
  if (!tool) return null

  const related = calculatorCatalog.filter(item => item.category === tool.category && item.slug !== slug).slice(0, 3)
  return (
    <main id="main-content" className="container calculator-workbench">
      <nav className="calculator-breadcrumb" aria-label={t('当前位置', 'Breadcrumb')}>
        <Link href={localizedPath(locale, '/#calculator-directory')}>{t('计算器', 'Calculators')}</Link><span aria-hidden="true">/</span>
        <Link href={localizedPath(locale, `/calculators/${tool.category}`)}>{t(tool.categoryLabel, tool.enCategoryLabel)}</Link>
      </nav>

      <header className="tool-heading">
        <div>
          <span className="tool-code">{tool.categoryCode}</span>
          <h1>{t(tool.title, tool.enTitle)}</h1>
          <p>{t(tool.desc, tool.enDescription)}</p>
        </div>
        <div className="workbench-links">
          <a href="#reference" className="tool-section-link">{t('计算依据', 'Calculation Reference')}</a>
          <Link href={localizedPath(locale, '/wechat#mini-program')} className="tool-section-link">{t('微信小程序', 'WeChat Mini Program')}</Link>
        </div>
      </header>

      <div className="tool-workspace">
        <section className="tool-panel" aria-labelledby="input-title">
          <div className="tool-panel-heading"><h2 id="input-title">{t('输入参数', 'Inputs')}</h2></div>
          {onCalculate ? (
            <form className="calculator-form" noValidate onSubmit={event => { event.preventDefault(); onCalculate() }}>
              {inputs}
              <button className="tool-submit" type="submit">{action ?? t('计算', 'Calculate')}</button>
            </form>
          ) : (
            <div className="calculator-form">{inputs}</div>
          )}
        </section>

        <section className="tool-panel tool-panel-output" aria-labelledby="result-title">
          <div className="tool-panel-heading"><h2 id="result-title">{t('计算结果', 'Results')}</h2></div>
          <div className="tool-output" aria-live="polite" aria-atomic="true">
            {result || <p className="tool-output-empty">{onCalculate ? t('填写参数并提交后，结果将在这里显示。', 'Enter the inputs and select Calculate to see the results.') : t('填写有效参数后，结果将在这里显示。', 'Results appear here once all inputs are valid.')}</p>}
          </div>
        </section>
      </div>

      <section id="reference" className="tool-reference" aria-labelledby="reference-title">
        <h2 id="reference-title">{t('计算依据', 'Calculation Reference')}</h2>
        <div className="tool-reference-grid">
          <div className="tool-reference-copy">{children}</div>
          {related.length > 0 && (
            <aside className="tool-related" aria-labelledby="related-title">
              <h3 id="related-title">{t('相关计算器', 'Related Calculators')}</h3>
              <ul>
                {related.map(item => <li key={item.slug}><Link href={localizedPath(locale, `/calculators/${item.slug}`)}>{t(item.title, item.enTitle)}</Link></li>)}
              </ul>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
