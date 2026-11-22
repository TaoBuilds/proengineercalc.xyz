import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '单位换算 | 智效动力计算器',
  alternates: {canonical: '/calculators/units'},
}

export default function Page() {
  return <MiniCategoryPage id="units" />
}
