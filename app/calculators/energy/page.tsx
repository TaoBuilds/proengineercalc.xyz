import type {Metadata} from 'next'
import MiniCategoryPage from '../../../components/MiniCategoryPage'

export const metadata: Metadata = {
  title: '节能降耗 | 智效动力计算器',
  alternates: {canonical: '/calculators/energy'},
}

export default function Page() {
  return <MiniCategoryPage id="energy" />
}
