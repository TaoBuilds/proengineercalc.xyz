import Link from 'next/link'
import {miniProgramName} from '../lib/miniprogram-catalog'

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳到正文</a>
      <div className="container site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-logo" aria-hidden="true">智</span>
          <strong>{miniProgramName}</strong>
        </Link>
        <nav aria-label="站点导航">
          <Link href="/#calculator-directory">工具</Link>
          <Link href="/wechat">微信入口</Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>{miniProgramName}</span>
        <nav aria-label="站点链接">
          <Link href="/wechat#mini-program">微信小程序</Link>
          <Link href="/wechat#official-account">微信公众号</Link>
          <a href="https://factoryenergy.site/">厂务能源网</a>
          <a href="https://smartfacility.tech/" hrefLang="en">Smart Facility</a>
          <Link href="/terms">使用条款</Link>
          <Link href="/privacy">隐私政策</Link>
        </nav>
      </div>
    </footer>
  )
}
