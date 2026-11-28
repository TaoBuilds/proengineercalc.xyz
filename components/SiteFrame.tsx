import Link from 'next/link'
import {brandName} from '@/lib/miniprogram-catalog'
import {localizedPath, text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'
import LanguageSwitch from './LanguageSwitch'

export function SiteHeader({locale}: {locale: Locale}) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{text(locale, '跳到正文', 'Skip to content')}</a>
      <div className="container site-header-inner">
        <Link href={localizedPath(locale, '/')} className="site-brand">
          <span className="site-logo" aria-hidden="true">{text(locale, '智', 'P')}</span>
          <strong>{brandName(locale)}</strong>
        </Link>
        <nav aria-label={text(locale, '站点导航', 'Site navigation')}>
          <Link href={localizedPath(locale, '/#calculator-directory')}>{text(locale, '工具', 'Tools')}</Link>
          <Link href={localizedPath(locale, '/wechat')}>{text(locale, '微信入口', 'WeChat')}</Link>
          <LanguageSwitch locale={locale} />
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter({locale}: {locale: Locale}) {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>{brandName(locale)}</span>
        <nav aria-label={text(locale, '站点链接', 'Site links')}>
          <Link href={localizedPath(locale, '/wechat#mini-program')}>{text(locale, '微信小程序', 'WeChat Mini Program')}</Link>
          <Link href={localizedPath(locale, '/wechat#official-account')}>{text(locale, '微信公众号', 'WeChat Official Account')}</Link>
          <a href="https://factoryenergy.site/" hrefLang="zh-CN">{text(locale, '厂务能源网', 'FactoryEnergy')}</a>
          <a href="https://smartfacility.tech/" hrefLang="en">Smart Facility</a>
          <Link href={localizedPath(locale, '/terms')}>{text(locale, '使用条款', 'Terms of Use')}</Link>
          <Link href={localizedPath(locale, '/privacy')}>{text(locale, '隐私政策', 'Privacy Policy')}</Link>
        </nav>
      </div>
    </footer>
  )
}
