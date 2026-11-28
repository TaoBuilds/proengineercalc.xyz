'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

// GB standard mix design reference values (kg/m³)
const MIX: Record<string, { cement: number; sand: number; aggregate: number; water: number }> = {
  C20: { cement: 280, sand: 780, aggregate: 1100, water: 175 },
  C25: { cement: 320, sand: 750, aggregate: 1080, water: 175 },
  C30: { cement: 360, sand: 720, aggregate: 1060, water: 175 },
  C35: { cement: 400, sand: 690, aggregate: 1040, water: 170 },
  C40: { cement: 440, sand: 660, aggregate: 1020, water: 165 },
}

export default function ConcreteMix() {
  const t = useTranslation()
  const [volume, setVolume] = useState('1')
  const [grade,  setGrade]  = useState('C30')
  const [result, setResult] = useState<{ cement: string; sand: string; aggregate: string; water: string; wc: string } | null>(null)
  const [error,  setError]  = useState('')

  const calculate = () => {
    setError('')
    const v = parseFloat(volume)
    if (isNaN(v) || v <= 0) { setError(t('请输入有效的正数', "Enter a valid positive number.")); return }
    const m = MIX[grade]
    setResult({
      cement:    (v * m.cement).toFixed(1),
      sand:      (v * m.sand).toFixed(1),
      aggregate: (v * m.aggregate).toFixed(1),
      water:     (v * m.water).toFixed(1),
      wc:        (m.water / m.cement).toFixed(3),
    })
  }

  return (
    <CalculatorWorkbench
      slug="concrete-mix"
      inputs={
        <>
          <div className="form-group"><label htmlFor="concrete-mix-field-1">{t("混凝土方量 (m³)", "Concrete volume (m³)")}</label><input id="concrete-mix-field-1" type="number" min="0" step="any" value={volume} onChange={(e) => setVolume(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="concrete-mix-field-2">{t("混凝土等级", "Concrete grade")}</label>
              <select id="concrete-mix-field-2" value={grade} onChange={(e) => setGrade(e.target.value)}>
                {Object.keys(MIX).map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          {error && <p role="alert" style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>}
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("水泥 (kg)", "Cement (kg)")}</span><span className="result-value">{result.cement}</span></div>
          <div className="result-item"><span className="result-label">{t("砂 (kg)", "Sand (kg)")}</span><span className="result-value">{result.sand}</span></div>
          <div className="result-item"><span className="result-label">{t("骨料 (kg)", "Aggregate (kg)")}</span><span className="result-value">{result.aggregate}</span></div>
          <div className="result-item"><span className="result-label">{t("水 (kg)", "Water (kg)")}</span><span className="result-value">{result.water}</span></div>
          <div className="result-item"><span className="result-label">{t("水灰比 (W/C)", "Water-cement ratio (W/C)")}</span><span className="result-value">{result.wc}</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("配合比参考依据", "Mix Design Basis")}</h2>
        <div className="formula-box">
          <p>{t("依据 GB 50010 及 JGJ 55 普通混凝土配合比设计规程", "Reference standards include GB 50010 and JGJ 55 for conventional concrete mix design in China.")}</p>
          <p>{t("各材料用量 = 单位体积参考值 (kg/m³) × 方量 (m³)", "Material quantity = reference quantity per unit volume (kg/m³) × volume (m³)")}</p>
          <p>{t("水灰比 W/C = 用水量 / 水泥用量", "Water-cement ratio W/C = water mass ÷ cement mass")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ul>
          <li>{t("表中数值为普通硅酸盐水泥、中砂、碎石的参考配合比", "The table lists reference proportions for ordinary Portland cement, medium sand, and crushed stone.")}</li>
          <li>{t("实际施工前须通过试配确定最终配合比", "Confirm final proportions with a trial mix before construction.")}</li>
          <li>{t("外加剂、掺合料会改变用水量和水泥用量，需重新设计", "Redesign the mix when admixtures or supplementary cementitious materials change water or cement demand.")}</li>
          <li>{t("水灰比越低，混凝土强度越高，耐久性越好", "A lower water-cement ratio generally increases strength and durability for a properly designed and cured mix.")}</li>
        </ul>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("Q：C30 和 C35 的区别是什么？", "What is the difference between C30 and C35?")}</strong><br />{t("C30 表示标准立方体试块 28 天抗压强度标准值为 30 MPa，C35 为 35 MPa。强度越高，水泥用量越多，水灰比越低。", "C30 denotes a characteristic 28-day cube compressive strength of 30 MPa, and C35 denotes 35 MPa. Higher strength generally requires a lower water-cement ratio.")}</p>
        <p><strong>{t("Q：为什么不能直接用体积比换算？", "Why use mass instead of a volume ratio?")}</strong><br />{t("体积比（如 1:2:4）未考虑各材料密度差异，换算出的质量比误差较大，工程上应以质量配合比为准。", "Volume ratios such as 1:2:4 depend on the bulk density of each material. Specify mix proportions by mass for engineering use.")}</p>
        <p><strong>{t("Q：砂率如何影响配合比？", "How does the sand fraction affect the mix?")}</strong><br />{t("砂率过高会增加用水量，过低会影响和易性。本表砂率约 38%～42%，适用于一般工程。", "Too much sand can increase water demand, while too little can impair workability. The reference sand fraction is about 38–42%.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("计算案例", "Worked Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("浇筑 C30 混凝土 5 m³。", "Place 5 m³ of C30 concrete.")}</p>
        <p>{t("水泥：360 × 5 = 1800 kg", "Cement = 360 × 5 = 1800 kg")}</p>
        <p>{t("砂：720 × 5 = 3600 kg", "Sand = 720 × 5 = 3600 kg")}</p>
        <p>{t("骨料：1060 × 5 = 5300 kg", "Aggregate = 1060 × 5 = 5300 kg")}</p>
        <p>{t("水：175 × 5 = 875 kg，水灰比 = 175/360 ≈ 0.486", "Water = 175 × 5 = 875 kg, giving W/C = 175 / 360 ≈ 0.486.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算器仅供工程参考，实际配合比须经试验室试配确认，由专业工程师负责。", "Use these values for reference. Have a laboratory confirm the final proportions by trial mixing under a qualified engineer’s supervision.")}</div>
    </CalculatorWorkbench>
  )
}
