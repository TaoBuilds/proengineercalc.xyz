'use client'

import {useState} from 'react'
import {miniProgramName} from '../lib/miniprogram-catalog'

export default function CopyMiniProgramName() {
  const [status, setStatus] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(miniProgramName)
      setStatus('已复制')
    } catch {
      setStatus('请长按或选中名称复制')
    }
  }
  return (
    <div className="mini-copy">
      <button type="button" onClick={copy}>复制小程序名称</button>
      <span aria-live="polite">{status}</span>
    </div>
  )
}
