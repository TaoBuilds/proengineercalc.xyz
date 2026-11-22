import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '流体与管道 | 智效动力计算器',
  alternates: {canonical: '/calculators/fluid'},
}

export default function Page() {
  return <MiniCategoryPage id="fluid" />
}
