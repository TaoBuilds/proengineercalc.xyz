'use client'

import {calculatorError} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'
import type {ConductorMaterial} from '@/lib/cable-ampacity'
import {calculateVoltageDrop, calculateDropLimitedCurrent, calculateMinimumArea} from '@/lib/voltage-drop'

type Result =
  | {mode: 'vd'; dropV: number; dropPercent: number; loadVoltageV: number}
  | {mode: 'current'; currentA: number}
  | {mode: 'size'; areaMm2: number}

export default function VoltageDrop() {
  const t = useTranslation()
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
      setError(calculatorError(t, err, '输入参数无效', "Invalid inputs."))
    }
  }

  return (
    <CalculatorWorkbench
      slug="voltage-drop"
      inputs={
        <>
          <div className="form-group"><label htmlFor="voltage-drop-field-1">{t("计算模式", "Calculation mode")}</label>
              <select id="voltage-drop-field-1" value={mode} onChange={(e)=>changeMode(e.target.value as Result['mode'])}>
                <option value="vd">{t("计算电压降", "Find voltage drop")}</option>
                <option value="current">{t("计算最大电流", "Find maximum current")}</option>
                <option value="size">{t("计算所需电缆截面积", "Find minimum conductor area")}</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="voltage-drop-field-2">{t("系统电压 (V)", "System voltage (V)")}</label><input id="voltage-drop-field-2" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)}/></div>
          {mode !== 'current' && <div className="form-group"><label htmlFor="voltage-drop-field-3">{t("电流 (A)", "Current (A)")}</label><input id="voltage-drop-field-3" type="number" value={current} onChange={(e)=>setCurrent(e.target.value)}/></div>}
          <div className="form-group"><label htmlFor="voltage-drop-field-4">{t("线路长度 (m) - 单程", "One-way circuit length (m)")}</label><input id="voltage-drop-field-4" type="number" value={length} onChange={(e)=>setLength(e.target.value)}/></div>
          {mode !== 'size' && <div className="form-group"><label htmlFor="voltage-drop-field-5">{t("导体截面积 (mm²)", "Conductor cross-sectional area (mm²)")}</label>
              <select id="voltage-drop-field-5" value={size} onChange={(e)=>setSize(e.target.value)}>
                <option value="1.5">1.5 mm²</option><option value="2.5">2.5 mm²</option><option value="4">4 mm²</option><option value="6">6 mm²</option><option value="10">10 mm²</option><option value="16">16 mm²</option><option value="25">25 mm²</option>
              </select>
            </div>}
          <div className="form-group"><label htmlFor="voltage-drop-field-6">{t("材质", "Conductor material")}</label>
              <select id="voltage-drop-field-6" value={material} onChange={(e)=>setMaterial(e.target.value as ConductorMaterial)}>
                <option value="copper">{t("铜", "Copper")}</option><option value="aluminum">{t("铝", "Aluminum")}</option>
              </select>
            </div>
          {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          {result.mode === 'vd' && (
            <>
              <div className="result-item"><span className="result-label">{t("电压降", "Voltage drop")}</span><span className="result-value">{result.dropV.toFixed(2)} V ({result.dropPercent.toFixed(2)}%)</span></div>
              <div className="result-item"><span className="result-label">{t("负载端电压", "Load-terminal voltage")}</span><span className="result-value">{result.loadVoltageV.toFixed(1)} V</span></div>
            </>
          )}
          {result.mode === 'current' && <div className="result-item"><span className="result-label">{t("按 3% 压降估算的电流上限", "Current limit at 3% voltage drop")}</span><span className="result-value">{result.currentA.toFixed(2)} A</span></div>}
          {result.mode === 'size' && <div className="result-item"><span className="result-label">{t("按 3% 压降估算的最小截面积", "Minimum conductor area at 3% voltage drop")}</span><span className="result-value">{result.areaMm2.toFixed(2)} mm²</span></div>}
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("此处使用双线回路的电阻模型，适用于直流或忽略电抗的单相估算。计算采用 1.2 的电阻修正系数。", "The tool uses a two-wire resistance model with a 1.2 resistance multiplier. It applies to DC or preliminary single-phase estimates where reactance can be neglected.")}</p>
        <div className="formula-box">
          R = ρ × L × 2 × 1.2 / A<br/>
          VD = I × R<br/><br/>
          {t("其中:", "Where")}<br/>
          {t("ρ = 电阻率 (Ω·mm²/m)", "ρ = resistivity (Ω·mm²/m)")}<br/>
          {t("L = 单程长度 (m)", "L = one-way length (m)")}<br/>
          {t("A = 截面积 (mm²)", "A = cross-sectional area (mm²)")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择计算模式", "Choose a calculation mode.")}</li>
          <li>{t("输入回路电源电压（V）", "Enter the supply voltage in volts.")}</li>
          <li>{t("输入负载电流或线路长度", "Enter the one-way length and the required current, where applicable.")}</li>
          <li>{t("选择导体材质和截面积", "Choose conductor material and enter area if the mode requires it.")}</li>
          <li>{t("点击计算查看结果", "Select Calculate to see the estimated result.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("为什么是3%？", "Why use a 3% target?")}</p><p className="faq-answer">{t("这里把 3% 用作与压降相关的筛选目标。实际限值、线缆载流量和标准截面积需按项目要求复核。", "The tool uses 3% as a screening target for voltage drop. Check the project’s allowable drop, cable ampacity, and available conductor sizes separately.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("铜和铝哪个好？", "How do copper and aluminum compare?")}</p><p className="faq-answer">{t("铜的电阻率更低（0.0175 vs 0.0283 Ω·mm²/m），所以铜电缆可以用更小的截面积承载相同的电流。", "Copper has lower resistivity (0.0175 versus 0.0283 Ω·mm²/m). For the same length and current, a smaller copper area can give the same resistive voltage drop.")}</p></div>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Examples")}</h2>
        <p><strong>{t("案例1：", "Example 1")}</strong>{' '}{t("100m线路，20A负载，2.5mm²铜芯230V：VD = 33.60 V（14.61%）", "A 100 m one-way circuit carries 20 A at 230 V with a 2.5 mm² copper conductor. The drop is 33.60 V (14.61%).")}</p>
        <p><strong>{t("案例2：", "Example 2")}</strong>{' '}{t("同样线路用1.5mm²：VD = 56.00 V（24.35%）", "Using 1.5 mm² copper in the same circuit gives a drop of 56.00 V (24.35%).")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照。", "Use the results for reference.")}</div>
    </CalculatorWorkbench>
  )
}
