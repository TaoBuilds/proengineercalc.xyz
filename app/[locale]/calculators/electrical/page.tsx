import type {Metadata} from 'next'
import MiniCategoryPage from '@/components/MiniCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '电气工程 | 智效动力计算器', 'Electrical Engineering | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/electrical'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <MiniCategoryPage id="electrical" locale={locale} />
}
