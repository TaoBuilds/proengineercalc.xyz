import type {Metadata} from 'next'
import Link from 'next/link'
import MiniToolBrowser from '@/components/MiniToolBrowser'
import WechatEntries from '@/components/WechatEntries'
import {brandName} from '@/lib/miniprogram-catalog'
import {localizedAlternates, localizedPath, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {alternates: localizedAlternates(locale, '/')}
}

export default function Home({params: {locale}}: LocaleParams) {
  return (
    <main id="main-content" className="container mini-page mini-home">
      <section className="mini-hero">
        <p className="mini-hero-label">{text(locale, '工程快速校核', 'Quick Engineering Checks')}</p>
        <h1>{brandName(locale)}</h1>
        <p>{text(locale, '把常用暖通、电气、流体、空压和节能计算放进一个顺手的工具箱。',
          'A toolbox for everyday HVAC, electrical, fluid, compressed-air, and energy efficiency calculations.')}</p>
        <Link href={localizedPath(locale, '/wechat#mini-program')} className="mini-hero-link">{text(locale, '在微信使用小程序', 'Open the WeChat Mini Program')}</Link>
      </section>
      <MiniToolBrowser />
      <WechatEntries locale={locale} />
      <p className="mini-extra"><Link href={localizedPath(locale, '/calculators/structure')}>{text(locale, '结构工程网页工具', 'Structural Engineering Calculators')}</Link></p>
      <p className="disclaimer">{text(locale, '计算结果供工程初步估算，实际设计按适用规范和现场条件复核。',
        'Use these results for preliminary estimates. Verify final designs against applicable standards and site conditions.')}</p>
    </main>
  )
}
