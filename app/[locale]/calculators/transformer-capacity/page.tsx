'use client'

import {calculatorError} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'
import {sizeTransformer} from '@/lib/transformer-sizing'

export default function TransformerCapacity() {
  const t = useTranslation()
  const [pTotal, setPTotal] = useState('500')
  const [demand, setDemand] = useState('0.7')
  const [simultaneous, setSimultaneous] = useState('0.9')
  const [pf, setPf] = useState('0.85')
  const [margin, setMargin] = useState('1.2')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    try {
      const r = sizeTransformer(
        parseFloat(pTotal), parseFloat(demand), parseFloat(simultaneous),
        parseFloat(pf), parseFloat(margin),
      )
      setResult({
        P_calc: r.loadKw.toFixed(1),
        S_calc: r.apparentKva.toFixed(1),
        S_required: r.requiredKva.toFixed(1),
        recommended: r.suggestedSingleKva,
      })
      setError('')
    } catch (e) {
      setResult(null)
      setError(calculatorError(t, e, '输入参数无效', "Invalid inputs."))
    }
  }

  return (
    <CalculatorWorkbench
      slug="transformer-capacity"
      inputs={
        <>
          <div className="form-group"><label htmlFor="transformer-capacity-field-1">{t("总设备功率 (kW)", "Total connected load (kW)")}</label><input id="transformer-capacity-field-1" type="number" value={pTotal} onChange={(e)=>setPTotal(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="transformer-capacity-field-2">{t("需用系数 (0~1)", "Demand factor (0–1)")}</label><input id="transformer-capacity-field-2" type="number" step="0.01" value={demand} onChange={(e)=>setDemand(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="transformer-capacity-field-3">{t("同时系数 (0~1)", "Coincidence factor (0–1)")}</label><input id="transformer-capacity-field-3" type="number" step="0.01" value={simultaneous} onChange={(e)=>setSimultaneous(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="transformer-capacity-field-4">{t("功率因数 (0~1)", "Power factor (0–1)")}</label><input id="transformer-capacity-field-4" type="number" step="0.01" value={pf} onChange={(e)=>setPf(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="transformer-capacity-field-5">{t("余量系数", "Sizing margin multiplier")}</label><input id="transformer-capacity-field-5" type="number" step="0.01" value={margin} onChange={(e)=>setMargin(e.target.value)}/></div>
          {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("计算负荷", "Calculated real load")}</span><span className="result-value">{result.P_calc} kW</span></div>
          <div className="result-item"><span className="result-label">{t("视在功率", "Apparent power")}</span><span className="result-value">{result.S_calc} kVA</span></div>
          <div className="result-item"><span className="result-label">{t("所需容量（含余量）", "Required rating with margin")}</span><span className="result-value">{result.S_required} kVA</span></div>
          {result.recommended === null
            ? <div className="result-item" role="alert"><span className="result-label">{t("容量超出单台候选范围", "Required rating exceeds the preset single-unit range")}</span><span className="result-value">{t("需分台方案或专项设计（不得直接选 2000 kVA）", "Consider multiple units or a project-specific design. Do not default to 2000 kVA.")}</span></div>
            : <div className="result-item"><span className="result-label">{t("候选单台变压器容量", "Candidate single-unit rating")}</span><span className="result-value">{result.recommended} kVA</span></div>}
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("变压器容量选择需综合考虑设备需用系数、同时使用系数、功率因数及适当余量，以确保供电可靠性。", "Transformer sizing accounts for demand, coincident operation, power factor, and a margin for reliable supply.")}</p>
        <div className="formula-box">
          {t("P_calc = P_total × 需用系数 × 同时系数（kW）", "P_calc = P_total × demand factor × coincidence factor (kW)")}<br/>
          {t("S_calc = P_calc / 功率因数（kVA）", "S_calc = P_calc / power factor (kVA)")}<br/>
          {t("S_required = S_calc × 余量系数（kVA）", "S_required = S_calc × margin multiplier (kVA)")}<br/>
          {t("仅从当前预设候选容量中挑选不小于 S_required 的容量；超限不作推荐", "The calculator selects the smallest preset rating at or above S_required. Above the preset range it displays a separate result.")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入项目中所有设备的总安装功率（kW）", "Enter the total installed equipment power in kW.")}</li>
          <li>{t("根据行业经验填写需用系数（一般工厂取 0.6~0.8）", "Enter a demand factor for the load profile. Typical preliminary values for factories are 0.6–0.8.")}</li>
          <li>{t("填写同时系数（多回路同时运行比例，一般取 0.85~0.95）", "Enter a coincidence factor for simultaneously operating circuits. Example values are 0.85–0.95.")}</li>
          <li>{t("填写综合功率因数（一般取 0.8~0.9）及余量系数（建议 1.2）", "Enter the overall power factor, often 0.8–0.9, and a margin multiplier, for example 1.2.")}</li>
          <li>{t("点击\"计算\"，系统自动匹配国标标准容量", "Select Calculate to compare the result with the preset ratings used in China.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("需用系数如何取值？", "How do I choose a demand factor?")}</strong></p>
        <p>{t("需用系数反映设备实际运行功率与额定功率的比值。一般工厂：0.6~0.75；办公楼：0.7~0.8；商业建筑：0.75~0.85。", "Demand factor is the ratio of maximum demand to connected load. Illustrative values are 0.6–0.75 for factories, 0.7–0.8 for offices, and 0.75–0.85 for commercial buildings.")}</p>
        <p><strong>{t("国标变压器标准容量系列有哪些？", "Which transformer ratings are in the preset list?")}</strong></p>
        <p>50、100、160、200、250、315、400、500、630、800、1000、1250、1600、2000 kVA。</p>
        <p><strong>{t("为什么需要余量系数？", "Why allow a sizing margin?")}</strong></p>
        <p>{t("余量系数用于应对未来负荷增长及计算误差，通常取 1.2，即预留 20% 余量。", "The multiplier allows for future load growth and uncertainty. A factor of 1.2 adds a 20% margin.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("某工厂总设备功率 500kW，需用系数 0.7，同时系数 0.9，功率因数 0.85，余量系数 1.2。", "A factory has 500 kW of connected load, a demand factor of 0.7, a coincidence factor of 0.9, a power factor of 0.85, and a margin multiplier of 1.2.")}</p>
        <p>{t("计算负荷：P_calc = 500×0.7×0.9 = 315 kW", "Calculated real load P_calc = 500 × 0.7 × 0.9 = 315 kW.")}</p>
        <p>{t("视在功率：S_calc = 315/0.85 = 370.6 kVA", "Apparent power S_calc = 315 / 0.85 ≈ 370.6 kVA.")}</p>
        <p>{t("所需容量：S_required = 370.6×1.2 = 444.7 kVA", "Required rating S_required = 370.6 × 1.2 ≈ 444.7 kVA.")}</p>
        <p>{t("按国标系列选取：推荐 500 kVA 变压器", "The next rating in the preset list is 500 kVA.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("容量仅为初步估算。须复核温升、谐波、负荷性质、短路水平、冗余及变电站方案，按当地规范由专业工程师审核。", "This is a preliminary estimate. Have a qualified engineer check temperature rise, harmonics, load characteristics, fault levels, redundancy, and the substation design against local requirements.")}</div>
    </CalculatorWorkbench>
  )
}
