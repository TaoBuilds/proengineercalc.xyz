import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content" className="container">
      <section className="tool-heading not-found-page">
        <div>
          <p className="tool-code">404</p>
          <h1>找不到此页面</h1>
          <p>可以返回工具目录，按名称或专业查找计算器。</p>
          <Link className="tool-submit" href="/#calculator-directory">返回计算器目录</Link>
        </div>
      </section>
    </main>
  )
}
