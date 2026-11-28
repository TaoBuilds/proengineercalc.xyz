'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

function calcCoolingLoad(area: number, height: number, people: number, equipment: number, orientation: number) {
  const Q_envelope = area * height * 30 * orientation
  const Q_people = people * 120
  const Q_equipment = equipment * 1.25
  const Q_total = Q_envelope + Q_people + Q_equipment
  return { Q_envelope, Q_people, Q_equipment, Q_total }
}

export default function CoolingLoad() {
  const t = useTranslation()
  const [area, setArea] = useState('100')
  const [height, setHeight] = useState('3')
  const [people, setPeople] = useState('10')
  const [equipment, setEquipment] = useState('2000')
  const [orientation, setOrientation] = useState('1.2')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const a = parseFloat(area)
    const h = parseFloat(height)
    const p = parseFloat(people)
    const e = parseFloat(equipment)
    const o = parseFloat(orientation)
    if ([a, h, p, e, o].some(isNaN) || a <= 0 || h <= 0) return
    const r = calcCoolingLoad(a, h, p, e, o)
    setResult({
      Q_envelope: r.Q_envelope.toFixed(0),
      Q_people: r.Q_people.toFixed(0),
      Q_equipment: r.Q_equipment.toFixed(0),
      Q_total_W: r.Q_total.toFixed(0),
      Q_total_kW: (r.Q_total / 1000).toFixed(2),
      Q_total_RT: (r.Q_total / 3517).toFixed(2),
    })
  }

  return (
    <CalculatorWorkbench
      slug="cooling-load"
      inputs={
        <>
          <div className="form-group"><label htmlFor="cooling-load-field-1">{t("房间面积 (m²)", "Room area (m²)")}</label><input id="cooling-load-field-1" type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="cooling-load-field-2">{t("层高 (m)", "Ceiling height (m)")}</label><input id="cooling-load-field-2" type="number" min="0.1" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="cooling-load-field-3">{t("人员数量 (人)", "Number of occupants")}</label><input id="cooling-load-field-3" type="number" min="0" value={people} onChange={(e) => setPeople(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="cooling-load-field-4">{t("设备功率 (W)", "Equipment power (W)")}</label><input id="cooling-load-field-4" type="number" min="0" value={equipment} onChange={(e) => setEquipment(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="cooling-load-field-5">{t("朝向系数", "Orientation factor")}</label>
              <select id="cooling-load-field-5" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
                <option value="1.0">{t("北向 (1.0)", "North (1.0)")}</option>
                <option value="1.1">{t("东向 / 西向 (1.1)", "East or west (1.1)")}</option>
                <option value="1.2">{t("南向 (1.2)", "South (1.2)")}</option>
              </select>
            </div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("围护结构冷负荷 Q_envelope", "Envelope cooling load Q_envelope")}</span><span className="result-value">{result.Q_envelope} W</span></div>
          <div className="result-item"><span className="result-label">{t("人员冷负荷 Q_people", "Occupant cooling load Q_people")}</span><span className="result-value">{result.Q_people} W</span></div>
          <div className="result-item"><span className="result-label">{t("设备冷负荷 Q_equipment", "Equipment cooling load Q_equipment")}</span><span className="result-value">{result.Q_equipment} W</span></div>
          <div className="result-item"><span className="result-label">{t("总冷负荷", "Total cooling load")}</span><span className="result-value">{result.Q_total_W} W</span></div>
          <div className="result-item"><span className="result-label">{t("总冷负荷", "Total cooling load")}</span><span className="result-value">{result.Q_total_kW} kW</span></div>
          <div className="result-item"><span className="result-label">{t("总冷负荷", "Total cooling load")}</span><span className="result-value">{result.Q_total_RT} RT</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("建筑冷负荷由三部分叠加：围护结构传热、人员散热和设备散热。", "The estimate adds heat gains from the building envelope, occupants, and equipment.")}</p>
        <div className="formula-box">
          Q_total = Q_envelope + Q_people + Q_equipment<br/><br/>
          {t("Q_envelope = 面积 × 层高 × 30 × 朝向系数 (W)", "Q_envelope = area × ceiling height × 30 × orientation factor (W)")}<br/>
          {t("Q_people = 人数 × 120 (W/人，含显热+潜热)", "Q_people = number of people × 120 (W per person, sensible and latent)")}<br/>
          {t("Q_equipment = 设备功率 × 1.25 (W，含同时使用系数)", "Q_equipment = equipment power × 1.25 (W, including an allowance)")}<br/><br/>
          {t("换算：1 RT (冷吨) = 3517 W = 3.517 kW", "1 ton of refrigeration (RT) = 3517 W = 3.517 kW")}
        </div>
        <p>{t("朝向系数反映太阳辐射对不同朝向外墙的影响：南向受辐射最强取 1.2，北向最弱取 1.0，东西向居中取 1.1。设备功率乘以 1.25 是考虑到设备散热效率及同时使用率的修正系数。", "The orientation factor approximates solar exposure for the reference conditions. This model uses 1.2 for south, 1.0 for north, and 1.1 for east or west. The 1.25 equipment factor is a simplified allowance for combined heat gains.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入房间面积和层高，确定空间体积。", "Enter room area and ceiling height.")}</li>
          <li>{t("填写房间内的设计人员数量（按满员考虑）。", "Enter the design occupancy at full capacity.")}</li>
          <li>{t("填写房间内所有设备的总安装功率（电脑、服务器、照明等）。", "Enter total installed equipment power, including computers, servers, and lighting.")}</li>
          <li>{t("根据房间主要外墙朝向选择朝向系数。", "Choose the orientation of the main exterior wall.")}</li>
          <li>{t("点击\"计算\"，查看各分项及总冷负荷。", "Select Calculate to see the component loads and total.")}</li>
          <li>{t("根据总冷负荷（RT）选择合适的空调机组容量，建议留 10%–15% 余量。", "Use the estimated load to screen equipment sizes. The reference example allows a 10–15% margin.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item">
          <p className="faq-question">{t("什么是冷负荷？", "What is a cooling load?")}</p>
          <p className="faq-answer">{t("冷负荷是指为维持室内设计温度，空调系统在单位时间内需要从房间带走的热量，单位为 W 或 kW。它决定了空调设备的选型容量。", "Cooling load is the rate at which heat must be removed to maintain indoor design conditions. It is measured in W or kW and informs equipment sizing.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("朝向如何影响冷负荷？", "How does orientation affect cooling load?")}</p>
          <p className="faq-answer">{t("南向外墙全天受太阳直射时间最长，太阳辐射得热最大，因此冷负荷最高。北向基本无直射阳光，冷负荷最低。东西向介于两者之间，早晨或下午会受到较强的斜射阳光。", "Solar heat gain depends on orientation, time of day, and location. For the northern-hemisphere assumptions used here, south-facing walls can gain more solar heat, and east and west walls can see stronger morning or afternoon sun.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("人员散热为什么取 120 W/人？", "Why use 120 W per occupant?")}</p>
          <p className="faq-answer">{t("办公室轻度活动状态下，每人散热约为显热 65 W + 潜热 55 W = 120 W。重体力劳动场所该值会更高，可达 300 W/人以上。", "A lightly active office occupant may release about 65 W of sensible heat and 55 W of latent heat. Heavy activity can exceed 300 W per person.")}</p>
        </div>
        <div className="faq-item">
          <p className="faq-question">{t("这个计算结果能直接用于设备选型吗？", "Can I use this estimate to size equipment?")}</p>
          <p className="faq-answer">{t("本工具为快速估算，适合方案阶段。正式设计应按 GB 50736 采用逐时冷负荷计算法，并考虑新风负荷、围护结构热工参数、遮阳措施等更多因素。", "Use this estimate for early planning. Final sizing requires an hourly load calculation under applicable standards, such as GB 50736 in China, including ventilation, envelope properties, and shading.")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("案例分析", "Worked Example")}</h2>
        <p><strong>{t("案例：某 100 m² 南向办公室", "A 100 m² south-facing office")}</strong></p>
        <p>{t("条件：面积 100 m²，层高 3 m，10 人，设备功率 2000 W，南向（朝向系数 1.2）。", "The office has a 3 m ceiling, 10 occupants, 2000 W of equipment load, and an orientation factor of 1.2.")}</p>
        <div className="formula-box">
          Q_envelope = 100 × 3 × 30 × 1.2 = 10,800 W<br/>
          Q_people = 10 × 120 = 1,200 W<br/>
          Q_equipment = 2000 × 1.25 = 2,500 W<br/>
          Q_total = 10,800 + 1,200 + 2,500 = 14,500 W<br/>
          = 14.5 kW = 4.12 RT
        </div>
        <p>{t("结论：该办公室需要约 4.1 RT（约 14.5 kW）的制冷量，可选用一台 5 HP（约 14 kW）或 6 HP（约 17 kW）的商用空调机组，留有适当余量。", "The estimated cooling load is 14.5 kW, or about 4.1 RT. Screen equipment against its rated cooling capacity and the desired margin.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("本计算结果仅供参考，不得直接用于正式工程设计。实际工程请委托具备资质的专业人员按相关规范进行计算。", "Use the estimate for reference. Have a qualified engineer perform the final load calculation to applicable standards.")}</div>
    </CalculatorWorkbench>
  )
}
