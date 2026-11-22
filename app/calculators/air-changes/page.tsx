'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AirChanges() {
  const [roomL, setRoomL] = useState('10')
  const [roomW, setRoomW] = useState('8')
  const [roomH, setRoomH] = useState('3')
  const [achPreset, setAchPreset] = useState('6')
  const [customAch, setCustomAch] = useState('')
  const [result, setResult] = useState<any>(null)

  const presets: Record<string, string> = {
    '6': '办公室 (6次/h)',
    '10': '实验室 (10次/h)',
    '20': '洁净室 (20次/h)',
    '30': '厨房 (30次/h)',
    '4': '停车场 (4次/h)',
    'custom': '自定义'
  }

  const calculate = () => {
    const L = parseFloat(roomL), W = parseFloat(roomW), H = parseFloat(roomH)
    const ach = achPreset === 'custom' ? parseFloat(customAch) : parseFloat(achPreset)
    if (isNaN(L) || isNaN(W) || isNaN(H) || isNaN(ach)) return
    const volume = L * W * H
    const flowRate = volume * ach
    const area = flowRate / 3600 / 6
    const diameter = Math.sqrt(4 * area / Math.PI) * 1000
    setResult({ volume: volume.toFixed(1), ach, flowRate: flowRate.toFixed(0), diameter: diameter.toFixed(0) })
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/hvac">暖通空调</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">换气次数计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="air-changes-field-1">房间长度 (m)</label><input id="air-changes-field-1" type="number" value={roomL} onChange={(e)=>setRoomL(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="air-changes-field-2">房间宽度 (m)</label><input id="air-changes-field-2" type="number" value={roomW} onChange={(e)=>setRoomW(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="air-changes-field-3">房间高度 (m)</label><input id="air-changes-field-3" type="number" value={roomH} onChange={(e)=>setRoomH(e.target.value)}/></div>
            <div className="form-group"><label htmlFor="air-changes-field-4">换气次数标准</label>
              <select id="air-changes-field-4" value={achPreset} onChange={(e)=>setAchPreset(e.target.value)}>
                {Object.entries(presets).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {achPreset === 'custom' && (
              <div className="form-group"><label htmlFor="air-changes-field-5">自定义换气次数 (次/h)</label><input id="air-changes-field-5" type="number" value={customAch} onChange={(e)=>setCustomAch(e.target.value)} placeholder="请输入换气次数"/></div>
            )}
            <button onClick={calculate} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:600,cursor:'pointer'}}>计算</button>
            {result && (
              <div className="result-group" role="status">
                <div className="result-item"><span className="result-label">房间体积</span><span className="result-value">{result.volume} m³</span></div>
                <div className="result-item"><span className="result-label">换气次数</span><span className="result-value">{result.ach} 次/h</span></div>
                <div className="result-item"><span className="result-label">所需风量</span><span className="result-value">{result.flowRate} m³/h</span></div>
                <div className="result-item"><span className="result-label">推荐风管直径 (6m/s)</span><span className="result-value">{result.diameter} mm</span></div>
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>换气次数（ACH）是衡量室内空气质量的重要指标，表示每小时房间内空气被完全更换的次数。</p>
            <div className="formula-box">
              V = L × W × H（房间体积，m³）<br/>
              Q = V × ACH（所需风量，m³/h）<br/>
              推荐风速 6 m/s 反算管径：A = Q / 3600 / 6，d = √(4A/π) × 1000
            </div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>输入房间的长、宽、高尺寸（单位：米）</li>
              <li>从下拉菜单选择适用场所的换气次数标准，或选择自定义输入</li>
              <li>点击"计算"按钮</li>
              <li>查看所需风量及推荐风管直径结果</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <p><strong>各场所换气次数标准参考：</strong></p>
            <p>办公室：6次/h</p>
            <p>会议室：8次/h</p>
            <p>实验室：10次/h</p>
            <p>洁净室：20次/h</p>
            <p>厨房：30次/h</p>
            <p>停车场：4次/h</p>
            <p>医院手术室：20次/h</p>
            <p><strong>换气次数越高意味着什么？</strong></p>
            <p>换气次数越高，室内空气越新鲜，但能耗也越大。应根据实际使用场景和规范要求合理选取。</p>
          </div>
          <div className="content-section">
            <h2>案例</h2>
            <p><strong>案例：</strong>某洁净室尺寸为 10×8×3m，换气次数要求 20次/h。</p>
            <p>房间体积 V = 10×8×3 = 240 m³</p>
            <p>所需风量 Q = 240×20 = 4800 m³/h</p>
            <p>按风速 6m/s 反算：A = 4800/3600/6 = 0.222 m²，推荐管径 ≈ 535 mm</p>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>所有计算结果仅供参考，实际工程设计请遵循相关规范并由专业工程师审核。</div>
        </div>
      </main>
    </>
  )
}
