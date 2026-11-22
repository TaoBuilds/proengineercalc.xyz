import type {Metadata} from 'next'
import CalculatorCategoryPage from '../../../components/CalculatorCategoryPage'

export const metadata: Metadata = {
  title: '暖通空调计算器 | ProEngineerCalc',
  alternates: {canonical: '/calculators/hvac'},
}

export default function Page() {
  return <CalculatorCategoryPage id="hvac" />
}
