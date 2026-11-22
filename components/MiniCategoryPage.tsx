import Link from 'next/link'
import {miniCategories} from '../lib/miniprogram-catalog'
import type {MiniCategoryId} from '../lib/miniprogram-catalog'
import MiniToolBrowser from './MiniToolBrowser'

export default function MiniCategoryPage({id}: {id: MiniCategoryId}) {
  const category = miniCategories.find(item => item.id === id)
  if (!category) return null
  return (
    <main id="main-content" className="container mini-page">
      <nav className="mini-breadcrumb" aria-label="当前位置"><Link href="/#calculator-directory">工具首页</Link><span aria-hidden="true">/</span><span aria-current="page">{category.title}</span></nav>
      <header className="mini-hero mini-category-hero" data-family={category.id}>
        <span className="mini-tool-badge" aria-hidden="true">{category.code}</span>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
        <Link className="mini-hero-link" href="/wechat#mini-program">在微信使用完整工具</Link>
      </header>
      <MiniToolBrowser category={category.id} />
      <p className="disclaimer">计算结果供工程初步估算，实际设计按适用规范和现场条件复核。</p>
    </main>
  )
}
