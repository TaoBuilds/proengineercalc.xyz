import type {Metadata} from 'next'
import MiniCategoryPage from '@/components/MiniCategoryPage'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  return {
    title: text(locale, '流体与管道 | 智效动力计算器', 'Fluids and Piping | ProEngineerCalc'),
    alternates: localizedAlternates(locale, '/calculators/fluid'),
  }
}

export default function Page({params: {locale}}: LocaleParams) {
  return <MiniCategoryPage id="fluid" locale={locale} />
}
