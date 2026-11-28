'use client'

import {flowRegimeLabel} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

function calcPumpHead(Q_m3h: number, d_mm: number, L: number, staticHead: number, minorPct: number) {
  const Q = Q_m3h / 3600
  const d = d_mm / 1000
  const A = Math.PI * Math.pow(d / 2, 2)
  const v = Q / A
  const Re = (v * d) / 1e-6
  const f = Re < 2300 ? 64 / Re : 0.316 / Math.pow(Re, 0.25)
  const hf = f * (L / d) * (v * v) / (2 * 9.81)
  const h_minor = hf * minorPct / 100
  const H_total = hf + h_minor + staticHead
  const P_kW = (1000 * 9.81 * Q * H_total) / (1000 * 0.75)
  return { v, Re, f, hf, h_minor, H_total, P_kW }
}

export default function PumpHead() {
  const t = useTranslation()
  const [flow, setFlow] = useState('50')
  const [diameter, setDiameter] = useState('100')
  const [length, setLength] = useState('100')
  const [staticHead, setStaticHead] = useState('5')
  const [minorLoss, setMinorLoss] = useState('20')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const Q = parseFloat(flow)
    const d = parseFloat(diameter)
    const L = parseFloat(length)
    const sh = parseFloat(staticHead)
    const ml = parseFloat(minorLoss)
    if ([Q, d, L, sh, ml].some(isNaN) || Q <= 0 || d <= 0 || L <= 0) return
    const r = calcPumpHead(Q, d, L, sh, ml)
    setResult({
      velocity: r.v.toFixed(3),
      Re: r.Re.toFixed(0),
      flowRegime: r.Re < 2300 ? '层流' : r.Re > 4000 ? '湍流' : '过渡流',
      f: r.f.toFixed(5),
      hf: r.hf.toFixed(3),
      h_minor: r.h_minor.toFixed(3),
      H_total: r.H_total.toFixed(2),
      P_kW: r.P_kW.toFixed(3),
    })
  }

  return (
    <CalculatorWorkbench
      slug="pump-head"
      inputs={
        <>
          <div className="form-group"><label htmlFor="pump-head-field-1">{t("流量 (m³/h)", "Flow rate (m³/h)")}</label><input id="pump-head-field-1" type="number" min="0.1" step="0.1" value={flow} onChange={(e) => setFlow(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pump-head-field-2">{t("管道内径 (mm)", "Pipe inside diameter (mm)")}</label><input id="pump-head-field-2" type="number" min="1" value={diameter} onChange={(e) => setDiameter(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pump-head-field-3">{t("管道长度 (m)", "Pipe length (m)")}</label><input id="pump-head-field-3" type="number" min="0.1" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pump-head-field-4">{t("静扬程 (m)", "Static head (m)")}</label><input id="pump-head-field-4" type="number" min="0" step="0.5" value={staticHead} onChange={(e) => setStaticHead(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="pump-head-field-5">{t("局部损失系数 (%，占沿程损失的百分比)", "Minor losses (% of pipe friction loss)")}</label><input id="pump-head-field-5" type="number" min="0" max="200" value={minorLoss} onChange={(e) => setMinorLoss(e.target.value)} /></div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("管内流速", "Pipe velocity")}</span><span className="result-value">{result.velocity} m/s</span></div>
          <div className="result-item"><span className="result-label">{t("雷诺数 Re", "Reynolds number Re")}</span><span className="result-value">{result.Re} ({flowRegimeLabel(t, result.flowRegime)})</span></div>
          <div className="result-item"><span className="result-label">{t("摩擦系数 f", "Friction factor f")}</span><span className="result-value">{result.f}</span></div>
          <div className="result-item"><span className="result-label">{t("沿程摩擦损失 hf", "Pipe friction head loss hf")}</span><span className="result-value">{result.hf} m</span></div>
          <div className="result-item"><span className="result-label">{t("局部损失 h_minor", "Minor head loss h_minor")}</span><span className="result-value">{result.h_minor} m</span></div>
          <div className="result-item"><span className="result-label">{t("总扬程 H", "Total head H")}</span><span className="result-value">{result.H_total} m</span></div>
          <div className="result-item"><span className="result-label">{t("水泵功率估算 (η=75%)", "Estimated pump shaft power (η = 75%)")}</span><span className="result-value">{result.P_kW} kW</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("水泵扬程由沿程摩擦损失、局部损失和静扬程三部分组成。沿程损失采用 Darcy-Weisbach 公式计算，摩擦系数 f 根据雷诺数自动选取。", "Total pump head combines pipe friction loss, minor losses, and static head. Pipe friction uses the Darcy–Weisbach equation with a friction factor based on Reynolds number.")}</p>
        <div className="formula-box">
          {t("流速：v = Q / A，A = πd²/4", "Flow velocity v = Q / A, where A = πd²/4")}<br/>
          {t("雷诺数：Re = v·d / ν，ν = 1×10⁻⁶ m²/s（水，20°C）", "Reynolds number Re = v·d / ν, with ν = 1 × 10⁻⁶ m²/s for water at 20°C")}<br/><br/>
          {t("摩擦系数 f：", "Friction factor f")}<br/>
          　{t("层流 (Re < 2300)：f = 64 / Re", "Laminar flow (Re < 2300) uses f = 64 / Re.")}<br/>
          　{t("湍流 (Re > 4000)：f = 0.316 / Re^0.25（Blasius 公式）", "Turbulent flow (Re > 4000) uses the Blasius equation f = 0.316 / Re^0.25.")}<br/><br/>
          {t("沿程损失：hf = f · (L/d) · v² / (2g)", "Pipe friction head loss hf = f · (L/d) · v² / (2g)")}<br/>
          {t("局部损失：h_minor = hf × 局部损失系数%", "Minor head loss h_minor = hf × minor loss percentage")}<br/>
          {t("总扬程：H = hf + h_minor + 静扬程", "Total head H = hf + h_minor + static head")}<br/><br/>
          {t("水泵功率：P = ρgQH / (1000 × η)，η 取 0.75", "Pump shaft power P = ρgQH / (1000 × η), with η = 0.75")}
        </div>
        <p>{t("Blasius 公式适用于光滑管湍流区（Re = 4000–100000）。对于粗糙管或更高雷诺数，应使用 Colebrook-White 方程或 Moody 图。", "The Blasius equation applies to turbulent flow in smooth pipes (about Re = 4000–100,000). For rougher pipes or higher Reynolds numbers, use the Colebrook–White equation or a Moody chart.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入系统设计流量（m³/h）。", "Enter design flow in m³/h.")}</li>
          <li>{t("输入管道内径（注意是内径，不是公称直径）。", "Enter the actual pipe inside diameter.")}</li>
          <li>{t("输入管道总长度（主管道长度）。", "Enter the length of the main pipe run.")}</li>
          <li>{t("输入静扬程，即供水点与回水点的高度差。", "Enter the static head from the elevation difference between the relevant system points.")}</li>
          <li>{t("局部损失系数默认 20%，即弯头、阀门等局部阻力约为沿程阻力的 20%。复杂管网可适当提高至 30%–50%。", "The default minor loss allowance is 20% of pipe friction. Complex networks may require a higher allowance or a fitting-by-fitting calculation.")}</li>
          <li>{t("计算结果中的功率为轴功率估算，电机选型时需再除以电机效率（约 0.9–0.95）。", "The power result estimates shaft power. Divide by motor efficiency, typically about 0.90–0.95, to estimate motor electrical input power.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item">
          <p className="faq-question">{t("什么是扬程？", "What is pump head?")}</p>
          <p className="faq-answer">{t("扬程是水泵能够将液体提升的等效高度，单位为米（m）。它包含克服高度差所需的静扬程，以及克服管道摩擦和局部阻力所需的动扬程。", "Pump head is energy per unit weight of fluid, expressed in meters. It accounts for static lift and hydraulic losses.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("局部损失系数如何取值？", "How do I estimate minor losses?")}</p>
          <p className="faq-answer">{t("简单管路（弯头少、阀门少）取 10%–20%；一般空调水系统取 20%–30%；管件复杂的工业管路可取 30%–50%。精确计算需逐一统计各管件的局部阻力系数 ξ。", "For screening, allow 10–20% of pipe friction for simple systems and 20–30% for typical HVAC water systems. Industrial piping with many fittings may require 30–50%. For detailed work, use the loss coefficient of each fitting.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("为什么流速很重要？", "Why does flow velocity matter?")}</p>
          <p className="faq-answer">{t("流速过低会导致管道内沉积和腐蚀；流速过高会产生噪音、振动和较大压力损失。空调冷冻水系统推荐流速为 1.0–2.5 m/s，生活给水为 1.0–2.0 m/s。", "Very low velocity can allow deposits, while high velocity can increase noise, vibration, and pressure drop. Example ranges are 1.0–2.5 m/s for chilled water and 1.0–2.0 m/s for domestic water.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("计算结果与实际偏差大怎么办？", "Why might a measured result differ?")}</p>
          <p className="faq-answer">{t("本工具假设管道为光滑管、水温 20°C。实际工程中管道粗糙度、水温变化、管件数量等都会影响结果。建议在计算结果基础上增加 10%–20% 的安全余量。", "The model assumes a smooth pipe and water at 20°C. Actual roughness, fluid temperature, and fittings affect the result. Verify these conditions when sizing equipment.")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("案例分析", "Worked Example")}</h2>
        <p><strong>{t("案例：某空调冷冻水系统", "An HVAC chilled-water system")}</strong></p>
        <p>{t("条件：流量 50 m³/h，管道内径 100 mm，管道长度 100 m，静扬程 5 m，局部损失系数 20%。", "Flow is 50 m³/h through 100 m of pipe with a 100 mm inside diameter. Static head is 5 m and the minor loss allowance is 20%.")}</p>
        <div className="formula-box">
          A = π × (0.1/2)² = 7.854×10⁻³ m²<br/>
          v = (50/3600) / 7.854×10⁻³ = 1.768 m/s<br/>
          {t("Re = 1.768 × 0.1 / 1×10⁻⁶ = 176,800（湍流）", "Re = 1.768 × 0.1 / (1 × 10⁻⁶) = 176,800, indicating turbulent flow.")}<br/>
          f = 0.316 / 176800^0.25 = 0.01622<br/>
          hf = 0.01622 × (100/0.1) × 1.768² / (2×9.81) = 2.59 m<br/>
          h_minor = 2.59 × 20% = 0.52 m<br/>
          H = 2.59 + 0.52 + 5 = 8.11 m<br/>
          P = 1000×9.81×(50/3600)×8.11 / (1000×0.75) = 1.47 kW
        </div>
        <p>{t("结论：该系统所需扬程约 8.1 m，水泵轴功率约 1.47 kW，可选用扬程 10 m、功率 2.2 kW 的离心泵，留有足够余量。", "The screening estimate is about 8 m of head and 1.45 kW of shaft power. Check the pump and motor curves at the required flow when selecting equipment.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算结果仅供参考，不得直接用于正式工程设计。实际工程请委托具备资质的专业人员按相关规范进行计算。", "Use the estimate for reference. Have a qualified engineer verify the final design to applicable standards.")}</div>
    </CalculatorWorkbench>
  )
}
