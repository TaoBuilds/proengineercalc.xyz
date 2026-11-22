'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {featuredToolIds, miniCatalog, miniCategories} from '../lib/miniprogram-catalog'
import type {CatalogEntry, MiniCategoryId} from '../lib/miniprogram-catalog'

const storageKey = 'zhixiao-calculator-favorites'
const shortcuts = ['电缆选型', '压缩空气', '比功率', '冷却塔', '管径', '焓湿图']
const scenarios = [
  {query: '冷却塔', title: '冷却塔运行校核', description: '查逼近度、补水和排污'},
  {query: '电缆', title: '配电线路核算', description: '查选型、载流量和压降'},
  {query: '压缩空气', title: '空压系统评估', description: '查管径压降与比功率'},
  {query: '流量', title: '流量与管径换算', description: '查水和气的常用换算'},
]

function ToolTile({item, saved, onFavorite}: {item: CatalogEntry; saved: boolean; onFavorite: () => void}) {
  const destination = item.href || '/wechat#mini-program'
  return (
    <article className="mini-tool" data-family={item.category}>
      <Link className="mini-tool-link" href={destination} aria-label={item.title + (item.href ? '，打开网页工具' : '，进入微信小程序')}>
        <span className="mini-tool-badge" aria-hidden="true">{item.code}</span>
        <span className="mini-tool-copy">
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          {!item.href && <small>小程序工具</small>}
        </span>
      </Link>
      <button type="button" className="mini-favorite" aria-label={(saved ? '取消收藏 ' : '收藏 ') + item.title}
        aria-pressed={saved} onClick={onFavorite}>
        <span aria-hidden="true">{saved ? '★' : '☆'}</span>
      </button>
    </article>
  )
}

export default function MiniToolBrowser({category}: {category?: MiniCategoryId}) {
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
    const text = [item.title, item.description, item.code, item.search].join(' ').toLowerCase()
    return (!category || item.category === category) &&
      (!favoritesOnly || favorites.includes(item.id)) &&
      words.every(word => text.includes(word))
  })
  const searching = words.length > 0 || favoritesOnly
  const tiles = (items: CatalogEntry[]) => items.map(item => (
    <ToolTile key={item.id} item={item} saved={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />
  ))

  return (
    <section className="mini-browser" id="calculator-directory" aria-label="工具目录">
      <div className="mini-search" role="search">
        <label className="visually-hidden" htmlFor="mini-query">搜索工具</label>
        <span className="mini-search-icon" aria-hidden="true"></span>
        <input type="search" id="mini-query" value={query} onChange={event => setQuery(event.target.value)}
          placeholder={category ? '搜索本分类工具' : '搜索工具，如：电压降 / 焓湿图 / 管径'} autoComplete="off" />
      </div>
      <div className="mini-filters" role="group" aria-label="工具筛选">
        {!category && (
          <>
            <button type="button" aria-pressed={!searching} onClick={() => chooseQuery('')}>热门</button>
            {shortcuts.map(label => <button key={label} type="button" aria-pressed={query === label && !favoritesOnly} onClick={() => chooseQuery(label)}>{label}</button>)}
          </>
        )}
        <button type="button" aria-pressed={favoritesOnly} onClick={() => { setFavoritesOnly(!favoritesOnly); setQuery('') }}>我的收藏</button>
      </div>

      {(category || searching) ? (
        <section className="mini-section" aria-labelledby="mini-results-title">
          <div className="mini-section-heading">
            <h2 id="mini-results-title">{favoritesOnly ? '我的收藏' : searching ? '搜索结果' : '分类工具'}</h2>
            <p aria-live="polite">{matches.length} 个工具</p>
          </div>
          {matches.length ? <div className="mini-tool-list">{tiles(matches)}</div> : (
            <p className="mini-empty">{favoritesOnly ? '点工具右侧的星标可加入收藏。' : '没有找到匹配的工具。'}</p>
          )}
        </section>
      ) : (
        <>
          <section className="mini-section" aria-labelledby="mini-featured">
            <div className="mini-section-heading"><h2 id="mini-featured">推荐工具</h2></div>
            <div className="mini-tool-list mini-featured-list">{tiles(miniCatalog.filter(item => featuredToolIds.includes(item.id)))}</div>
          </section>

          <section className="mini-section" aria-labelledby="mini-categories">
            <div className="mini-section-heading"><h2 id="mini-categories">工具分类</h2></div>
            <div className="mini-category-list">
              {miniCategories.map(item => (
                <Link key={item.id} href={`/calculators/${item.id}`} className="mini-category" data-family={item.id}>
                  <span className="mini-tool-badge" aria-hidden="true">{item.code}</span>
                  <span className="mini-tool-copy"><strong>{item.title}</strong><span>{item.description}</span></span>
                  <span className="mini-category-chevron" aria-hidden="true"></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mini-section" aria-labelledby="mini-scenarios">
            <div className="mini-section-heading"><h2 id="mini-scenarios">按问题找工具</h2></div>
            <div className="mini-scenarios">
              {scenarios.map(item => <a key={item.title} href="#calculator-directory" onClick={() => chooseQuery(item.query)}>
                <strong>{item.title}</strong><span>{item.description}</span>
              </a>)}
            </div>
          </section>
        </>
      )}
    </section>
  )
}
