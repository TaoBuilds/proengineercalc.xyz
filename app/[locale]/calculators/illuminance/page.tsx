'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

function calcIlluminance(L: number, W: number, workH: number, mountH: number, E: number, flux: number, mf: number) {
  const Hm = mountH - workH
  const RI = (L * W) / (Hm * (L + W))
  const CU = Math.min(0.4 + 0.1 * RI, 0.7)
  const Nraw = (E * L * W) / (flux * CU * mf)
  const N = Math.ceil(Nraw)
  const Eactual = (N * flux * CU * mf) / (L * W)
  const wPerFixture = flux / 100
  const totalW = N * wPerFixture
  const wPerM2 = totalW / (L * W)
  return { RI, CU, Nraw, N, Eactual, wPerM2, area: L * W }
}

const luxOptions = [
  { label: '办公室 500 lux', enLabel: "Office, 500 lux", value: 500 },
  { label: '走廊 100 lux', enLabel: "Corridor, 100 lux", value: 100 },
  { label: '车间 300 lux', enLabel: "Workshop, 300 lux", value: 300 },
  { label: '精密作业 750 lux', enLabel: "Precision work, 750 lux", value: 750 },
  { label: '仓库 200 lux', enLabel: "Warehouse, 200 lux", value: 200 },
]

