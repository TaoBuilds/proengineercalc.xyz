import type {Metadata} from 'next'
import CalculatorCategoryPage from '../../../components/CalculatorCategoryPage'

export const metadata: Metadata = {
  title: '结构工程计算器 | 智效动力计算器',
  alternates: {canonical: '/calculators/structure'},
}

export default function Page() {
  return <CalculatorCategoryPage id="structure" />
}
