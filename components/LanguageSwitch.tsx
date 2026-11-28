'use client'

import {usePathname} from 'next/navigation'
import {localizedPath, stripLocale} from '@/lib/locale'
import type {Locale} from '@/lib/locale'

export default function LanguageSwitch({locale}: {locale: Locale}) {
  const pathname = usePathname()
  const target = locale === 'en' ? 'zh-CN' : 'en'
  const href = localizedPath(target, stripLocale(pathname))

  return (
    <a className="language-switch" href={href} hrefLang={target} lang={target}
      onClick={event => {
        event.currentTarget.href = href + window.location.search + window.location.hash
      }}>
      {target === 'en' ? 'English' : '中文'}
    </a>
  )
}
