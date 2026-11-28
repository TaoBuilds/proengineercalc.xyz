'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

const FLUIDS = [
  { id: 'water-20', label: '水 20°C', enLabel: "Water at 20°C", nu: '1e-6' },
  { id: 'water-60', label: '水 60°C', enLabel: "Water at 60°C", nu: '0.474e-6' },
  { id: 'air-20', label: '空气 20°C', enLabel: "Air at 20°C", nu: '15.1e-6' },
  { id: 'oil', label: '油 (润滑油)', enLabel: "Lubricating oil", nu: '50e-6' },
  { id: 'custom', label: '自定义', enLabel: "Custom", nu: '' },
]

export default function Reynolds() {
  const t = useTranslation()
  const [fluid, setFluid] = useState('water-20')
  const [velocity, setVelocity] = useState('2')
  const [diameter, setDiameter] = useState('100')
  const [nu, setNu] = useState('1e-6')
  const [result, setResult] = useState<any>(null)

  const handleFluidChange = (id: string) => {
    setFluid(id)
    const found = FLUIDS.find(f => f.id === id)
    if (found && found.nu) setNu(found.nu)
  }

  const calculate = () => {
    const v = parseFloat(velocity)
    const d = parseFloat(diameter) / 1000
    const viscosity = parseFloat(nu)
    if ([v, d, viscosity].some(isNaN) || v <= 0 || d <= 0 || viscosity <= 0) return
    const Re = (v * d) / viscosity
    let regime = ''
    let regimeDesc = ''
    if (Re < 2300) {
      regime = t('层流', "Laminar")
      regimeDesc = t('流体呈有序的平行层状流动，无横向混合，压降与流速成正比。', "The fluid moves in parallel layers with little cross-stream mixing. Friction loss is proportional to velocity for fully developed laminar pipe flow.")
    } else if (Re > 4000) {
      regime = t('湍流', "Turbulent")
      regimeDesc = t('流体呈无规则的混乱运动，横向混合强烈，传热传质效率高，压降与流速的平方近似成正比。', "Irregular motion and strong cross-stream mixing increase heat and mass transfer. Friction loss often rises roughly with the square of velocity.")
    } else {
      regime = t('过渡流', "Transitional")
      regimeDesc = t('介于层流与湍流之间的不稳定状态，流态随扰动变化，工程设计中应尽量避免在此区间运行。', "Flow can switch between laminar and turbulent behavior as disturbances change. Avoid relying on a single flow regime in this range.")
    }
    setResult({ Re: Re.toFixed(0), regime, regimeDesc })
  }

  return (
    <CalculatorWorkbench
      slug="reynolds"
      inputs={
        <>
          <div className="form-group">
              <label htmlFor="reynolds-field-1">{t("流体选择", "Fluid")}</label>
              <select id="reynolds-field-1" value={fluid} onChange={(e) => handleFluidChange(e.target.value)}>
                {FLUIDS.map(f => <option key={f.id} value={f.id}>{t(f.label, f.enLabel)}</option>)}
              </select>
            </div>
          <div className="form-group"><label htmlFor="reynolds-field-2">{t("流速 (m/s)", "Flow velocity (m/s)")}</label><input id="reynolds-field-2" type="number" min="0.001" step="0.1" value={velocity} onChange={(e) => setVelocity(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="reynolds-field-3">{t("特征尺寸 / 管道直径 (mm)", "Characteristic length or pipe inside diameter (mm)")}</label><input id="reynolds-field-3" type="number" min="0.1" value={diameter} onChange={(e) => setDiameter(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="reynolds-field-4">{t("运动粘度 ν (m²/s)", "Kinematic viscosity ν (m²/s)")}</label>
              <input id="reynolds-field-4" type="number" step="any" value={nu} onChange={(e) => { setNu(e.target.value); setFluid('custom') }} />
            </div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("雷诺数 Re", "Reynolds number Re")}</span><span className="result-value">{result.Re}</span></div>
          <div className="result-item"><span className="result-label">{t("流态", "Flow regime")}</span><span className="result-value">{result.regime}</span></div>
          <div className="result-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
            <span className="result-label">{t("流态说明", "What this regime means")}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{result.regimeDesc}</span>
          </div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("雷诺数（Reynolds Number）是流体力学中最重要的无量纲数之一，用于判断流体的流动状态。", "The Reynolds number is dimensionless and helps identify the flow regime.")}</p>
        <div className="formula-box">
          Re = ρVD / μ = VD / ν<br/><br/>
          {t("ρ — 流体密度 (kg/m³)", "ρ — fluid density (kg/m³)")}<br/>
          {t("V — 流速 (m/s)", "V — flow velocity (m/s)")}<br/>
          {t("D — 特征尺寸，管道取内径 (m)", "D — characteristic length, the inside diameter for a round pipe (m)")}<br/>
          {t("μ — 动力粘度 (Pa·s)", "μ — dynamic viscosity (Pa·s)")}<br/>
          {t("ν — 运动粘度 = μ/ρ (m²/s)", "ν — kinematic viscosity = μ/ρ (m²/s)")}<br/><br/>
          {t("流态判断（圆管内流）：", "Flow regimes in a round pipe")}<br/>
          {t("Re < 2300　→　层流", "Re < 2300 → laminar")}<br/>
          {t("2300 ≤ Re ≤ 4000　→　过渡流", "2300 ≤ Re ≤ 4000 → transitional")}<br/>
          {t("Re > 4000　→　湍流", "Re > 4000 → turbulent")}
        </div>
        <p>{t("雷诺数的物理意义是惯性力与粘性力之比。Re 小时粘性力占主导，流体保持有序的层流；Re 大时惯性力占主导，流体发展为混乱的湍流。", "Reynolds number compares inertial and viscous effects. Viscosity dominates at low Re, while inertia dominates at high Re.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("从下拉菜单选择流体类型，运动粘度将自动填入。", "Select a fluid to fill in kinematic viscosity automatically.")}</li>
          <li>{t("如需计算其他流体，选择\"自定义\"并手动输入运动粘度。", "Choose Custom and enter kinematic viscosity for other fluids.")}</li>
          <li>{t("输入流速（m/s）和管道内径（mm）。", "Enter flow velocity in m/s and pipe inside diameter in mm.")}</li>
          <li>{t("点击\"计算\"，查看雷诺数和流态判断结果。", "Select Calculate to see Reynolds number and the estimated flow regime.")}</li>
          <li>{t("对于非圆形截面（如矩形风管），特征尺寸取水力直径 D_h = 4A/P，其中 A 为截面积，P 为湿周。", "For noncircular sections such as rectangular ducts, use hydraulic diameter D_h = 4A/P, where A is flow area and P is wetted perimeter.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item">
          <p className="faq-question">{t("为什么雷诺数重要？", "Why is Reynolds number important?")}</p>
          <p className="faq-answer">{t("雷诺数决定了流体的流动状态，而流动状态直接影响传热系数、压力损失和流量计的测量精度。暖通、给排水、化工等工程设计都需要先判断流态，再选用对应的计算公式。", "Flow regime affects heat transfer, pressure drop, and flow meter accuracy. Use it to select the appropriate equations for an HVAC, plumbing, or process system.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("层流和湍流有什么区别？", "How do laminar and turbulent flow differ?")}</p>
          <p className="faq-answer">{t("层流中流体质点沿平行流线运动，无横向混合，传热主要靠导热，摩擦系数 f = 64/Re。湍流中流体质点做无规则运动，横向混合剧烈，传热效率远高于层流，但压力损失也更大，摩擦系数与管壁粗糙度有关。", "Laminar flow has orderly layers with limited mixing, so heat transfer across layers is mainly conductive. In fully developed laminar pipe flow, f = 64/Re. Turbulence increases mixing and often friction loss, which also depends on pipe roughness.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("过渡流区间如何处理？", "How should I handle transitional flow?")}</p>
          <p className="faq-answer">{t("过渡流（Re 2300–4000）是不稳定区间，流态会在层流和湍流之间随机切换。工程设计中应尽量避免在此区间运行，通常按湍流保守计算压力损失。", "In the range of about Re = 2300–4000, disturbances may shift the flow between regimes. A turbulent-flow estimate is commonly used for conservative pressure-loss screening.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("温度如何影响雷诺数？", "How does temperature affect Reynolds number?")}</p>
          <p className="faq-answer">{t("温度升高时，液体（如水）的粘度降低，运动粘度减小，雷诺数增大，更容易进入湍流。气体（如空气）则相反，温度升高粘度增大，但密度减小，综合效果是运动粘度增大，雷诺数减小。", "For common liquids such as water, higher temperature reduces kinematic viscosity and increases Re at fixed velocity and diameter. For air at fixed pressure, higher temperature generally increases kinematic viscosity and lowers Re.")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("案例分析", "Worked Examples")}</h2>
        <p><strong>{t("案例一：空调冷冻水管道", "1. Chilled-water pipe")}</strong></p>
        <p>{t("条件：水温 20°C（ν = 1×10⁻⁶ m²/s），流速 1.5 m/s，管道内径 80 mm。", "Water at 20°C has ν = 1 × 10⁻⁶ m²/s. Velocity is 1.5 m/s and inside diameter is 80 mm.")}</p>
        <div className="formula-box">
          Re = 1.5 × 0.08 / 1×10⁻⁶ = 120,000<br/>
          {t("Re > 4000 → 湍流", "Re > 4000 → turbulent")}<br/>
          {t("可使用 Blasius 公式：f = 0.316 / 120000^0.25 = 0.0168", "For a smooth pipe, the Blasius approximation gives f = 0.316 / 120000^0.25 ≈ 0.017.")}
        </div>
        <p>{t("结论：该管道内为充分发展的湍流，传热效果好，适合空调水系统。", "The Reynolds number indicates turbulent flow in the chilled-water pipe.")}</p>

        <p style={{ marginTop: '1.5rem' }}><strong>{t("案例二：空调送风风管", "2. HVAC supply duct")}</strong></p>
        <p>{t("条件：空气 20°C（ν = 15.1×10⁻⁶ m²/s），风速 6 m/s，风管水力直径 400 mm。", "Air at 20°C has ν = 15.1 × 10⁻⁶ m²/s. Velocity is 6 m/s and hydraulic diameter is 400 mm.")}</p>
        <div className="formula-box">
          Re = 6 × 0.4 / 15.1×10⁻⁶ = 158,940<br/>
          {t("Re > 4000 → 湍流", "Re > 4000 → turbulent")}<br/>
          {t("风管内空气流动为湍流，符合暖通设计预期。", "The Reynolds number indicates turbulent flow in the supply duct.")}
        </div>
        <p>{t("结论：空气在风管内的雷诺数远大于临界值，为湍流状态，可按湍流公式计算风管阻力。", "Use an appropriate turbulent-flow method to estimate duct friction.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算结果仅供参考，不得直接用于正式工程设计。实际工程请委托具备资质的专业人员按相关规范进行计算。", "Use the estimate for reference. Have a qualified engineer verify the final design to applicable standards.")}</div>
    </CalculatorWorkbench>
  )
}
