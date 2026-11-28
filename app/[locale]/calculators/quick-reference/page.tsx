import type {Metadata} from 'next'
import MiniCategoryPage from '@/components/MiniCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '厂务速查 | 智效动力计算器', 'Facility Reference | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/quick-reference'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <MiniCategoryPage id="quick-reference" locale={locale} />
}
