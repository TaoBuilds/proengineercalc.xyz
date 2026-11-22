'use client'

import { useState } from 'react'
import Link from 'next/link'

import {calculatePipePressure, PIPE_FLUIDS} from '../../../lib/pipe-pressure'
import type {PipeFluid} from '../../../lib/pipe-pressure'

export default function PipePressure() {
  const [flow,      setFlow]      = useState('50')
  const [diameter,  setDiameter]  = useState('100')
  const [length,    setLength]    = useState('100')
  const [fluid,     setFluid]     = useState<PipeFluid>('water20')
  const [roughness, setRoughness] = useState('0.046')
  const [result,    setResult]    = useState<ReturnType<typeof calculatePipePressure> | null>(null)
  const [error,     setError]     = useState('')

  const calculate = () => {
    try {
      setResult(calculatePipePressure(
        parseFloat(flow), parseFloat(diameter), parseFloat(length), fluid, parseFloat(roughness),
      ))
      setError('')
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : '输入参数无效')
    }
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/fluid">流体力学</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">管道压力损失计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="pipe-pressure-field-1">流量 (m³/h)</label><input id="pipe-pressure-field-1" type="number" min="0" step="any" value={flow} onChange={(e) => setFlow(e.target.value)} /></div>
            <div className="form-group"><label htmlFor="pipe-pressure-field-2">管径 (mm)</label><input id="pipe-pressure-field-2" type="number" min="0" step="any" value={diameter} onChange={(e) => setDiameter(e.target.value)} /></div>
            <div className="form-group"><label htmlFor="pipe-pressure-field-3">管道长度 (m)</label><input id="pipe-pressure-field-3" type="number" min="0" step="any" value={length} onChange={(e) => setLength(e.target.value)} /></div>
            <div className="form-group">
              <label htmlFor="pipe-pressure-field-4">流体</label>
              <select id="pipe-pressure-field-4" value={fluid} onChange={(e) => setFluid(e.target.value as PipeFluid)}>
                {Object.entries(PIPE_FLUIDS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label htmlFor="pipe-pressure-field-5">管材粗糙度 (mm) — 钢管默认 0.046</label><input id="pipe-pressure-field-5" type="number" min="0" step="any" value={roughness} onChange={(e) => setRoughness(e.target.value)} /></div>
            {error && <p role="alert" style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>}
            <button onClick={calculate} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}>计算</button>
            {result && (
              <div className="result-group" role="status">
                <div className="result-item"><span className="result-label">流速</span><span className="result-value">{result.v.toFixed(3)} m/s</span></div>
                <div className="result-item"><span className="result-label">雷诺数 Re</span><span className="result-value">{result.Re.toFixed(0)}</span></div>
                <div className="result-item"><span className="result-label">流态</span><span className="result-value">{result.regime}</span></div>
                <div className="result-item"><span className="result-label">摩擦系数 f</span><span className="result-value">{result.f.toFixed(5)}</span></div>
                <div className="result-item"><span className="result-label">水头损失</span><span className="result-value">{result.hf.toFixed(3)} m</span></div>
                <div className="result-item"><span className="result-label">压力损失 ΔP</span><span className="result-value">{result.dP.toFixed(3)} kPa</span></div>
              </div>
            )}
          </div>

          <div className="content-section">
            <h2>计算公式</h2>
            <div className="formula-box">
              <p>Darcy-Weisbach 方程：hf = f · (L/d) · v² / (2g)</p>
              <p>ΔP = ρ · g · hf / 1000 (kPa)</p>
              <p>层流 (Re &lt; 2300)：f = 64 / Re</p>
              <p>湍流 — Swamee-Jain 显式公式：</p>
              <p>f = 0.25 / [lg(ε/(3.7d) + 5.74/Re⁰·⁹)]²</p>
            </div>
          </div>

          <div className="content-section">
            <h2>使用说明</h2>
            <ul>
              <li>输入管道实际内径（非公称直径）</li>
              <li>钢管粗糙度通常取 0.046 mm，铸铁管取 0.26 mm，塑料管取 0.0015 mm</li>
              <li>Re &lt; 2300 为层流，Re ≥ 4000 为湍流，过渡区沿用显式近似，结果对工况更敏感</li>
              <li>结果仅为沿程损失，局部损失需另行计算</li>
            </ul>
          </div>

          <div className="content-section">
            <h2>常见问题</h2>
            <p><strong>Q：为什么层流和湍流用不同公式？</strong><br />层流中摩擦系数仅与 Re 有关（f=64/Re），湍流时管壁粗糙度也起作用，需用 Colebrook-White 方程（此处用等效的 Swamee-Jain 显式近似）。</p>
            <p><strong>Q：局部损失如何估算？</strong><br />通常取沿程损失的 10%～30% 作为局部损失附加量，或用当量长度法逐一计算弯头、阀门等。</p>
            <p><strong>Q：工业管道推荐流速是多少？</strong><br />水管一般 1～3 m/s，蒸汽管 20～40 m/s，油管 0.5～2 m/s。</p>
          </div>

          <div className="content-section">
            <h2>计算案例</h2>
            <p><strong>案例：</strong>实际内径 100 mm 的钢管，长 50 m，输送 20°C 水，流量 30 m³/h，粗糙度 0.046 mm。</p>
            <p>v = 30/3600 / (π×0.05²) ≈ 1.06 m/s，Re ≈ 106000（湍流）</p>
            <p>f ≈ 0.02008，hf ≈ 0.576 m，ΔP ≈ 5.641 kPa</p>
          </div>

          <div className="disclaimer"><strong>免责声明：</strong>本计算器仅供工程参考，实际设计须由专业工程师复核。</div>
        </div>
      </main>
    </>
  )
}
