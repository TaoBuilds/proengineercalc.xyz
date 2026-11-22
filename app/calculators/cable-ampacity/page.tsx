'use client'

import { useState } from 'react'
import Link from 'next/link'
import {estimateCableAmpacity, INSTALL_METHODS} from '../../../lib/cable-ampacity'
import type {ConductorMaterial, InstallMethod} from '../../../lib/cable-ampacity'

export default function CableAmpacity() {
  const [conductorType, setConductorType] = useState<ConductorMaterial>('copper')
  const [size, setSize] = useState(2.5)
  const [installMethod, setInstallMethod] = useState<InstallMethod>('B1')
  const [temp, setTemp] = useState('30')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    try {
      setResult(estimateCableAmpacity(conductorType, size, installMethod, parseFloat(temp)))
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
          <h1 className="page-title">电缆载流量计算器</h1>

          <div className="calculator-form">
            <div className="form-group">
              <label htmlFor="cable-ampacity-field-1">导体材质</label>
              <select id="cable-ampacity-field-1" value={conductorType} onChange={(e) => setConductorType(e.target.value as ConductorMaterial)}>
                <option value="copper">铜</option>
                <option value="aluminum">铝</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cable-ampacity-field-2">导体截面积 (mm²)</label>
              <input id="cable-ampacity-field-2" type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>

            <div className="form-group">
              <label htmlFor="cable-ampacity-field-3">敷设方式</label>
              <select id="cable-ampacity-field-3" value={installMethod} onChange={(e) => setInstallMethod(e.target.value as InstallMethod)}>
                {Object.entries(INSTALL_METHODS).map(([code, method]) => (
                  <option key={code} value={code}>{code} - {method.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cable-ampacity-field-4">环境温度 (°C)</label>
              <input id="cable-ampacity-field-4" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
            </div>

            <button onClick={calculate} style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>计算</button>

            {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
            {result !== null && (
              <div className="result-group" role="status">
                <h4>计算结果</h4>
                <div className="result-item">
                  <span className="result-label">估算载流量</span>
                  <span className="result-value">{result} A</span>
                </div>
              </div>
            )}
          </div>

          <div className="content-section">
            <h2>公式与原理</h2>
            <p>电缆载流量根据导体截面积、材质、敷设方式和环境温度计算。</p>
            <div className="formula-box">
              I = I_base × F_method × F_temp<br/><br/>
              其中:<br/>
              I = 载流量 (A)<br/>
              I_base = 按导体材质和截面积查表的基准电流 (A)<br/>
              F_method = 敷设方式系数<br/>
              F_temp = 温度系数（30°C 及以下取 1，高于 30°C 采用 70°C 导体温度的简化模型）
            </div>
          </div>

          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>选择导体材质（铜或铝）</li>
              <li>输入电缆截面积（mm²）</li>
              <li>选择敷设方式</li>
              <li>输入环境温度</li>
              <li>点击计算</li>
            </ol>
          </div>

          <div className="disclaimer">
            <strong>免责声明：</strong>所有计算结果仅供参照之用。请勿将计算结果作为工程设计或施工的最终依据。
          </div>
        </div>
      </main>
    </>
  )
}
