import type {Metadata} from 'next'
import CalculatorCategoryPage from '../../../components/CalculatorCategoryPage'

export const metadata: Metadata = {
  title: '电气工程计算器 | ProEngineerCalc',
  alternates: {canonical: '/calculators/electrical'},
}

export default function Page() {
  return <CalculatorCategoryPage id="electrical" />
}
