import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '电气工程 | 智效动力计算器',
  alternates: {canonical: '/calculators/electrical'},
}

export default function Page() {
  return <MiniCategoryPage id="electrical" />
}
