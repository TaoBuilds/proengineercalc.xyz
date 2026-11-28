'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

function calcBattery(P: number, h: number, V: number, dod: number, eff: number) {
  const whActual = (P * h) / (eff / 100)
  const whBattery = whActual / (dod / 100)
  const ahRaw = whBattery / V
  const standards = [100, 150, 200, 300, 400, 500]
  const recommended = standards.find(s => s >= ahRaw) ?? Math.ceil(ahRaw / 100) * 100
  return { whActual, whBattery, ahRaw, recommended }
}

export default function BatteryCapacity() {
  const t = useTranslation()
  const [power, setPower] = useState('1000')
  const [hours, setHours] = useState('4')
  const [voltage, setVoltage] = useState('48')
  const [dod, setDod] = useState('80')
  const [efficiency, setEfficiency] = useState('90')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const P = parseFloat(power)
    const h = parseFloat(hours)
    const V = parseFloat(voltage)
    const d = parseFloat(dod)
    const e = parseFloat(efficiency)
    if ([P, h, V, d, e].some(isNaN) || V <= 0 || d <= 0 || e <= 0) return
    setResult(calcBattery(P, h, V, d, e))
  }

  return (
    <CalculatorWorkbench
      slug="battery-capacity"
      inputs={
        <>
          <div className="form-group"><label htmlFor="battery-capacity-field-1">{t("负载功率 (W)", "Load power (W)")}</label><input id="battery-capacity-field-1" type="number" value={power} onChange={(e)=>setPower(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="battery-capacity-field-2">{t("备用时间 (h)", "Backup time (h)")}</label><input id="battery-capacity-field-2" type="number" value={hours} onChange={(e)=>setHours(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="battery-capacity-field-3">{t("电池电压 (V)", "Battery voltage (V)")}</label><input id="battery-capacity-field-3" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="battery-capacity-field-4">{t("放电深度 DoD (%)", "Depth of discharge, DoD (%)")}</label><input id="battery-capacity-field-4" type="number" value={dod} min="1" max="100" onChange={(e)=>setDod(e.target.value)} /></div>
          <div className="form-group"><label htmlFor="battery-capacity-field-5">{t("逆变器效率 (%)", "Inverter efficiency (%)")}</label><input id="battery-capacity-field-5" type="number" value={efficiency} min="1" max="100" onChange={(e)=>setEfficiency(e.target.value)} /></div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("实际所需能量", "Required energy")}</span><span className="result-value">{result.whActual.toFixed(0)} Wh</span></div>
          <div className="result-item"><span className="result-label">{t("电池容量 (Wh)", "Battery capacity (Wh)")}</span><span className="result-value">{result.whBattery.toFixed(0)} Wh</span></div>
          <div className="result-item"><span className="result-label">{t("电池容量 (Ah)", "Battery capacity (Ah)")}</span><span className="result-value">{result.ahRaw.toFixed(1)} Ah</span></div>
          <div className="result-item"><span className="result-label">{t("推荐选型", "Suggested battery size")}</span><span className="result-value">{result.recommended} Ah</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式原理", "Sizing Formula")}</h2>
        <p>{t("蓄电池容量计算需要考虑两个关键修正系数：放电深度（DoD）和逆变器效率。忽略这两个参数会导致电池容量严重不足。", "Battery sizing accounts for depth of discharge (DoD) and inverter efficiency. Omitting either can substantially undersize the battery.")}</p>
        <div className="formula-box">
          {t("实际所需能量 = 负载功率(W) × 备用时间(h) ÷ 逆变器效率", "Required energy = load power (W) × backup time (h) ÷ inverter efficiency")}<br/>
          {t("电池容量(Wh) = 实际所需能量 ÷ DoD", "Battery capacity (Wh) = required energy ÷ DoD")}<br/>
          {t("电池容量(Ah) = 电池容量(Wh) ÷ 电池电压(V)", "Battery capacity (Ah) = battery capacity (Wh) ÷ battery voltage (V)")}
        </div>
        <p><strong>{t("DoD（放电深度）：", "Depth of discharge (DoD)")}</strong>{' '}{t("电池实际可用的容量比例。铅酸电池通常设为50%~80%，锂电池可达80%~90%。设置过高会大幅缩短电池寿命。", "The usable share of nominal capacity. Typical planning values are 50–80% for lead-acid and 80–90% for lithium batteries. A higher DoD can shorten battery life.")}</p>
        <p><strong>{t("逆变器效率：", "Inverter efficiency")}</strong>{' '}{t("将直流电转换为交流电时的能量损耗，典型值85%~95%。效率越低，需要的电池容量越大。", "The share of DC input energy delivered as AC output, typically 85–95%. Lower efficiency increases the required battery capacity.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入负载总功率（所有用电设备功率之和）", "Enter total power for all connected loads.")}</li>
          <li>{t("输入需要保障的备用时间", "Enter the required backup time.")}</li>
          <li>{t("输入电池组标称电压（常见12V、24V、48V）", "Enter nominal battery bank voltage, such as 12, 24, or 48 V.")}</li>
          <li>{t("根据电池类型设置DoD：铅酸电池建议50%~80%，锂电池建议80%~90%", "Set DoD for the battery type. Typical planning ranges are 50–80% for lead-acid and 80–90% for lithium.")}</li>
          <li>{t("输入逆变器效率，一般取90%", "Enter inverter efficiency. A typical estimate is 90%.")}</li>
          <li>{t("计算结果会自动向上取整到标准规格", "The suggested size rounds up to the next standard rating.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("DoD是什么？", "What is DoD?")}</p><p className="faq-answer">{t("DoD（Depth of Discharge，放电深度）是指电池实际放出的电量占总容量的百分比。例如100Ah电池DoD=80%，则实际可用80Ah，剩余20Ah作为保护余量。", "Depth of discharge is the share of nominal capacity that is discharged. At 80% DoD, a 100 Ah battery delivers 80 Ah and keeps 20 Ah in reserve.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("为什么不能100%放电？", "Why avoid discharging to 100%?")}</p><p className="faq-answer">{t("深度放电会加速电池极板硫化（铅酸）或造成过放保护（锂电），大幅缩短循环寿命。铅酸电池每次100%放电可能只有200次循环，而50%放电可达500次以上。", "Deep discharge can promote sulfation in lead-acid batteries or trigger over-discharge protection in lithium batteries. Cycle life depends on battery design and operating conditions. A lead-acid battery might last about 200 full cycles or more than 500 cycles at 50% DoD.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("铅酸电池与锂电池DoD有何区别？", "How does allowable DoD vary by battery type?")}</p><p className="faq-answer">{t("铅酸电池推荐DoD为50%~80%，锂铁磷酸电池（LiFePO4）可达80%~90%，三元锂电池可达80%~85%。锂电池DoD更高意味着同等容量下实际可用能量更多，综合成本更低。", "Typical planning values are 50–80% for lead-acid, 80–90% for lithium iron phosphate (LiFePO₄), and 80–85% for ternary lithium. A higher allowable DoD provides more usable energy for the same nominal rating.")}</p></div>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("UPS系统设计：", "UPS sizing")}</strong>{' '}{t("某工厂UPS需保障5kW负载运行2小时，采用48V电池组，DoD=80%，逆变器效率90%。", "A factory UPS must support 5 kW for two hours using a 48 V battery bank, 80% DoD, and 90% inverter efficiency.")}</p>
        <p>{t("实际所需能量 = 5000 × 2 ÷ 0.9 = 11,111 Wh", "Required energy = 5000 × 2 ÷ 0.9 = 11,111 Wh")}</p>
        <p>{t("电池容量(Wh) = 11,111 ÷ 0.8 = 13,889 Wh", "Battery capacity = 11,111 ÷ 0.8 = 13,889 Wh")}</p>
        <p>{t("电池容量(Ah) = 13,889 ÷ 48 = 289 Ah → 推荐选型 300 Ah", "Battery capacity = 13,889 ÷ 48 = 289 Ah. The suggested size is 300 Ah.")}</p>
        <p>{t("若不考虑DoD和效率，简单计算仅需 5000×2÷48 ≈ 208 Ah，实际会严重不足。", "Ignoring DoD and efficiency gives 5000 × 2 ÷ 48 ≈ 208 Ah, which undersizes the battery.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考，实际选型请结合电池厂商规格和专业工程师意见。", "Use the results for reference. Check the battery manufacturer’s specifications and consult a qualified engineer for final sizing.")}</div>
    </CalculatorWorkbench>
  )
}
