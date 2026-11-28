import type {Metadata} from 'next'
import WechatEntries from '@/components/WechatEntries'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '微信入口 | 智效动力计算器', 'WeChat | ProEngineerCalc'),
    description: text(locale, '在微信使用智效动力计算器小程序，关注智效厂务公众号。', 'Open the Zhixiao calculator Mini Program or follow its official account in WeChat.'),
    alternates: localizedAlternates(locale, '/wechat'),
  }
}

export default function WechatPage({params: {locale}}: LocaleParams) {
  return (
    <main id="main-content" className="container mini-page">
      <header className="mini-hero">
        <h1>{text(locale, '微信入口', 'Find Us on WeChat')}</h1>
        <p>{text(locale, '在微信里使用工具，关注厂务技术更新。', 'Use the calculators in WeChat and follow our facilities engineering updates.')}</p>
      </header>
      <WechatEntries locale={locale} />
    </main>
  )
}
