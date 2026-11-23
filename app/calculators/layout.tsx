import type {ReactNode} from 'react'
import {MiniProgramCodeProvider} from '../../components/CalculatorWechatCode'
import {miniProgramCodeSource} from '../../lib/wechat-assets'

export default function CalculatorsLayout({children}: {children: ReactNode}) {
  return <MiniProgramCodeProvider source={miniProgramCodeSource}>{children}</MiniProgramCodeProvider>
}
