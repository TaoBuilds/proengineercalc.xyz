'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function AirChanges() {
  const t = useTranslation()
  const [roomL, setRoomL] = useState('10')
  const [roomW, setRoomW] = useState('8')
  const [roomH, setRoomH] = useState('3')
  const [achPreset, setAchPreset] = useState('6')
  const [customAch, setCustomAch] = useState('')
  const [result, setResult] = useState<any>(null)

  const presets: Record<string, string> = {
    '6': t('办公室 (6次/h)', "Office (6 ACH)"),
    '10': t('实验室 (10次/h)', "Laboratory (10 ACH)"),
    '20': t('洁净室 (20次/h)', "Cleanroom (20 ACH)"),
    '30': t('厨房 (30次/h)', "Kitchen (30 ACH)"),
    '4': t('停车场 (4次/h)', "Parking garage (4 ACH)"),
    'custom': t('自定义', "Custom")
  }

  const calculate = () => {
    const L = parseFloat(roomL), W = parseFloat(roomW), H = parseFloat(roomH)
    const ach = achPreset === 'custom' ? parseFloat(customAch) : parseFloat(achPreset)
    if (isNaN(L) || isNaN(W) || isNaN(H) || isNaN(ach)) return
    const volume = L * W * H
    const flowRate = volume * ach
    const area = flowRate / 3600 / 6
    const diameter = Math.sqrt(4 * area / Math.PI) * 1000
    setResult({ volume: volume.toFixed(1), ach, flowRate: flowRate.toFixed(0), diameter: diameter.toFixed(0) })
  }

  return (
    <CalculatorWorkbench
      slug="air-changes"
      inputs={
        <>
          <div className="form-group"><label htmlFor="air-changes-field-1">{t("房间长度 (m)", "Room length (m)")}</label><input id="air-changes-field-1" type="number" value={roomL} onChange={(e)=>setRoomL(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="air-changes-field-2">{t("房间宽度 (m)", "Room width (m)")}</label><input id="air-changes-field-2" type="number" value={roomW} onChange={(e)=>setRoomW(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="air-changes-field-3">{t("房间高度 (m)", "Room height (m)")}</label><input id="air-changes-field-3" type="number" value={roomH} onChange={(e)=>setRoomH(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="air-changes-field-4">{t("换气次数标准", "Air changes preset")}</label>
              <select id="air-changes-field-4" value={achPreset} onChange={(e)=>setAchPreset(e.target.value)}>
                {Object.entries(presets).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          {achPreset === 'custom' && (
              <div className="form-group"><label htmlFor="air-changes-field-5">{t("自定义换气次数 (次/h)", "Custom air changes (ACH)")}</label><input id="air-changes-field-5" type="number" value={customAch} onChange={(e)=>setCustomAch(e.target.value)} placeholder={t("请输入换气次数", "Enter air changes per hour")}/></div>
            )}
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("房间体积", "Room volume")}</span><span className="result-value">{result.volume} m³</span></div>
          <div className="result-item"><span className="result-label">{t("换气次数", "Air changes per hour")}</span><span className="result-value">{result.ach}{' '}{t("次/h", "ACH")}</span></div>
          <div className="result-item"><span className="result-label">{t("所需风量", "Required airflow")}</span><span className="result-value">{result.flowRate} m³/h</span></div>
          <div className="result-item"><span className="result-label">{t("推荐风管直径 (6m/s)", "Suggested duct diameter (6 m/s)")}</span><span className="result-value">{result.diameter} mm</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("换气次数（ACH）是衡量室内空气质量的重要指标，表示每小时房间内空气被完全更换的次数。", "Air changes per hour (ACH) describes how many times the equivalent of a room’s air volume is replaced in an hour.")}</p>
        <div className="formula-box">
          {t("V = L × W × H（房间体积，m³）", "V = L × W × H (room volume, m³)")}<br/>
          {t("Q = V × ACH（所需风量，m³/h）", "Q = V × ACH (required airflow, m³/h)")}<br/>
          {t("推荐风速 6 m/s 反算管径：A = Q / 3600 / 6，d = √(4A/π) × 1000", "For a design air velocity of 6 m/s, A = Q / 3600 / 6 and d = √(4A/π) × 1000.")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入房间的长、宽、高尺寸（单位：米）", "Enter the room length, width, and height in meters.")}</li>
          <li>{t("从下拉菜单选择适用场所的换气次数标准，或选择自定义输入", "Choose an air changes preset or enter a custom value.")}</li>
          <li>{t("点击\"计算\"按钮", "Select Calculate.")}</li>
          <li>{t("查看所需风量及推荐风管直径结果", "Review the required airflow and suggested duct diameter.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("各场所换气次数标准参考：", "Example air change rates by space type")}</strong></p>
        <p>{t("办公室：6次/h", "Office — 6 ACH")}</p>
        <p>{t("会议室：8次/h", "Meeting room — 8 ACH")}</p>
        <p>{t("实验室：10次/h", "Laboratory — 10 ACH")}</p>
        <p>{t("洁净室：20次/h", "Cleanroom — 20 ACH")}</p>
        <p>{t("厨房：30次/h", "Kitchen — 30 ACH")}</p>
        <p>{t("停车场：4次/h", "Parking garage — 4 ACH")}</p>
        <p>{t("医院手术室：20次/h", "Operating room — 20 ACH")}</p>
        <p><strong>{t("换气次数越高意味着什么？", "What does a higher air change rate mean?")}</strong></p>
        <p>{t("换气次数越高，室内空气越新鲜，但能耗也越大。应根据实际使用场景和规范要求合理选取。", "A higher rate increases air replacement and can raise energy use. Select a rate for the actual space and applicable requirements.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("某洁净室尺寸为 10×8×3m，换气次数要求 20次/h。", "A cleanroom measures 10 × 8 × 3 m and requires 20 ACH.")}</p>
        <p>{t("房间体积 V = 10×8×3 = 240 m³", "Room volume V = 10 × 8 × 3 = 240 m³")}</p>
        <p>{t("所需风量 Q = 240×20 = 4800 m³/h", "Required airflow Q = 240 × 20 = 4800 m³/h")}</p>
        <p>{t("按风速 6m/s 反算：A = 4800/3600/6 = 0.222 m²，推荐管径 ≈ 535 mm", "At 6 m/s, A = 4800 / 3600 / 6 = 0.222 m², giving a duct diameter of about 535 mm.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考，实际工程设计请遵循相关规范并由专业工程师审核。", "Use the results for reference. Follow applicable standards and have a qualified engineer review final designs.")}</div>
    </CalculatorWorkbench>
  )
}
