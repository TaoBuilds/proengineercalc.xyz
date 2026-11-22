import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '厂务速查 | 智效动力计算器',
  alternates: {canonical: '/calculators/quick-reference'},
}

export default function Page() {
  return <MiniCategoryPage id="quick-reference" />
}
