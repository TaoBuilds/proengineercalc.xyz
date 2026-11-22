import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '暖通空调 | 智效动力计算器',
  alternates: {canonical: '/calculators/hvac'},
}

export default function Page() {
  return <MiniCategoryPage id="hvac" />
}
