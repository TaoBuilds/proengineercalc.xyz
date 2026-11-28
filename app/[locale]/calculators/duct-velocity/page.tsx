'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function DuctVelocity() {
  const t = useTranslation()
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
          <div className="form-group"><label htmlFor="duct-velocity-field-1">{t("计算模式", "Calculation mode")}</label>
              <select id="duct-velocity-field-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="velocity">{t("计算风速（已知流量）", "Find velocity from airflow")}</option>
                <option value="flowRate">{t("计算风量（已知风速）", "Find airflow from velocity")}</option>
                <option value="diameter">{t("计算管径（已知风速）", "Find diameter from velocity")}</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="duct-velocity-field-2">{t("风量 (m³/h)", "Airflow (m³/h)")}</label><input id="duct-velocity-field-2" type="number" value={flowRate} onChange={(e)=>setFlowRate(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="duct-velocity-field-3">{t("管径 (mm)", "Duct diameter (mm)")}</label><input id="duct-velocity-field-3" type="number" value={diameter} onChange={(e)=>setDiameter(e.target.value)}/></div>
        </>
      }
      result={result && (
        <div className="result-group">
          {result.velocity && <div className="result-item"><span className="result-label">{t("风速", "Air velocity")}</span><span className="result-value">{result.velocity} m/s</span></div>}
          {result.velocityFPM && <div className="result-item"><span className="result-label">{t("风速", "Air velocity")}</span><span className="result-value">{result.velocityFPM} fpm</span></div>}
          {result.flowRate && <div className="result-item"><span className="result-label">{t("风量", "Airflow")}</span><span className="result-value">{result.flowRate} m³/h</span></div>}
          {result.diameter && <div className="result-item"><span className="result-label">{t("所需管径", "Required duct diameter")}</span><span className="result-value">{result.diameter} mm</span></div>}
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("风管内空气流速是暖通空调系统设计的基础参数。适当的风速可确保舒适性和效率。", "Duct velocity affects comfort, noise, and efficiency in HVAC systems.")}</p>
        <div className="formula-box">V = Q / A<br/>A = πd²/4<br/>Q = m³/s, V = m/s</div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择计算模式", "Choose a calculation mode.")}</li>
          <li>{t("输入风量或风速", "Enter airflow or air velocity.")}</li>
          <li>{t("输入风管直径", "Enter duct diameter where requested.")}</li>
          <li>{t("点击计算", "Select Calculate.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("推荐风速是多少？", "What air velocity is recommended?")}</p><p className="faq-answer">{t("主管道：6-10 m/s。支管道：5-8 m/s。风口：2-5 m/s。", "Typical screening values are 6–10 m/s for mains, 5–8 m/s for branches, and 2–5 m/s at outlets.")}</p></div>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("2000 m³/h 风量通过 300mm 风管，流速 V = 7.85 m/s，在合理范围内。", "An airflow of 2000 m³/h through a 300 mm duct gives a velocity of about 7.85 m/s.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照。", "Use the results for reference.")}</div>
    </CalculatorWorkbench>
  )
}
