'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Power() {
  const [mode, setMode] = useState('power')
  const [current, setCurrent] = useState('')
  const [voltage, setVoltage] = useState('')
  const [power, setPower] = useState('')
  const [pf, setPf] = useState('0.85')
  const [phase, setPhase] = useState('single')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    const I = parseFloat(current)
    const V = parseFloat(voltage)
    const P = parseFloat(power)
    const PF = parseFloat(pf)
    const factor = phase === 'single' ? 1 : Math.sqrt(3)
    if (!Number.isFinite(PF) || PF <= 0 || PF > 1) {
      setError('功率因数必须大于 0 且不超过 1')
      setResult(null)
      return
    }
    const needs = mode === 'power' ? [I, V] : mode === 'current' ? [P, V] : [P, I]
    if (needs.some(x => !Number.isFinite(x) || x <= 0)) {
      setError('请输入有效且大于 0 的电流、电压或有功功率')
      setResult(null)
      return
    }
    setError('')
    if (mode === 'power') {
      const realP = factor * I * V * PF
      const apparent = factor * I * V
      setResult({
        power: realP.toFixed(0), apparent: apparent.toFixed(0),
        reactive: Math.sqrt(Math.max(0, apparent ** 2 - realP ** 2)).toFixed(0),
      })
    } else if (mode === 'current') {
      setResult({current: (P / (factor * V * PF)).toFixed(2)})
    } else {
      setResult({voltage: (P / (factor * I * PF)).toFixed(1)})
    }
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/electrical">电气工程</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">功率计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="power-field-1">计算模式</label>
              <select id="power-field-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="power">计算功率（已知电流+电压）</option>
                <option value="current">计算电流（已知功率+电压）</option>
                <option value="voltage">计算电压（已知功率+电流）</option>
              </select>
            </div>
            <div className="form-group"><label htmlFor="power-field-2">相数</label>
              <select id="power-field-2" value={phase} onChange={(e)=>setPhase(e.target.value)}>
                <option value="single">单相</option>
                <option value="three">三相</option>
              </select>
            </div>
            <div className="form-group"><label htmlFor="power-field-3">功率因数</label><input id="power-field-3" type="number" value={pf} onChange={(e)=>setPf(e.target.value)} step="0.01"/></div>
            <div className="form-group"><label htmlFor="power-field-4">电流 (A) {mode==='current'?'':'*'}</label><input id="power-field-4" type="number" value={current} onChange={(e)=>setCurrent(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="power-field-5">电压 (V) {mode==='voltage'?'':'*'}</label><input id="power-field-5" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="power-field-6">功率 (W) {mode==='power'?'':'*'}</label><input id="power-field-6" type="number" value={power} onChange={(e)=>setPower(e.target.value)}/></div>
            <button onClick={calculate} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px'}}>计算</button>
            {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
            {result && (
              <div className="result-group" role="status">
                {result.power && <div className="result-item"><span className="result-label">有功功率</span><span className="result-value">{result.power} W</span></div>}
                {result.apparent && <div className="result-item"><span className="result-label">视在功率</span><span className="result-value">{result.apparent} VA</span></div>}
                {result.reactive && <div className="result-item"><span className="result-label">无功功率</span><span className="result-value">{result.reactive} VAR</span></div>}
                {result.current && <div className="result-item"><span className="result-label">电流</span><span className="result-value">{result.current} A</span></div>}
                {result.voltage && <div className="result-item"><span className="result-label">电压</span><span className="result-value">{result.voltage} V</span></div>}
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>交流电路中的功率关系：</p>
            <div className="formula-box">
              单相: P = V × I × PF<br/>
              三相: P = √3 × V_L × I_L × PF<br/><br/>
              单相 S = V × I；三相 S = √3 × V_L × I_L（视在功率）<br/>
              Q = √(S² - P²)（无功功率）
            </div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>选择计算模式：功率、电流或电压</li>
              <li>选择单相或三相系统</li>
              <li>输入功率因数（电机通常0.85-0.95）</li>
              <li>输入任意两个值（I、V、P）</li>
              <li>点击计算</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <div className="faq-item"><p className="faq-question">为什么功率因数重要？</p><p className="faq-answer">PF表示功率的使用效率。PF=1表示所有功率都做有用功。电机、变压器因无功功率而PF较低。</p></div>
            <div className="faq-item"><p className="faq-question">单相和三相的区别？</p><p className="faq-answer">三相用于工业负荷和远距离电力传输。单相常见于住宅。</p></div>
          </div>
          <div className="content-section">
            <h2>案例</h2>
            <p><strong>案例1：</strong>10HP电机，480V三相：I = 7460/(480×0.89×√3) = 10.1A</p>
            <p><strong>案例2：</strong>2000W负载，230V单相：I = 2000/(230×0.9) = 9.7A</p>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>计算基于平衡正弦交流稳态；三相电压应输入线电压。设备选型需考虑谐波、启动及实际负载。</div>
        </div>
      </main>
    </>
  )
}
