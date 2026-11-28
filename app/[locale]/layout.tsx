import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import '../globals.css'
import {SiteFooter, SiteHeader} from '@/components/SiteFrame'
import {LocaleProvider} from '@/components/LocaleProvider'
import {isLocale, locales, siteOrigin, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'
import {brandName} from '@/lib/miniprogram-catalog'

export function generateStaticParams() {
  return locales.map(locale => ({locale}))
}

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  const title = text(locale, '智效动力计算器 - 专业工程师计算工具箱', 'ProEngineerCalc | Engineering Calculators')
  const description = text(locale,
    '免费在线工程师计算工具箱，包含暖通空调、电气工程、流体力学和结构工程计算器。支持露点计算、电缆载流量、湿空气参数等多种工程计算。',
    'Free online calculators for HVAC, electrical, fluid, and structural engineering, including dew point, cable ampacity, and moist-air properties.')
  return {
    metadataBase: new URL(siteOrigin),
    title,
    description,
    authors: [{name: brandName(locale)}],
    openGraph: {title, description, type: 'website', locale: text(locale, 'zh_CN', 'en_US')},
  }
}

export default function RootLayout({children, params: {locale}}: LocaleParams & {children: React.ReactNode}) {
  if (!isLocale(locale)) notFound()
  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="7p6E6l3bA-XCHPdkW7jBefcSPlzYNp3TxjMck2AuawE" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#173951" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7465624411296700" crossOrigin="anonymous"></script>
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </LocaleProvider>
      </body>
    </html>
  )
}
