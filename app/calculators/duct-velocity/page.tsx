'use client'

import { useState } from 'react'
import CalculatorWorkbench from '../../../components/CalculatorWorkbench'

export default function DuctVelocity() {
  const [mode, setMode] = useState('velocity')
  const [flowRate, setFlowRate] = useState('')
  const [diameter, setDiameter] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState<any>(null)

  const calculateVelocity = () => {
    const Q = parseFloat(flowRate) / 3600
    const d = parseFloat(diameter) / 1000
    const A = Math.PI * Math.pow(d/2, 2)
    const v = Q / A
    setResult({ velocity: v.toFixed(2), velocityFPM: (v * 196.85).toFixed(0), area: (A*1e6).toFixed(0) })
  }

  const calculateFlowRate = () => {
    const d = parseFloat(diameter) / 1000
    const v = parseFloat(flowRate)  // flowRate field reused for velocity input in this mode
    const A = Math.PI * Math.pow(d/2, 2)
    const Q = v * A * 3600
    setResult({ flowRate: Q.toFixed(1), velocity: v.toFixed(2), area: (A*1e6).toFixed(0) })
  }

  const calculateDiameter = () => {
    const Q = parseFloat(flowRate) / 3600
    const v = parseFloat(diameter)  // diameter field reused for velocity input in this mode
    const A = Q / v
    const d = Math.sqrt(4 * A / Math.PI) * 1000
    setResult({ diameter: d.toFixed(0), velocity: v.toFixed(2), flowRate: parseFloat(flowRate).toFixed(1) })
  }

  const calculate = () => {
    if (mode === 'velocity') calculateVelocity()
    else if (mode === 'flowRate') calculateFlowRate()
    else calculateDiameter()
  }

  return (
    <CalculatorWorkbench
      slug="duct-velocity"
      inputs={
        <>
          <div className="form-group"><label htmlFor="duct-velocity-field-1">计算模式</label>
              <select id="duct-velocity-field-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="velocity">计算风速（已知流量）</option>
                <option value="flowRate">计算风量（已知风速）</option>
                <option value="diameter">计算管径（已知风速）</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="duct-velocity-field-2">风量 (m³/h)</label><input id="duct-velocity-field-2" type="number" value={flowRate} onChange={(e)=>setFlowRate(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="duct-velocity-field-3">管径 (mm)</label><input id="duct-velocity-field-3" type="number" value={diameter} onChange={(e)=>setDiameter(e.target.value)}/></div>
        </>
      }
      result={result && (
        <div className="result-group">
          {result.velocity && <div className="result-item"><span className="result-label">风速</span><span className="result-value">{result.velocity} m/s</span></div>}
          {result.velocityFPM && <div className="result-item"><span className="result-label">风速</span><span className="result-value">{result.velocityFPM} fpm</span></div>}
          {result.flowRate && <div className="result-item"><span className="result-label">风量</span><span className="result-value">{result.flowRate} m³/h</span></div>}
          {result.diameter && <div className="result-item"><span className="result-label">所需管径</span><span className="result-value">{result.diameter} mm</span></div>}
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>公式与原理</h2>
        <p>风管内空气流速是暖通空调系统设计的基础参数。适当的风速可确保舒适性和效率。</p>
        <div className="formula-box">V = Q / A<br/>A = πd²/4<br/>Q = m³/s, V = m/s</div>
      </div>
      <div className="content-section">
        <h2>使用说明</h2>
        <ol>
          <li>选择计算模式</li>
          <li>输入风量或风速</li>
          <li>输入风管直径</li>
          <li>点击计算</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>常见问题</h2>
        <div className="faq-item"><p className="faq-question">推荐风速是多少？</p><p className="faq-answer">主管道：6-10 m/s。支管道：5-8 m/s。风口：2-5 m/s。</p></div>
      </div>
      <div className="content-section">
        <h2>案例</h2>
        <p><strong>案例：</strong>2000 m³/h 风量通过 300mm 风管，流速 V = 7.85 m/s，在合理范围内。</p>
      </div>
      <div className="disclaimer"><strong>免责声明：</strong>所有计算结果仅供参照。</div>
    </CalculatorWorkbench>
  )
}
