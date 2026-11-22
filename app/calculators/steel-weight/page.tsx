'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SteelWeight() {
  const [steelType, setSteelType] = useState('round')
  const [dim1, setDim1] = useState('')
  const [dim2, setDim2] = useState('')
  const [dim3, setDim3] = useState('')
  const [length, setLength] = useState('')
  const [result, setResult] = useState<any>(null)

  const density = 7850

  const typeLabels: Record<string, string> = {
    round: '圆钢',
    square: '方钢',
    flat: '扁钢',
    angle: '角钢',
    pipe: '钢管'
  }

  const calculate = () => {
    const L = parseFloat(length)
    if (isNaN(L) || L <= 0) return
    let area = 0
    if (steelType === 'round') {
      const d = parseFloat(dim1) / 1000
      if (isNaN(d)) return
      area = Math.PI * Math.pow(d / 2, 2)
    } else if (steelType === 'square') {
      const a = parseFloat(dim1) / 1000
      if (isNaN(a)) return
      area = a * a
    } else if (steelType === 'flat') {
      const w = parseFloat(dim1) / 1000, t = parseFloat(dim2) / 1000
      if (isNaN(w) || isNaN(t)) return
      area = w * t
    } else if (steelType === 'angle') {
      const b = parseFloat(dim1) / 1000, t = parseFloat(dim2) / 1000
      if (isNaN(b) || isNaN(t)) return
      area = (2 * b - t) * t
    } else if (steelType === 'pipe') {
      const D = parseFloat(dim1) / 1000, t = parseFloat(dim3) / 1000
      if (isNaN(D) || isNaN(t)) return
      area = Math.PI * (Math.pow(D / 2, 2) - Math.pow((D - 2 * t) / 2, 2))
    }
    if (area <= 0) return
    const weight = area * L * density
    setResult({
      area: (area * 1e6).toFixed(2),
      weight: weight.toFixed(2),
      weightPerMeter: (area * density).toFixed(3)
    })
  }

  return (
    <>
      <main id="main-content" className="container">
        <div className="calculator-breadcrumb"><Link href="/#calculator-directory">计算器</Link><span aria-hidden="true">/</span><Link href="/calculators/structure">结构工程</Link></div>
        <div className="calculator-container">
          <h1 className="page-title">钢材重量计算器</h1>
          <div className="calculator-form">
            <div className="form-group"><label htmlFor="steel-weight-field-1">钢材类型</label>
              <select id="steel-weight-field-1" value={steelType} onChange={(e)=>{ setSteelType(e.target.value); setResult(null) }}>
                {Object.entries(typeLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {steelType === 'round' && (
              <div className="form-group"><label htmlFor="steel-weight-field-2">直径 (mm)</label><input id="steel-weight-field-2" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder="例如：20"/></div>
            )}
            {steelType === 'square' && (
              <div className="form-group"><label htmlFor="steel-weight-field-3">边长 (mm)</label><input id="steel-weight-field-3" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder="例如：50"/></div>
            )}
            {steelType === 'flat' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-4">宽度 (mm)</label><input id="steel-weight-field-4" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder="例如：100"/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-5">厚度 (mm)</label><input id="steel-weight-field-5" type="number" value={dim2} onChange={(e)=>setDim2(e.target.value)} placeholder="例如：10"/></div>
            </>)}
            {steelType === 'angle' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-6">肢宽 b (mm)</label><input id="steel-weight-field-6" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder="例如：75"/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-7">肢厚 t (mm)</label><input id="steel-weight-field-7" type="number" value={dim2} onChange={(e)=>setDim2(e.target.value)} placeholder="例如：8"/></div>
            </>)}
            {steelType === 'pipe' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-8">外径 D (mm)</label><input id="steel-weight-field-8" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder="例如：114"/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-9">壁厚 t (mm)</label><input id="steel-weight-field-9" type="number" value={dim3} onChange={(e)=>setDim3(e.target.value)} placeholder="例如：6"/></div>
            </>)}
            <div className="form-group"><label htmlFor="steel-weight-field-10">长度 (m)</label><input id="steel-weight-field-10" type="number" value={length} onChange={(e)=>setLength(e.target.value)} placeholder="例如：6"/></div>
            <button onClick={calculate} style={{width:'100%',padding:'1rem',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:600,cursor:'pointer'}}>计算</button>
            {result && (
              <div className="result-group" role="status">
                <div className="result-item"><span className="result-label">截面积</span><span className="result-value">{result.area} mm²</span></div>
                <div className="result-item"><span className="result-label">每米重量</span><span className="result-value">{result.weightPerMeter} kg/m</span></div>
                <div className="result-item"><span className="result-label">总重量</span><span className="result-value">{result.weight} kg</span></div>
              </div>
            )}
          </div>
          <div className="content-section">
            <h2>公式与原理</h2>
            <p>钢材重量由截面积、长度和密度决定。碳素钢密度取 7850 kg/m³。</p>
            <div className="formula-box">
              W = A × L × ρ（kg）<br/>
              圆钢：A = π×(d/2)²<br/>
              方钢：A = a²<br/>
              扁钢：A = 宽 × 厚<br/>
              角钢：A = (2b - t) × t<br/>
              钢管：A = π×[(D/2)² - ((D-2t)/2)²]
            </div>
          </div>
          <div className="content-section">
            <h2>使用说明</h2>
            <ol>
              <li>选择钢材类型（圆钢、方钢、扁钢、角钢或钢管）</li>
              <li>根据所选类型输入对应截面尺寸（单位：mm）</li>
              <li>输入钢材长度（单位：m）</li>
              <li>点击"计算"查看截面积、每米重量及总重量</li>
            </ol>
          </div>
          <div className="content-section">
            <h2>常见问题</h2>
            <p><strong>钢材密度为什么取 7850 kg/m³？</strong></p>
            <p>7850 kg/m³ 是碳素结构钢和低合金钢的标准密度，适用于 Q235、Q345 等常用钢材。不锈钢密度约为 7900~8000 kg/m³，铝合金约为 2700 kg/m³。</p>
            <p><strong>角钢截面积如何计算？</strong></p>
            <p>等边角钢截面积近似公式：A = (2b - t) × t，其中 b 为肢宽，t 为肢厚。此为简化公式，精确值可查型钢手册。</p>
            <p><strong>计算结果与实际有偏差怎么办？</strong></p>
            <p>实际钢材因轧制公差、圆角等因素，重量与理论值略有差异，通常误差在 ±3% 以内。</p>
          </div>
          <div className="content-section">
            <h2>案例</h2>
            <p><strong>案例：</strong>计算一根 φ20 圆钢，长度 6m 的重量。</p>
            <p>截面积：A = π×(0.02/2)² = 3.14×10⁻⁴ m² = 314.16 mm²</p>
            <p>每米重量：314.16×10⁻⁶ × 7850 = 2.466 kg/m</p>
            <p>总重量：2.466 × 6 = 14.80 kg</p>
          </div>
          <div className="disclaimer"><strong>免责声明：</strong>所有计算结果仅供参考，实际工程设计请遵循相关规范并由专业工程师审核。</div>
        </div>
      </main>
    </>
  )
}
