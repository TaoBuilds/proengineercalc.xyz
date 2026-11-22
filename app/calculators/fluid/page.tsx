import type {Metadata} from 'next'
import CalculatorCategoryPage from '../../../components/CalculatorCategoryPage'

export const metadata: Metadata = {
  title: '流体力学计算器 | ProEngineerCalc',
  alternates: {canonical: '/calculators/fluid'},
}

export default function Page() {
  return <CalculatorCategoryPage id="fluid" />
}