export default function Illuminance() {
  const t = useTranslation()
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('8')
  const [workHeight, setWorkHeight] = useState('0.8')
  const [mountHeight, setMountHeight] = useState('2.8')
  const [targetLux, setTargetLux] = useState('500')
  const [flux, setFlux] = useState('4000')
  const [mf, setMf] = useState('0.8')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const L = parseFloat(length)
    const W = parseFloat(width)
    const wH = parseFloat(workHeight)
    const mH = parseFloat(mountHeight)
    const E = parseFloat(targetLux)
    const f = parseFloat(flux)
    const m = parseFloat(mf)
    if ([L, W, wH, mH, E, f, m].some(isNaN) || mH <= wH) return
    setResult(calcIlluminance(L, W, wH, mH, E, f, m))
  }

  return (
    <CalculatorWorkbench
      slug="illuminance"
      inputs={
        <>
          <div className="form-group"><label htmlFor="illuminance-field-1">{t("房间长度 (m)", "Room length (m)")}</label><input id="illuminance-field-1" type="number" value={length} onChange={(e)=>setLength(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="illuminance-field-2">{t("房间宽度 (m)", "Room width (m)")}</label><input id="illuminance-field-2" type="number" value={width} onChange={(e)=>setWidth(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="illuminance-field-3">{t("工作面高度 (m)", "Workplane height (m)")}</label><input id="illuminance-field-3" type="number" value={workHeight} step="0.1" onChange={(e)=>setWorkHeight(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="illuminance-field-4">{t("灯具安装高度 (m)", "Luminaire mounting height (m)")}</label><input id="illuminance-field-4" type="number" value={mountHeight} step="0.1" onChange={(e)=>setMountHeight(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="illuminance-field-5">{t("目标照度", "Target illuminance")}</label>
              <select id="illuminance-field-5" value={targetLux} onChange={(e)=>setTargetLux(e.target.value)}>
                {luxOptions.map(o => <option key={o.value} value={o.value}>{t(o.label, o.enLabel)}</option>)}
              </select>
            </div>
          <div className="form-group"><label htmlFor="illuminance-field-6">{t("灯具光通量 (lm)", "Luminaire luminous flux (lm)")}</label><input id="illuminance-field-6" type="number" value={flux} onChange={(e)=>setFlux(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="illuminance-field-7">{t("维护系数 MF", "Maintenance factor MF")}</label><input id="illuminance-field-7" type="number" value={mf} step="0.05" min="0.5" max="1" onChange={(e)=>setMf(e.target.value)} /></div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("房间面积", "Room area")}</span><span className="result-value">{result.area.toFixed(1)} m²</span></div>
          <div className="result-item"><span className="result-label">{t("室形指数 RI", "Room index RI")}</span><span className="result-value">{result.RI.toFixed(2)}</span></div>
          <div className="result-item"><span className="result-label">{t("利用系数 CU", "Coefficient of utilization CU")}</span><span className="result-value">{result.CU.toFixed(2)}</span></div>
          <div className="result-item"><span className="result-label">{t("所需灯具数", "Required luminaires")}</span><span className="result-value">{result.N}{' '}{t("盏（计算值", "luminaires (unrounded")}{' '}{result.Nraw.toFixed(1)}{t("）", ")")}</span></div>
          <div className="result-item"><span className="result-label">{t("实际照度", "Estimated illuminance")}</span><span className="result-value">{result.Eactual.toFixed(0)} lux</span></div>
          <div className="result-item"><span className="result-label">{t("功率密度", "Lighting power density")}</span><span className="result-value">{result.wPerM2.toFixed(1)} W/m²</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式原理（利用系数法）", "Formula — Lumen Method")}</h2>
        <p>{t("利用系数法（Lumen Method）是照明设计中最常用的平均照度计算方法，适用于室内均匀照明设计。", "The lumen method estimates average illuminance for a uniform indoor lighting layout.")}</p>
        <div className="formula-box">
          {t("室形指数 RI = (L × W) / (Hm × (L + W))", "Room index RI = (L × W) / (Hm × (L + W))")}<br/>
          {t("利用系数 CU ≈ 0.4 + 0.1 × RI（上限0.7）", "Coefficient of utilization CU ≈ 0.4 + 0.1 × RI, capped at 0.7")}<br/>
          {t("所需灯具数 N = (E × L × W) / (Φ × CU × MF)", "Number of luminaires N = (E × L × W) / (Φ × CU × MF)")}<br/>
          {t("实际照度 E = N × Φ × CU × MF / (L × W)", "Estimated illuminance E = N × Φ × CU × MF / (L × W)")}<br/><br/>
          {t("其中：Hm = 安装高度 - 工作面高度，Φ = 单灯光通量(lm)，MF = 维护系数", "Hm is mounting height above the workplane, Φ is luminaire flux in lm, and MF is the maintenance factor.")}
        </div>
        <p><strong>{t("室形指数 RI：", "Room index RI")}</strong>{' '}{t("反映房间几何形状对照明效率的影响。RI越大，灯光利用率越高。", "RI represents how room geometry affects lighting utilization. A higher room index generally improves utilization.")}</p>
        <p><strong>{t("维护系数 MF：", "Maintenance factor MF")}</strong>{' '}{t("考虑灯具老化和污染导致的光通量衰减，清洁环境取0.8，多尘环境取0.6~0.7。", "MF accounts for aging and dirt that reduce output. Use 0.8 for a clean environment or about 0.6–0.7 for a dusty space.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入房间长度和宽度", "Enter room length and width.")}</li>
          <li>{t("工作面高度：办公桌面取0.8m，站立操作取0.9m，地面取0m", "Set workplane height. Typical values are 0.8 m for a desk, 0.9 m for standing work, and 0 m for floor lighting.")}</li>
          <li>{t("灯具安装高度：吊顶安装取吊顶高度，嵌入式取吊顶高度", "Use ceiling height for a flush-mounted or recessed luminaire.")}</li>
          <li>{t("根据场所类型选择目标照度（参考GB 50034标准）", "Choose the target illuminance for the space. Consult the relevant standard, such as GB 50034 in China.")}</li>
          <li>{t("输入所选灯具的额定光通量（见灯具规格书）", "Enter the rated luminous flux from the luminaire data sheet.")}</li>
          <li>{t("维护系数：清洁办公室取0.8，工厂车间取0.7，多尘环境取0.6", "For a preliminary maintenance factor, use 0.8 for clean offices, 0.7 for workshops, or 0.6 for dusty spaces.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("利用系数CU如何确定？", "How is CU determined?")}</p><p className="faq-answer">{t("精确的CU值需查灯具厂商提供的配光曲线表，与室形指数RI和房间反射率有关。本计算器使用简化公式（CU ≈ 0.4 + 0.1×RI，上限0.7），适合初步估算。精确设计请使用DIALux等专业软件。", "Manufacturer photometric tables relate CU to room index and surface reflectance. This calculator uses CU ≈ 0.4 + 0.1 × RI, capped at 0.7. Use lighting design software such as DIALux for detailed work.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("为什么实际灯具数要向上取整？", "Why round up the number of luminaires?")}</p><p className="faq-answer">{t("照度是最低保证值，向上取整确保实际照度不低于设计值。取整后的实际照度会略高于目标值，这是正常的。", "Rounding up keeps estimated illuminance at or above the target. Some excess illuminance is expected with whole luminaires.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("功率密度LPD有什么意义？", "What is lighting power density?")}</p><p className="faq-answer">{t("照明功率密度（W/m²）是衡量照明节能的重要指标。GB 50034规定办公室LPD不超过9 W/m²，工业厂房不超过7~11 W/m²（视精度要求）。", "Lighting power density is connected lighting power per unit floor area (W/m²). Check the applicable energy standard for limits by space and project type.")}</p></div>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("办公室照明设计：", "Office lighting design")}</strong>{' '}{t("房间10m×8m，吊顶高3m，工作面0.8m，目标照度500lux，选用4000lm LED灯盘，维护系数0.8。", "A 10 × 8 m office has a 3 m ceiling, a 0.8 m workplane, and a 500 lux target. It uses 4000 lm LED luminaires and MF = 0.8.")}</p>
        <p>Hm = 3.0 - 0.8 = 2.2m</p>
        <p>RI = (10×8) / (2.2×(10+8)) = 80/39.6 = 2.02</p>
        <p>CU = min(0.4 + 0.1×2.02, 0.7) = 0.60</p>
        <p>{t("N = (500×10×8) / (4000×0.60×0.8) = 40000/1920 = 20.8 → 21盏", "With CU = 0.60, N = (500 × 10 × 8) / (4000 × 0.60 × 0.8) = 20.8, rounded up to 21 luminaires.")}</p>
        <p>{t("实际照度 = 21×4000×0.60×0.8 / 80 = 504 lux，功率密度 = 21×40/80 = 10.5 W/m²", "Estimated illuminance is 504 lux. At 40 W per luminaire, lighting power density is 21 × 40 / 80 = 10.5 W/m².")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考，正式照明设计请使用专业软件并由持证工程师审核。", "Use the results for reference. Verify final lighting design with professional software and a qualified engineer.")}</div>
    </CalculatorWorkbench>
  )
}
