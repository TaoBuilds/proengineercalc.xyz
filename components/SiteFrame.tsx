import Link from 'next/link'
import {categories} from '../lib/calculator-catalog'

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳到正文</a>
      <div className="container site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-logo" aria-hidden="true">ƒ<span>ₓ</span></span>
          <span><strong>ProEngineerCalc</strong><small>智效厂务工程计算器</small></span>
        </Link>
        <nav aria-label="工程类别">
          {categories.map(category => (
            <Link key={category.id} href={`/calculators/${category.id}`}>{category.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>ProEngineerCalc</span>
        <nav aria-label="站点链接">
          <a href="https://factoryenergy.site/">厂务能源网</a>
          <a href="https://smartfacility.tech/" hrefLang="en">Smart Facility</a>
          <Link href="/terms">使用条款</Link>
          <Link href="/privacy">隐私政策</Link>
        </nav>
      </div>
    </footer>
  )
}
