'use client'

import {calculatorError, flowRegimeLabel} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

import {calculatePipePressure, PIPE_FLUIDS} from '@/lib/pipe-pressure'
import type {PipeFluid} from '@/lib/pipe-pressure'

export default function PipePressure() {
  const t = useTranslation()
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
      setError(calculatorError(t, err, '输入参数无效', "Invalid inputs."))
    }
  }

  return (
    <CalculatorWorkbench
      slug="pipe-pressure"
      inputs={
        <>
          <div className="form-group"><label htmlFor="pipe-pressure-field-1">{t("流量 (m³/h)", "Flow rate (m³/h)")}</label><input id="pipe-pressure-field-1" type="number" min="0" step="any" value={flow} onChange={(e) => setFlow(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pipe-pressure-field-2">{t("管径 (mm)", "Pipe inside diameter (mm)")}</label><input id="pipe-pressure-field-2" type="number" min="0" step="any" value={diameter} onChange={(e) => setDiameter(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pipe-pressure-field-3">{t("管道长度 (m)", "Pipe length (m)")}</label><input id="pipe-pressure-field-3" type="number" min="0" step="any" value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="pipe-pressure-field-4">{t("流体", "Fluid")}</label>
              <select id="pipe-pressure-field-4" value={fluid} onChange={(e) => setFluid(e.target.value as PipeFluid)}>
                {Object.entries(PIPE_FLUIDS).map(([k, f]) => <option key={k} value={k}>{t(f.label, f.enLabel)}</option>)}
              </select>
            </div>
          <div className="form-group"><label htmlFor="pipe-pressure-field-5">{t("管材粗糙度 (mm) — 钢管默认 0.046", "Pipe roughness (mm) — steel default 0.046")}</label><input id="pipe-pressure-field-5" type="number" min="0" step="any" value={roughness} onChange={(e) => setRoughness(e.target.value)} /></div>
          {error && <p role="alert" style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("流速", "Flow velocity")}</span><span className="result-value">{result.v.toFixed(3)} m/s</span></div>
          <div className="result-item"><span className="result-label">{t("雷诺数 Re", "Reynolds number Re")}</span><span className="result-value">{result.Re.toFixed(0)}</span></div>
          <div className="result-item"><span className="result-label">{t("流态", "Flow regime")}</span><span className="result-value">{flowRegimeLabel(t, result.regime)}</span></div>
          <div className="result-item"><span className="result-label">{t("摩擦系数 f", "Friction factor f")}</span><span className="result-value">{result.f.toFixed(5)}</span></div>
          <div className="result-item"><span className="result-label">{t("水头损失", "Head loss")}</span><span className="result-value">{result.hf.toFixed(3)} m</span></div>
          <div className="result-item"><span className="result-label">{t("压力损失 ΔP", "Pressure drop ΔP")}</span><span className="result-value">{result.dP.toFixed(3)} kPa</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("计算公式", "Formulas")}</h2>
        <div className="formula-box">
          <p>{t("Darcy-Weisbach 方程：hf = f · (L/d) · v² / (2g)", "Darcy–Weisbach equation hf = f · (L/d) · v² / (2g)")}</p>
          <p>ΔP = ρ · g · hf / 1000 (kPa)</p>
          <p>{t("层流 (Re < 2300)：f = 64 / Re", "Laminar flow (Re < 2300) uses f = 64 / Re.")}</p>
          <p>{t("湍流 — Swamee-Jain 显式公式：", "Turbulent flow uses the explicit Swamee–Jain approximation.")}</p>
          <p>f = 0.25 / [lg(ε/(3.7d) + 5.74/Re⁰·⁹)]²</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ul>
          <li>{t("输入管道实际内径（非公称直径）", "Enter the actual pipe inside diameter.")}</li>
          <li>{t("钢管粗糙度通常取 0.046 mm，铸铁管取 0.26 mm，塑料管取 0.0015 mm", "Typical roughness values are 0.046 mm for steel, 0.26 mm for cast iron, and 0.0015 mm for plastic.")}</li>
          <li>{t("Re < 2300 为层流，Re ≥ 4000 为湍流，过渡区沿用显式近似，结果对工况更敏感", "Re < 2300 is treated as laminar and Re ≥ 4000 as turbulent. The estimate in the transitional range is more sensitive to operating conditions.")}</li>
          <li>{t("结果仅为沿程损失，局部损失需另行计算", "The result covers straight-pipe friction only. Calculate minor losses separately.")}</li>
        </ul>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("Q：为什么层流和湍流用不同公式？", "Why are the formulas different for laminar and turbulent flow?")}</strong><br />{t("层流中摩擦系数仅与 Re 有关（f=64/Re），湍流时管壁粗糙度也起作用，需用 Colebrook-White 方程（此处用等效的 Swamee-Jain 显式近似）。", "In laminar flow, f depends only on Re (f = 64/Re). In turbulent flow, wall roughness also matters. This tool uses the explicit Swamee–Jain approximation to the Colebrook–White equation.")}</p>
        <p><strong>{t("Q：局部损失如何估算？", "How can I estimate minor losses?")}</strong><br />{t("通常取沿程损失的 10%～30% 作为局部损失附加量，或用当量长度法逐一计算弯头、阀门等。", "For preliminary screening, allow 10–30% of straight-pipe friction loss. For detailed calculations, account for fittings and valves individually using equivalent lengths or loss coefficients.")}</p>
        <p><strong>{t("Q：工业管道推荐流速是多少？", "What velocities are typical for industrial piping?")}</strong><br />{t("水管一般 1～3 m/s，蒸汽管 20～40 m/s，油管 0.5～2 m/s。", "Example ranges are 1–3 m/s for water, 20–40 m/s for steam, and 0.5–2 m/s for oil.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("计算案例", "Worked Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("实际内径 100 mm 的钢管，长 50 m，输送 20°C 水，流量 30 m³/h，粗糙度 0.046 mm。", "A 50 m steel pipe with a 100 mm inside diameter carries 20°C water at 30 m³/h. The roughness is 0.046 mm.")}</p>
        <p>{t("v = 30/3600 / (π×0.05²) ≈ 1.06 m/s，Re ≈ 106000（湍流）", "v = (30 / 3600) / (π × 0.05²) ≈ 1.06 m/s. Re ≈ 106,000, indicating turbulent flow.")}</p>
        <p>f ≈ 0.02008，hf ≈ 0.576 m，ΔP ≈ 5.641 kPa</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算器仅供工程参考，实际设计须由专业工程师复核。", "Use the result for engineering reference. Have a qualified engineer review the final design.")}</div>
    </CalculatorWorkbench>
  )
}
