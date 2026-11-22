'use client'

import { useState } from 'react'
import Link from 'next/link'
import type {ConductorMaterial} from '../../../lib/cable-ampacity'
import {calculateVoltageDrop, calculateDropLimitedCurrent, calculateMinimumArea} from '../../../lib/voltage-drop'

type Result =
  | {mode: 'vd'; dropV: number; dropPercent: number; loadVoltageV: number}
  | {mode: 'current'; currentA: number}
  | {mode: 'size'; areaMm2: number}

export default function VoltageDrop() {
  const [mode, setMode] = useState<Result['mode']>('vd')
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [length, setLength] = useState('')
  const [size, setSize] = useState('2.5')
  const [material, setMaterial] = useState<ConductorMaterial>('copper')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const changeMode = (nextMode: Result['mode']) => {
    setMode(nextMode)
    setResult(null)
    setError('')
  }

  const calculate = () => {
    const circuit = {voltageV: parseFloat(voltage), lengthM: parseFloat(length), material}
    const currentA = parseFloat(current)
    const areaMm2 = parseFloat(size)

    try {
      switch (mode) {
        case 'vd':
          setResult({mode, ...calculateVoltageDrop(circuit, currentA, areaMm2)})
          break
        case 'current':
          setResult({mode, ...calculateDropLimitedCurrent(circuit, areaMm2)})
          break
        case 'size':
          setResult({mode, areaMm2: calculateMinimumArea(circuit, currentA)})
          break
      }
      setError('')
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : '输入参数无效')
    }
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/electrical">电气工程</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">电压降计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="voltage-drop-field-1">计算模式</label>
              <select id="voltage-drop-field-1" value={mode} onChange={(e)=>changeMode(e.target.value as Result['mode'])}>
                <option value="vd">计算电压降</option>
                <option value="current">计算最大电流</option>
                <option value="size">计算所需电缆截面积</option>
              </select>
            </div>
            <div className="form-group"><label htmlFor="voltage-drop-field-2">系统电压 (V)</label><input id="voltage-drop-field-2" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)}/></div>
            {mode !== 'current' && <div className="form-group"><label htmlFor="voltage-drop-field-3">电流 (A)</label><input id="voltage-drop-field-3" type="number" value={current} onChange={(e)=>setCurrent(e.target.value)}/></div>}
            <div className="form-group"><label htmlFor="voltage-drop-field-4">线路长度 (m) - 单程</label><input id="voltage-drop-field-4" type="number" value={length} onChange={(e)=>setLength(e.target.value)}/></div>
            {mode !== 'size' && <div className="form-group"><label htmlFor="voltage-drop-field-5">导体截面积 (mm²)</label>
              <select id="voltage-drop-field-5" value={size} onChange={(e)=>setSize(e.target.value)}>
                <option value="1.5">1.5 mm²</option><option value="2.5">2.5 mm²</option><option value="4">4 mm²</option><option value="6">6 mm²</option><option value="10">10 mm²</option><option value="16">16 mm²</option><option value="25">25 mm²</option>
              </select>
            </div>}
            <div className="form-group"><label htmlFor="voltage-drop-field-6">材质</label>
              <select id="voltage-drop-field-6" value={material} onChange={(e)=>setMaterial(e.target.value as ConductorMaterial)}>
                <option value="copper">铜</option><option value="aluminum">铝</option>
              </select>
            </div>
            <button onClick={calculate} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px'}}>计算</button>
            {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
            {result && (
              <div className="result-group" role="status">
                {result.mode === 'vd' && (
                  <>
                    <div className="result-item"><span className="result-label">电压降</span><span className="result-value">{result.dropV.toFixed(2)} V ({result.dropPercent.toFixed(2)}%)</span></div>
                    <div className="result-item"><span className="result-label">负载端电压</span><span className="result-value">{result.loadVoltageV.toFixed(1)} V</span></div>
                  </>
                )}
                {result.mode === 'current' && <div className="result-item"><span className="result-label">按 3% 压降估算的电流上限</span><span className="result-value">{result.currentA.toFixed(2)} A</span></div>}
                {result.mode === 'size' && <div className="result-item"><span className="result-label">按 3% 压降估算的最小截面积</span><span className="result-value">{result.areaMm2.toFixed(2)} mm²</span></div>}
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>此处使用双线回路的电阻模型，适用于直流或忽略电抗的单相估算。计算采用 1.2 的电阻修正系数。</p>
            <div className="formula-box">
              R = ρ × L × 2 × 1.2 / A<br/>
              VD = I × R<br/><br/>
              其中:<br/>
              ρ = 电阻率 (Ω·mm²/m)<br/>
              L = 单程长度 (m)<br/>
              A = 截面积 (mm²)
            </div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>选择计算模式</li>
              <li>输入回路电源电压（V）</li>
              <li>输入负载电流或线路长度</li>
              <li>选择导体材质和截面积</li>
              <li>点击计算查看结果</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <div className="faq-item"><p className="faq-question">为什么是3%？</p><p className="faq-answer">这里把 3% 用作与压降相关的筛选目标。实际限值、线缆载流量和标准截面积需按项目要求复核。</p></div>
            <div className="faq-item"><p className="faq-question">铜和铝哪个好？</p><p className="faq-answer">铜的电阻率更低（0.0175 vs 0.0283 Ω·mm²/m），所以铜电缆可以用更小的截面积承载相同的电流。</p></div>
          </div>
          <div className="content-section">
            <h2>案例</h2>
            <p><strong>案例1：</strong>100m线路，20A负载，2.5mm²铜芯230V：VD = 33.60 V（14.61%）</p>
            <p><strong>案例2：</strong>同样线路用1.5mm²：VD = 56.00 V（24.35%）</p>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>所有计算结果仅供参照。</div>
        </div>
      </main>
    </>
  )
}
