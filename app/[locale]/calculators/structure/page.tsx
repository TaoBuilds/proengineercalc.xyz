import type {Metadata} from 'next'
import CalculatorCategoryPage from '@/components/CalculatorCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '结构工程计算器 | 智效动力计算器', 'Structural Engineering Calculators | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/structure'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <CalculatorCategoryPage id="structure" locale={locale} />
}
