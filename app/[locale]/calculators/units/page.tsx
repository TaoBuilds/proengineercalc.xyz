import type {Metadata} from 'next'
import MiniCategoryPage from '@/components/MiniCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '单位换算 | 智效动力计算器', 'Unit Conversions | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/units'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <MiniCategoryPage id="units" locale={locale} />
}
