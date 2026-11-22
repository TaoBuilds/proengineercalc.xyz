import type {Metadata} from 'next'
import Link from 'next/link'
import MiniToolBrowser from '../components/MiniToolBrowser'
import WechatEntries from '../components/WechatEntries'
import {miniProgramName} from '../lib/miniprogram-catalog'

export const metadata: Metadata = {alternates: {canonical: '/'}}

export default function Home() {
  return (
    <main id="main-content" className="container mini-page mini-home">
      <section className="mini-hero">
        <p className="mini-hero-label">工程快速校核</p>
        <h1>{miniProgramName}</h1>
        <p>把常用暖通、电气、流体、空压和节能计算放进一个顺手的工具箱。</p>
        <Link href="/wechat#mini-program" className="mini-hero-link">在微信使用小程序</Link>
      </section>
      <MiniToolBrowser />
      <WechatEntries />
      <p className="mini-extra"><Link href="/calculators/structure">结构工程网页工具</Link></p>
      <p className="disclaimer">计算结果供工程初步估算，实际设计按适用规范和现场条件复核。</p>
    </main>
  )
}
