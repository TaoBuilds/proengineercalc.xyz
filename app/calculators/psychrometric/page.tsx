'use client'

import { useState } from 'react'
import Link from 'next/link'
import {moistAir, dryBulbFromEnthalpy} from '../../../lib/psychrometrics'

export default function Psychrometric() {
  const [mode, setMode] = useState('enthalpy')
  const [temp, setTemp] = useState('')
  const [humidity, setHumidity] = useState('50')
  const [pressure, setPressure] = useState('101.325')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    try {
      const result = moistAir(Number(temp), Number(humidity), Number(pressure))
      setResult({
        W: (result.humidityRatio * 1000).toFixed(2),
        h: result.enthalpyKjKg.toFixed(1),
        Td: result.dewPointC.toFixed(1),
      })
    } catch (e) {
      setResult({error: e instanceof Error ? e.message : '输入参数无效'})
    }
  }

  const calculateFromEnthalpy = () => {
    try {
      const temperature = dryBulbFromEnthalpy(Number(temp), Number(humidity), Number(pressure))
      setResult({temp: temperature.toFixed(1)})
    } catch (e) {
      setResult({error: e instanceof Error ? e.message : '无法反算温度'})
    }
  }

  return (
    <>
      <header className="header"><div className="container header-content"><h1 className="logo"><Link href="/">🔧 智效厂务工程计算器</Link></h1></div></header>
      <nav className="nav"><div className="container nav-inner"><Link href="/">🏠 首页</Link><Link href="/calculators/hvac">🌡️ 暖通空调</Link></div></nav>
      <main className="container">
        <div className="calculator-container">
          <h1 style={{fontSize:'1.75rem',fontWeight:700,margin:'2rem 0 1rem'}}>湿空气性质计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label>计算模式</label>
              <select value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="enthalpy">根据温度+湿度计算</option>
                <option value="reverse">根据焓值反算温度</option>
              </select>
            </div>
            <div className="form-group"><label>{mode === 'reverse' ? '目标焓值 (kJ/kg干空气)' : '干球温度 (°C)'}</label><input type="number" value={temp} onChange={(e)=>setTemp(e.target.value)}/></div>
            <div className="form-group"><label>相对湿度 (%)</label><input type="number" value={humidity} onChange={(e)=>setHumidity(e.target.value)}/></div>
            <div className="form-group"><label>大气压力 (kPa)</label><input type="number" value={pressure} onChange={(e)=>setPressure(e.target.value)}/></div>
            <button onClick={mode==='enthalpy'?calculate:calculateFromEnthalpy} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px'}}>计算</button>
            {result?.error && <p role="alert" style={{color:'#b91c1c'}}>{result.error}</p>}
            {result && !result.error && (
              <div className="result-group">
                {result.h && <div className="result-item"><span className="result-label">焓值</span><span className="result-value">{result.h} kJ/kg</span></div>}
                {result.W && <div className="result-item"><span className="result-label">含湿量</span><span className="result-value">{result.W} g/kg</span></div>}
                {result.Td && <div className="result-item"><span className="result-label">露点</span><span className="result-value">{result.Td} °C</span></div>}
                {result.temp && <div className="result-item"><span className="result-label">温度</span><span className="result-value">{result.temp} °C</span></div>}
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>湿空气性质是暖通空调设计的基础参数。</p>
            <div className="formula-box">
              Ps = 0.61078 × exp(17.27T/(T+237.3))<br/>
              Pv = Ps × RH/100<br/>
              W = 0.622 × Pv/(P-Pv)<br/>
              h = 1.005T + W(2501 + 1.86T)
            </div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>选择计算模式</li>
              <li>输入温度和相对湿度</li>
              <li>根据需要调整压力（默认：101.325 kPa）</li>
              <li>点击计算获取所有湿空气参数</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <div className="faq-item"><p className="faq-question">什么是焓值？</p><p className="faq-answer">焓值是空气的总热量，单位 kJ/kg，由显热和潜热组成。</p></div>
            <div className="faq-item"><p className="faq-question">为什么压力会影响计算？</p><p className="faq-answer">相同温度和相对湿度下，压力越低，含湿量通常越大；压力变化会影响焓值和湿球温度。</p></div>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>近似公式仅供初步估算，低于 0°C 或重要工艺设计请使用经验证的湿空气物性数据和仪表。</div>
        </div>
      </main>
      <footer><div className="container"><p>© 2026 智效厂务工程计算器</p></div></footer>
    </>
  )
}
