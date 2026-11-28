import type {Metadata} from 'next'
import MiniCategoryPage from '@/components/MiniCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '节能降耗 | 智效动力计算器', 'Energy Efficiency | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/energy'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <MiniCategoryPage id="energy" locale={locale} />
}
