'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {featuredToolIds, miniCatalog, miniCategories} from '../lib/miniprogram-catalog'
import type {CatalogEntry, MiniCategoryId} from '../lib/miniprogram-catalog'
import {localizedPath} from '@/lib/locale'
import {useLocale, useTranslation} from './LocaleProvider'

const storageKey = 'zhixiao-calculator-favorites'
const shortcuts = [
  ['电缆选型', 'Cable sizing'],
  ['压缩空气', 'Compressed air'],
  ['比功率', 'Specific power'],
  ['冷却塔', 'Cooling tower'],
  ['管径', 'Pipe'],
  ['焓湿图', 'Psychrometric'],
] as const
const scenarios = [
  {query: '冷却塔', title: '冷却塔运行校核', description: '查逼近度、补水和排污', enTitle: 'Check cooling tower performance', enDescription: 'Find approach, makeup, and blowdown tools'},
  {query: '电缆', title: '配电线路核算', description: '查选型、载流量和压降', enTitle: 'Check a distribution circuit', enDescription: 'Find cable sizing, ampacity, and voltage drop tools'},
  {query: '压缩空气', title: '空压系统评估', description: '查管径压降与比功率', enTitle: 'Assess a compressed air system', enDescription: 'Find pressure drop and specific power tools'},
  {query: '流量', title: '流量与管径换算', description: '查水和气的常用换算', enTitle: 'Convert flows and pipe sizes', enDescription: 'Find common water and gas conversions'},
]

function ToolTile({item, saved, onFavorite}: {item: CatalogEntry; saved: boolean; onFavorite: () => void}) {
  const locale = useLocale()
  const t = useTranslation()
  const title = t(item.title, item.enTitle)
  const destination = localizedPath(locale, item.href || '/wechat#mini-program')
  return (
    <article className="mini-tool" data-family={item.category}>
      <Link className="mini-tool-link" href={destination} aria-label={title + (item.href ? t('，打开网页工具', ' — open web tool') : t('，进入微信小程序', ' — open in WeChat'))}>
        <span className="mini-tool-badge" aria-hidden="true">{item.code}</span>
        <span className="mini-tool-copy">
          <strong>{title}</strong>
          <span>{t(item.description, item.enDescription)}</span>
          {!item.href && <small>{t('小程序工具', 'WeChat tool')}</small>}
        </span>
      </Link>
      <button type="button" className="mini-favorite" aria-label={(saved ? t('取消收藏 ', 'Remove from favorites: ') : t('收藏 ', 'Add to favorites: ')) + title}
        aria-pressed={saved} onClick={onFavorite}>
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      </button>
    </article>
  )
}

export default function MiniToolBrowser({category}: {category?: MiniCategoryId}) {
  const locale = useLocale()
  const t = useTranslation()
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
      if (Array.isArray(stored)) setFavorites(stored.filter((id): id is string => typeof id === 'string'))
    } catch {}
  }, [])

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
    setFavorites(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }

  function chooseQuery(value: string) {
    setQuery(value)
    setFavoritesOnly(false)
  }

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const matches = miniCatalog.filter(item => {
    const text = [item.title, item.description, item.enTitle, item.enDescription, item.code, item.search].join(' ').toLowerCase()
    return (!category || item.category === category) &&
      (!favoritesOnly || favorites.includes(item.id)) &&
      words.every(word => text.includes(word))
  })
  const searching = words.length > 0 || favoritesOnly
  const tiles = (items: CatalogEntry[]) => items.map(item => (
    <ToolTile key={item.id} item={item} saved={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />
  ))

  return (
    <section className="mini-browser" id="calculator-directory" aria-label={t('工具目录', 'Tool directory')}>
      <div className="mini-search" role="search">
        <label className="visually-hidden" htmlFor="mini-query">{t('搜索工具', 'Search tools')}</label>
        <span className="mini-search-icon" aria-hidden="true"></span>
        <input type="search" id="mini-query" value={query} onChange={event => setQuery(event.target.value)}
          placeholder={category ? t('搜索本分类工具', 'Search this category') : t('搜索工具，如：电压降 / 焓湿图 / 管径', 'Search tools, e.g. voltage drop / dew point / pipe size')} autoComplete="off" />
      </div>
      <div className="mini-filters" role="group" aria-label={t('工具筛选', 'Tool filters')}>
        {!category && (
          <>
            <button type="button" aria-pressed={!searching} onClick={() => chooseQuery('')}>{t('热门', 'Popular')}</button>
            {shortcuts.map(([zh, en]) => <button key={zh} type="button" aria-pressed={query === t(zh, en) && !favoritesOnly} onClick={() => chooseQuery(t(zh, en))}>{t(zh, en)}</button>)}
          </>
        )}
        <button type="button" aria-pressed={favoritesOnly} onClick={() => { setFavoritesOnly(!favoritesOnly); setQuery('') }}>{t('我的收藏', 'Favorites')}</button>
      </div>

      {(category || searching) ? (
        <section className="mini-section" aria-labelledby="mini-results-title">
          <div className="mini-section-heading">
            <h2 id="mini-results-title">{favoritesOnly ? t('我的收藏', 'Favorites') : searching ? t('搜索结果', 'Search Results') : t('分类工具', 'Category Tools')}</h2>
            <p aria-live="polite">{locale === 'en' ? `${matches.length} ${matches.length === 1 ? 'tool' : 'tools'}` : `${matches.length} 个工具`}</p>
          </div>
          {matches.length ? <div className="mini-tool-list">{tiles(matches)}</div> : (
            <p className="mini-empty">{favoritesOnly ? t('点工具右侧的星标可加入收藏。', 'Star a tool to add it to your favorites.') : t('没有找到匹配的工具。', 'No matching tools found.')}</p>
          )}
        </section>
      ) : (
        <>
          <section className="mini-section" aria-labelledby="mini-featured">
            <div className="mini-section-heading"><h2 id="mini-featured">{t('推荐工具', 'Featured Tools')}</h2></div>
            <div className="mini-tool-list mini-featured-list">{tiles(miniCatalog.filter(item => featuredToolIds.includes(item.id)))}</div>
          </section>

          <section className="mini-section" aria-labelledby="mini-categories">
            <div className="mini-section-heading"><h2 id="mini-categories">{t('工具分类', 'Categories')}</h2></div>
            <div className="mini-category-list">
              {miniCategories.map(item => (
                <Link key={item.id} href={localizedPath(locale, `/calculators/${item.id}`)} className="mini-category" data-family={item.id}>
                  <span className="mini-tool-badge" aria-hidden="true">{item.code}</span>
                  <span className="mini-tool-copy"><strong>{t(item.title, item.enTitle)}</strong><span>{t(item.description, item.enDescription)}</span></span>
                  <span className="mini-category-chevron" aria-hidden="true"></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mini-section" aria-labelledby="mini-scenarios">
            <div className="mini-section-heading"><h2 id="mini-scenarios">{t('按问题找工具', 'Find Tools by Task')}</h2></div>
            <div className="mini-scenarios">
              {scenarios.map(item => <a key={item.title} href="#calculator-directory" onClick={() => chooseQuery(item.query)}>
                <strong>{t(item.title, item.enTitle)}</strong><span>{t(item.description, item.enDescription)}</span>
              </a>)}
            </div>
          </section>
        </>
      )}
    </section>
  )
}
