import type {Metadata} from 'next'
import Link from 'next/link'
import CalculatorDirectory from '../components/CalculatorDirectory'

export const metadata: Metadata = {alternates: {canonical: '/'}}

export default function Home() {
  return (
    <main id="main-content" className="container workbench">
      <section className="workbench-hero">
        <div className="workbench-intro">
          <p className="workbench-kicker">暖通 · 电气 · 流体 · 结构</p>
          <h1>厂务工程计算器</h1>
          <p>快速估算常用工程参数。每个计算器都能单独打开，输入所需数据后即可查看结果。</p>
          <a href="#calculator-directory" className="workbench-button">查找计算器</a>
        </div>
        <div className="workbench-example">
          <p>变压器容量算例</p>
          <dl>
            <div><dt>总设备功率</dt><dd>500 <small>kW</small></dd></div>
            <div><dt>需用 / 同时系数</dt><dd>0.70 / 0.90</dd></div>
            <div><dt>功率因数 / 余量系数</dt><dd>0.85 / 1.20</dd></div>
          </dl>
          <div className="example-output">
            <div><span>估算所需容量</span><strong>444.7 <small>kVA</small></strong></div>
            <Link href="/calculators/transformer-capacity">试用计算器</Link>
          </div>
        </div>
      </section>

      <CalculatorDirectory />

      <aside className="workbench-resources" aria-labelledby="resources-title">
        <div>
          <h2 id="resources-title">工程文章与案例</h2>
          <p>了解洁净室空调、循环水、空压系统和厂务运维中的实际工况。</p>
          <a href="https://factoryenergy.site/">阅读厂务能源网</a>
        </div>
        <figure>
          <img src="/wechat-qr.jpg" alt="智效厂务微信公众号二维码" width="116" height="116" loading="lazy" />
          <figcaption>扫码关注智效厂务</figcaption>
        </figure>
      </aside>
      <p className="disclaimer">计算结果用于初步估算。实际设计和施工须由具备相应资质的人员按适用规范复核。</p>
    </main>
  )
}
