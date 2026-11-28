'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

const E_OPTIONS = [
  { label: '钢 200 GPa', enLabel: "Steel, 200 GPa",    value: '200' },
  { label: '混凝土 30 GPa', enLabel: "Concrete, 30 GPa", value: '30'  },
]

function calcBeam(w: number, L: number, b: number, h: number, E_GPa: number) {
  const I = (b * h ** 3) / 12
  const M_max = (w * L ** 2) / 8
  const E_MPa = E_GPa * 1000
  const L_mm = L * 1000
  const delta = (5 * w * L_mm ** 4) / (384 * E_MPa * I)
  const sigma = (M_max * 1e6 * (h / 2)) / I
  const delta_allow = L_mm / 300
  const passes = delta <= delta_allow
  return { I, M_max, delta, sigma, delta_allow, passes }
}

export default function BeamLoad() {
  const t = useTranslation()
  const [load,   setLoad]   = useState('10')
  const [length, setLength] = useState('6')
  const [width,  setWidth]  = useState('200')
  const [height, setHeight] = useState('400')
  const [eVal,   setEVal]   = useState('200')
  const [result, setResult] = useState<ReturnType<typeof calcBeam> | null>(null)
  const [error,  setError]  = useState('')

  const calculate = () => {
    setError('')
    const w = parseFloat(load)
    const L = parseFloat(length)
    const b = parseFloat(width)
    const h = parseFloat(height)
    const E = parseFloat(eVal)
    if ([w, L, b, h, E].some((n) => isNaN(n) || n <= 0)) {
      setError(t('请输入有效的正数', "Enter valid positive numbers."))
      return
    }
    setResult(calcBeam(w, L, b, h, E))
  }

  return (
    <CalculatorWorkbench
      slug="beam-load"
      inputs={
        <>
          <div className="form-group"><label htmlFor="beam-load-field-1">{t("均布荷载 (kN/m)", "Uniformly distributed load (kN/m)")}</label><input id="beam-load-field-1" type="number" min="0" step="any" value={load} onChange={(e) => setLoad(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="beam-load-field-2">{t("跨度 (m)", "Span (m)")}</label><input id="beam-load-field-2" type="number" min="0" step="any" value={length} onChange={(e) => setLength(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="beam-load-field-3">{t("梁宽 b (mm)", "Beam width b (mm)")}</label><input id="beam-load-field-3" type="number" min="0" step="any" value={width} onChange={(e) => setWidth(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="beam-load-field-4">{t("梁高 h (mm)", "Beam depth h (mm)")}</label><input id="beam-load-field-4" type="number" min="0" step="any" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="beam-load-field-5">{t("弹性模量", "Elastic modulus")}</label>
              <select id="beam-load-field-5" value={eVal} onChange={(e) => setEVal(e.target.value)}>
                {E_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.label, o.enLabel)}</option>)}
              </select>
            </div>
          {error && <p role="alert" style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("截面惯性矩 I", "Second moment of area I")}</span><span className="result-value">{result.I.toExponential(3)} mm⁴</span></div>
          <div className="result-item"><span className="result-label">{t("最大弯矩 M", "Maximum bending moment M")}</span><span className="result-value">{result.M_max.toFixed(2)} kN·m</span></div>
          <div className="result-item"><span className="result-label">{t("最大弯曲应力 σ", "Maximum bending stress σ")}</span><span className="result-value">{result.sigma.toFixed(2)} MPa</span></div>
          <div className="result-item"><span className="result-label">{t("最大挠度 δ", "Maximum deflection δ")}</span><span className="result-value">{result.delta.toFixed(2)} mm</span></div>
          <div className="result-item"><span className="result-label">{t("允许挠度 L/300", "Deflection limit L/300")}</span><span className="result-value">{result.delta_allow.toFixed(2)} mm</span></div>
          <div className="result-item">
            <span className="result-label">{t("挠度验算", "Deflection check")}</span>
            <span className="result-value" style={{ color: result.passes ? 'green' : 'red' }}>
              {result.passes ? t('通过 ✓', "Pass ✓") : t('不通过 ✗', "Fail ✗")}
            </span>
          </div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("计算公式", "Formulas")}</h2>
        <div className="formula-box">
          <p>{t("截面惯性矩：I = b·h³ / 12 (mm⁴)", "Second moment of area I = b·h³ / 12 (mm⁴)")}</p>
          <p>{t("最大弯矩：M = w·L² / 8 (kN·m)", "Maximum bending moment M = w·L² / 8 (kN·m)")}</p>
          <p>{t("最大挠度：δ = 5·w·L⁴ / (384·E·I) (mm)", "Maximum deflection δ = 5·w·L⁴ / (384·E·I) (mm)")}</p>
          <p>{t("最大弯曲应力：σ = M·(h/2) / I (MPa)", "Maximum bending stress σ = M·(h/2) / I (MPa)")}</p>
          <p>{t("允许挠度：[δ] = L/300", "Deflection limit [δ] = L/300")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ul>
          <li>{t("本计算器适用于两端简支梁承受均布荷载的情况", "Use this calculator for a simply supported beam carrying a uniformly distributed load.")}</li>
          <li>{t("梁宽和梁高均为截面尺寸，单位为 mm", "Enter the beam section width and depth in millimeters.")}</li>
          <li>{t("钢梁弹性模量取 200 GPa，混凝土梁取 30 GPa（C30）", "The presets use 200 GPa for steel and 30 GPa for C30 concrete.")}</li>
          <li>{t("挠度限值 L/300 适用于一般楼盖梁，屋面梁可取 L/200", "L/300 is an example floor beam limit and L/200 is an example roof beam limit. Check the applicable project limits.")}</li>
          <li>{t("应力结果仅为弯曲正应力，剪切应力需另行验算", "The result covers normal bending stress. Check shear separately.")}</li>
        </ul>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("Q：挠度不通过怎么办？", "What if the beam fails the deflection check?")}</strong><br />{t("可增大梁高（对挠度影响最大，I ∝ h³）、增大弹性模量（换用钢梁）或减小跨度（加设中间支撑）。", "Increase section depth, use a material with a higher elastic modulus, or reduce the span with an intermediate support. Depth is especially effective because I ∝ h³.")}</p>
        <p><strong>{t("Q：均布荷载如何确定？", "How do I estimate the uniformly distributed load?")}</strong><br />{t("楼面活荷载一般取 2～4 kN/m²，乘以梁的受荷宽度即得线荷载（kN/m），再加上梁自重。", "Multiply the applicable floor load, for example 2–4 kN/m², by the tributary width to obtain a line load in kN/m. Add the beam’s self-weight.")}</p>
        <p><strong>{t("Q：弯曲应力超限怎么处理？", "What if the bending stress exceeds the allowable value?")}</strong><br />{t("增大截面高度或改用高强度材料（如 Q355 钢代替 Q235）。", "Increase the section depth or choose a higher-strength material, such as Q355 steel in place of Q235.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("计算案例", "Worked Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("简支钢梁，跨度 6 m，均布荷载 15 kN/m，截面 200×400 mm，E=200 GPa。", "A simply supported steel beam has a 6 m span, 15 kN/m distributed load, a 200 × 400 mm section, and E = 200 GPa.")}</p>
        <p>I = 200×400³/12 = 1.067×10⁹ mm⁴</p>
        <p>M = 15×6²/8 = 67.5 kN·m</p>
        <p>δ = 5×15×6000⁴/(384×200000×1.067×10⁹) ≈ 7.6 mm</p>
        <p>{t("允许挠度 = 6000/300 = 20 mm，挠度验算通过。", "The deflection limit is 6000 / 300 = 20 mm. This beam passes the check.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算器仅供工程参考，实际设计须由专业结构工程师复核。", "Use the calculator for engineering reference. Have a qualified structural engineer review the final design.")}</div>
    </CalculatorWorkbench>
  )
}
