'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function Power() {
  const t = useTranslation()
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
      setError(t('功率因数必须大于 0 且不超过 1', "Power factor must be greater than 0 and at most 1."))
      setResult(null)
      return
    }
    const needs = mode === 'power' ? [I, V] : mode === 'current' ? [P, V] : [P, I]
    if (needs.some(x => !Number.isFinite(x) || x <= 0)) {
      setError(t('请输入有效且大于 0 的电流、电压或有功功率', "Enter positive values for the required current, voltage, or real power."))
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
    <CalculatorWorkbench
      slug="power"
      inputs={
        <>
          <div className="form-group"><label htmlFor="power-field-1">{t("计算模式", "Calculation mode")}</label>
              <select id="power-field-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="power">{t("计算功率（已知电流+电压）", "Find power from current and voltage")}</option>
                <option value="current">{t("计算电流（已知功率+电压）", "Find current from power and voltage")}</option>
                <option value="voltage">{t("计算电压（已知功率+电流）", "Find voltage from power and current")}</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="power-field-2">{t("相数", "Phases")}</label>
              <select id="power-field-2" value={phase} onChange={(e)=>setPhase(e.target.value)}>
                <option value="single">{t("单相", "Single phase")}</option>
                <option value="three">{t("三相", "Three phase")}</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="power-field-3">{t("功率因数", "Power factor")}</label><input id="power-field-3" type="number" value={pf} onChange={(e)=>setPf(e.target.value)} step="0.01"/></div>
          <div className="form-group"><label htmlFor="power-field-4">{t("电流 (A)", "Current (A)")}{' '}{mode==='current'?'':'*'}</label><input id="power-field-4" type="number" value={current} onChange={(e)=>setCurrent(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="power-field-5">{t("电压 (V)", "Voltage (V)")}{' '}{mode==='voltage'?'':'*'}</label><input id="power-field-5" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="power-field-6">{t("功率 (W)", "Power (W)")}{' '}{mode==='power'?'':'*'}</label><input id="power-field-6" type="number" value={power} onChange={(e)=>setPower(e.target.value)}/></div>
          {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          {result.power && <div className="result-item"><span className="result-label">{t("有功功率", "Real power")}</span><span className="result-value">{result.power} W</span></div>}
          {result.apparent && <div className="result-item"><span className="result-label">{t("视在功率", "Apparent power")}</span><span className="result-value">{result.apparent} VA</span></div>}
          {result.reactive && <div className="result-item"><span className="result-label">{t("无功功率", "Reactive power")}</span><span className="result-value">{result.reactive} VAR</span></div>}
          {result.current && <div className="result-item"><span className="result-label">{t("电流", "Current")}</span><span className="result-value">{result.current} A</span></div>}
          {result.voltage && <div className="result-item"><span className="result-label">{t("电压", "Voltage")}</span><span className="result-value">{result.voltage} V</span></div>}
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("交流电路中的功率关系：", "AC power relationships")}</p>
        <div className="formula-box">
          {t("单相: P = V × I × PF", "Single phase P = V × I × PF")}<br/>
          {t("三相: P = √3 × V_L × I_L × PF", "Three phase P = √3 × V_L × I_L × PF")}<br/><br/>
          {t("单相 S = V × I；三相 S = √3 × V_L × I_L（视在功率）", "Apparent power S = V × I for single phase and √3 × V_L × I_L for three phase.")}<br/>
          {t("Q = √(S² - P²)（无功功率）", "Reactive power Q = √(S² − P²).")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择计算模式：功率、电流或电压", "Choose whether to calculate power, current, or voltage.")}</li>
          <li>{t("选择单相或三相系统", "Choose single-phase or three-phase supply.")}</li>
          <li>{t("输入功率因数（电机通常0.85-0.95）", "Enter power factor. Typical motor values are 0.85–0.95.")}</li>
          <li>{t("输入任意两个值（I、V、P）", "Enter the two known quantities.")}</li>
          <li>{t("点击计算", "Select Calculate.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("为什么功率因数重要？", "Why does power factor matter?")}</p><p className="faq-answer">{t("PF表示功率的使用效率。PF=1表示所有功率都做有用功。电机、变压器因无功功率而PF较低。", "Power factor is the ratio of real power to apparent power. For the same real power and voltage, a lower power factor requires more current.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("单相和三相的区别？", "How do single-phase and three-phase systems differ?")}</p><p className="faq-answer">{t("三相用于工业负荷和远距离电力传输。单相常见于住宅。", "Three-phase supply is common for industrial loads and power distribution. Single-phase supply is common in homes.")}</p></div>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Examples")}</h2>
        <p><strong>{t("案例1：", "Example 1")}</strong>{' '}{t("10HP电机，480V三相：I = 7460/(480×0.89×√3) = 10.1A", "For a 7460 W load at 480 V three phase and PF = 0.89, I = 7460 / (480 × 0.89 × √3) ≈ 10.1 A.")}</p>
        <p><strong>{t("案例2：", "Example 2")}</strong>{' '}{t("2000W负载，230V单相：I = 2000/(230×0.9) = 9.7A", "A 2000 W single-phase load at 230 V and PF = 0.90 draws I = 2000 / (230 × 0.90) ≈ 9.7 A.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("计算基于平衡正弦交流稳态；三相电压应输入线电压。设备选型需考虑谐波、启动及实际负载。", "The calculation assumes balanced, steady-state sinusoidal AC. Enter line-to-line voltage for three phase. Account for harmonics, starting current, and actual loads when selecting equipment.")}</div>
    </CalculatorWorkbench>
  )
}
