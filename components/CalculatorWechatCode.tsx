'use client'

import {createContext, useContext} from 'react'
import type {ReactNode} from 'react'
import {miniProgramName} from '../lib/miniprogram-catalog'
import WechatCodeImage from './WechatCodeImage'

const CodeSource = createContext<string | null>(null)

export function MiniProgramCodeProvider({source, children}: {source: string | null; children: ReactNode}) {
  return <CodeSource.Provider value={source}>{children}</CodeSource.Provider>
}

export default function CalculatorWechatCode() {
  const source = useContext(CodeSource)
  if (!source) return null

  return (
    <aside className="calculator-wechat tool-panel" aria-labelledby="calculator-wechat-title">
      <div>
        <h2 id="calculator-wechat-title">微信扫码打开小程序</h2>
        <p>{miniProgramName}</p>
      </div>
      <WechatCodeImage source={source} alt={miniProgramName + '微信小程序码'} />
    </aside>
  )
}
