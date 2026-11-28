'use client'

import {createContext, useContext} from 'react'
import type {ReactNode} from 'react'
import {defaultLocale, text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({locale, children}: {locale: Locale; children: ReactNode}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useTranslation() {
  return translators[useLocale()]
}

const translators = {
  'zh-CN': (zh: string, en: string) => text('zh-CN', zh, en),
  en: (zh: string, en: string) => text('en', zh, en),
}
