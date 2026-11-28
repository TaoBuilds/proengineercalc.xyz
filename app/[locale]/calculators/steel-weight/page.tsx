'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function SteelWeight() {
  const t = useTranslation()
  const [steelType, setSteelType] = useState('round')
  const [dim1, setDim1] = useState('')
  const [dim2, setDim2] = useState('')
  const [dim3, setDim3] = useState('')
  const [length, setLength] = useState('')
  const [result, setResult] = useState<any>(null)

  const density = 7850

  const typeLabels: Record<string, string> = {
    round: t('圆钢', "Round bar"),
    square: t('方钢', "Square bar"),
    flat: t('扁钢', "Flat bar"),
    angle: t('角钢', "Equal angle"),
    pipe: t('钢管', "Pipe")
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
    <CalculatorWorkbench
      slug="steel-weight"
      inputs={
        <>
          <div className="form-group"><label htmlFor="steel-weight-field-1">{t("钢材类型", "Steel section type")}</label>
              <select id="steel-weight-field-1" value={steelType} onChange={(e)=>{ setSteelType(e.target.value); setResult(null) }}>
                {Object.entries(typeLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          {steelType === 'round' && (
              <div className="form-group"><label htmlFor="steel-weight-field-2">{t("直径 (mm)", "Diameter (mm)")}</label><input id="steel-weight-field-2" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder={t("例如：20", "e.g. 20")}/></div>
            )}
          {steelType === 'square' && (
              <div className="form-group"><label htmlFor="steel-weight-field-3">{t("边长 (mm)", "Side length (mm)")}</label><input id="steel-weight-field-3" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder={t("例如：50", "e.g. 50")}/></div>
            )}
          {steelType === 'flat' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-4">{t("宽度 (mm)", "Width (mm)")}</label><input id="steel-weight-field-4" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder={t("例如：100", "e.g. 100")}/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-5">{t("厚度 (mm)", "Thickness (mm)")}</label><input id="steel-weight-field-5" type="number" value={dim2} onChange={(e)=>setDim2(e.target.value)} placeholder={t("例如：10", "e.g. 10")}/></div>
            </>)}
          {steelType === 'angle' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-6">{t("肢宽 b (mm)", "Leg width b (mm)")}</label><input id="steel-weight-field-6" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder={t("例如：75", "e.g. 75")}/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-7">{t("肢厚 t (mm)", "Leg thickness t (mm)")}</label><input id="steel-weight-field-7" type="number" value={dim2} onChange={(e)=>setDim2(e.target.value)} placeholder={t("例如：8", "e.g. 8")}/></div>
            </>)}
          {steelType === 'pipe' && (<>
              <div className="form-group"><label htmlFor="steel-weight-field-8">{t("外径 D (mm)", "Outside diameter D (mm)")}</label><input id="steel-weight-field-8" type="number" value={dim1} onChange={(e)=>setDim1(e.target.value)} placeholder={t("例如：114", "e.g. 114")}/></div>
              <div className="form-group"><label htmlFor="steel-weight-field-9">{t("壁厚 t (mm)", "Wall thickness t (mm)")}</label><input id="steel-weight-field-9" type="number" value={dim3} onChange={(e)=>setDim3(e.target.value)} placeholder={t("例如：6", "e.g. 6")}/></div>
            </>)}
          <div className="form-group"><label htmlFor="steel-weight-field-10">{t("长度 (m)", "Length (m)")}</label><input id="steel-weight-field-10" type="number" value={length} onChange={(e)=>setLength(e.target.value)} placeholder={t("例如：6", "e.g. 6")}/></div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("截面积", "Cross-sectional area")}</span><span className="result-value">{result.area} mm²</span></div>
          <div className="result-item"><span className="result-label">{t("每米重量", "Mass per meter")}</span><span className="result-value">{result.weightPerMeter} kg/m</span></div>
          <div className="result-item"><span className="result-label">{t("总重量", "Total mass")}</span><span className="result-value">{result.weight} kg</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("钢材重量由截面积、长度和密度决定。碳素钢密度取 7850 kg/m³。", "Steel mass equals cross-sectional area × length × density. This calculator uses 7850 kg/m³ for carbon steel.")}</p>
        <div className="formula-box">
          W = A × L × ρ（kg）<br/>
          {t("圆钢：A = π×(d/2)²", "Round bar A = π × (d/2)²")}<br/>
          {t("方钢：A = a²", "Square bar A = a²")}<br/>
          {t("扁钢：A = 宽 × 厚", "Flat bar A = width × thickness")}<br/>
          {t("角钢：A = (2b - t) × t", "Equal angle A = (2b − t) × t")}<br/>
          {t("钢管：A = π×[(D/2)² - ((D-2t)/2)²]", "Pipe A = π × [(D/2)² − ((D − 2t)/2)²]")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择钢材类型（圆钢、方钢、扁钢、角钢或钢管）", "Choose round bar, square bar, flat bar, equal angle, or pipe.")}</li>
          <li>{t("根据所选类型输入对应截面尺寸（单位：mm）", "Enter the section dimensions in millimeters.")}</li>
          <li>{t("输入钢材长度（单位：m）", "Enter the member length in meters.")}</li>
          <li>{t("点击\"计算\"查看截面积、每米重量及总重量", "Select Calculate to see area, mass per meter, and total mass.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("钢材密度为什么取 7850 kg/m³？", "Why use a density of 7850 kg/m³?")}</strong></p>
        <p>{t("7850 kg/m³ 是碳素结构钢和低合金钢的标准密度，适用于 Q235、Q345 等常用钢材。不锈钢密度约为 7900~8000 kg/m³，铝合金约为 2700 kg/m³。", "7850 kg/m³ is a nominal density for common carbon and low-alloy structural steels, including grades Q235 and Q345. Stainless grades are often around 7900–8000 kg/m³, and common aluminum alloys are around 2700 kg/m³.")}</p>
        <p><strong>{t("角钢截面积如何计算？", "How is an equal-angle section area calculated?")}</strong></p>
        <p>{t("等边角钢截面积近似公式：A = (2b - t) × t，其中 b 为肢宽，t 为肢厚。此为简化公式，精确值可查型钢手册。", "Use A ≈ (2b − t) × t, where b is leg width and t is leg thickness. Use section tables for exact properties that include the corner radii.")}</p>
        <p><strong>{t("计算结果与实际有偏差怎么办？", "Why might the actual mass differ?")}</strong></p>
        <p>{t("实际钢材因轧制公差、圆角等因素，重量与理论值略有差异，通常误差在 ±3% 以内。", "Rolling tolerances and corner geometry affect mass. Check the producer’s section data or measure the actual material where precision matters.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("计算一根 φ20 圆钢，长度 6m 的重量。", "Estimate the mass of a 6 m long round steel bar with a 20 mm diameter.")}</p>
        <p>{t("截面积：A = π×(0.02/2)² = 3.14×10⁻⁴ m² = 314.16 mm²", "Area A = π × (0.02/2)² ≈ 3.14 × 10⁻⁴ m² = 314.16 mm².")}</p>
        <p>{t("每米重量：314.16×10⁻⁶ × 7850 = 2.466 kg/m", "Mass per meter = 314.16 × 10⁻⁶ × 7850 ≈ 2.466 kg/m.")}</p>
        <p>{t("总重量：2.466 × 6 = 14.80 kg", "Total mass = 2.466 × 6 ≈ 14.80 kg.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考，实际工程设计请遵循相关规范并由专业工程师审核。", "Use the results for reference. Follow applicable standards and have a qualified engineer review final designs.")}</div>
    </CalculatorWorkbench>
  )
}
