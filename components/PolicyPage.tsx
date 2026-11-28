import type {ReactNode} from 'react'
import Link from 'next/link'
import {localizedPath} from '@/lib/locale'
import type {Locale} from '@/lib/locale'
import {brandName} from '@/lib/miniprogram-catalog'

export default function PolicyPage({title, children, locale}: {title: string; children: ReactNode; locale: Locale}) {
  return (
    <main id="main-content" className="container policy-page">
      <header className="tool-heading">
        <div>
          <Link className="tool-section-link" href={localizedPath(locale, '/')}>{brandName(locale)}</Link>
          <h1>{title}</h1>
        </div>
      </header>
      <article className="policy-document" aria-label={title}>{children}</article>
    </main>
  )
}
