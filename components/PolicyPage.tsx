import type {ReactNode} from 'react'
import Link from 'next/link'

export default function PolicyPage({title, children}: {title: string; children: ReactNode}) {
  return (
    <main id="main-content" className="container policy-page">
      <header className="tool-heading">
        <div>
          <Link className="tool-section-link" href="/">智效动力计算器</Link>
          <h1>{title}</h1>
        </div>
      </header>
      <article className="policy-document" aria-label={title}>{children}</article>
    </main>
  )
}
