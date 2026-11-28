'use client'

import {useState} from 'react'
import {useTranslation} from './LocaleProvider'
import {miniProgramName} from '../lib/miniprogram-catalog'

export default function CopyMiniProgramName() {
  const t = useTranslation()
  const [status, setStatus] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(miniProgramName)
      setStatus(t('已复制', 'Copied'))
    } catch {
      setStatus(t('请长按或选中名称复制', 'Select the name to copy it manually'))
    }
  }
  return (
    <div className="mini-copy">
      <button type="button" onClick={copy}>{t('复制小程序名称', 'Copy Mini Program name')}</button>
      <span aria-live="polite">{status}</span>
    </div>
  )
}
