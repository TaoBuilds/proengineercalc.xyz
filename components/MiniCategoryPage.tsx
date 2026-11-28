import Link from 'next/link'
import {miniCategories} from '../lib/miniprogram-catalog'
import type {MiniCategoryId} from '../lib/miniprogram-catalog'
import MiniToolBrowser from './MiniToolBrowser'
import {localizedPath, text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'

export default function MiniCategoryPage({id, locale}: {id: MiniCategoryId; locale: Locale}) {
  const category = miniCategories.find(item => item.id === id)
  if (!category) return null
  const title = text(locale, category.title, category.enTitle)
  return (
    <main id="main-content" className="container mini-page">
      <nav className="mini-breadcrumb" aria-label={text(locale, '当前位置', 'Breadcrumb')}><Link href={localizedPath(locale, '/#calculator-directory')}>{text(locale, '工具首页', 'Tool Directory')}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <header className="mini-hero mini-category-hero" data-family={category.id}>
        <span className="mini-tool-badge" aria-hidden="true">{category.code}</span>
        <h1>{title}</h1>
        <p>{text(locale, category.description, category.enDescription)}</p>
        <Link className="mini-hero-link" href={localizedPath(locale, '/wechat#mini-program')}>{text(locale, '在微信使用完整工具', 'Browse all tools in WeChat')}</Link>
      </header>
      <MiniToolBrowser category={category.id} />
      <p className="disclaimer">{text(locale, '计算结果供工程初步估算，实际设计按适用规范和现场条件复核。', 'Use these results for preliminary estimates. Verify final designs against applicable standards and site conditions.')}</p>
    </main>
  )
}
