import type {Metadata} from 'next'
import WechatEntries from '../../components/WechatEntries'

export const metadata: Metadata = {
  title: '微信入口 | 智效动力计算器',
  description: '在微信使用智效动力计算器小程序，关注智效厂务公众号。',
  alternates: {canonical: '/wechat'},
}

export default function WechatPage() {
  return (
    <main id="main-content" className="container mini-page">
      <header className="mini-hero">
        <h1>微信入口</h1>
        <p>在微信里使用工具，关注厂务技术更新。</p>
      </header>
      <WechatEntries />
    </main>
  )
}
