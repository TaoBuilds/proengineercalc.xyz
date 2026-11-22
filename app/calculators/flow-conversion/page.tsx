'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FlowConversion() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m3h')
  const [result, setResult] = useState<any>(null)

  const rates: Record<string, number> = { lps: 1, m3h: 0.277778, gpm: 0.0630902, cfm: 0.471947, lpm: 1/60 }

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const lps = v * rates[fromUnit]
    setResult({
      lps: lps.toFixed(4),
      m3h: (lps / rates.m3h).toFixed(4),
      gpm: (lps / rates.gpm).toFixed(4),
      cfm: (lps / rates.cfm).toFixed(4),
      lpm: (lps / rates.lpm).toFixed(4)
    })
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/fluid">流体力学</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">流量单位换算</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="flow-conversion-field-1">数值</label><input id="flow-conversion-field-1" type="number" value={value} onChange={(e)=>setValue(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="flow-conversion-field-2">源单位</label>
              <select id="flow-conversion-field-2" value={fromUnit} onChange={(e)=>setFromUnit(e.target.value)}>
                <option value="lps">L/s (升/秒)</option>
                <option value="m3h">m³/h (立方米/小时)</option>
                <option value="gpm">GPM (加仑/分钟)</option>
                <option value="cfm">CFM (立方英尺/分钟)</option>
                <option value="lpm">LPM (升/分钟)</option>
              </select>
            </div>
            <button onClick={convert} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px'}}>换算</button>
            {result && (
              <div className="result-group" role="status">
                <div className="result-item"><span className="result-label">L/s</span><span className="result-value">{result.lps}</span></div>
                <div className="result-item"><span className="result-label">m³/h</span><span className="result-value">{result.m3h}</span></div>
                <div className="result-item"><span className="result-label">GPM</span><span className="result-value">{result.gpm}</span></div>
                <div className="result-item"><span className="result-label">CFM</span><span className="result-value">{result.cfm}</span></div>
                <div className="result-item"><span className="result-label">LPM</span><span className="result-value">{result.lpm}</span></div>
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>流量单位之间的换算：</p>
            <div className="formula-box">1 m³/h = 0.27778 L/s<br/>1 GPM = 0.06309 L/s<br/>1 CFM = 0.47195 L/s</div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>输入流量数值</li>
              <li>选择源单位</li>
              <li>点击换算查看所有结果</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <div className="faq-item"><p className="faq-question">为什么不同行业用不同单位？</p><p className="faq-answer">不同行业习惯不同。暖通通常用 GPM 或 L/s，工艺行业通常用 m³/h。</p></div>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>所有计算结果仅供参照。</div>
        </div>
      </main>
    </>
  )
}
