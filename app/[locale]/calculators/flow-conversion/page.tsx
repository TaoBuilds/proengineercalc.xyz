'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function FlowConversion() {
  const t = useTranslation()
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m3h')
  const [result, setResult] = useState<any>(null)

  const rates: Record<string, number> = { lps: 1, m3h: 0.277778, gpm: 0.0630902, cfm: 0.471947, lpm: 1/60 }

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const lps = v * rates[fromUnit]
    setResult({
      lps: lps.toFixed(4),
      m3h: (lps / rates.m3h).toFixed(4),
      gpm: (lps / rates.gpm).toFixed(4),
      cfm: (lps / rates.cfm).toFixed(4),
      lpm: (lps / rates.lpm).toFixed(4)
    })
  }

  return (
    <CalculatorWorkbench
      slug="flow-conversion"
      inputs={
        <>
          <div className="form-group"><label htmlFor="flow-conversion-field-1">{t("数值", "Value")}</label><input id="flow-conversion-field-1" type="number" value={value} onChange={(e)=>setValue(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="flow-conversion-field-2">{t("源单位", "From unit")}</label>
              <select id="flow-conversion-field-2" value={fromUnit} onChange={(e)=>setFromUnit(e.target.value)}>
                <option value="lps">{t("L/s (升/秒)", "L/s (liters per second)")}</option>
                <option value="m3h">{t("m³/h (立方米/小时)", "m³/h (cubic meters per hour)")}</option>
                <option value="gpm">{t("GPM (加仑/分钟)", "GPM (US gallons per minute)")}</option>
                <option value="cfm">{t("CFM (立方英尺/分钟)", "CFM (cubic feet per minute)")}</option>
                <option value="lpm">{t("LPM (升/分钟)", "LPM (liters per minute)")}</option>
              </select>
            </div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">L/s</span><span className="result-value">{result.lps}</span></div>
          <div className="result-item"><span className="result-label">m³/h</span><span className="result-value">{result.m3h}</span></div>
          <div className="result-item"><span className="result-label">GPM</span><span className="result-value">{result.gpm}</span></div>
          <div className="result-item"><span className="result-label">CFM</span><span className="result-value">{result.cfm}</span></div>
          <div className="result-item"><span className="result-label">LPM</span><span className="result-value">{result.lpm}</span></div>
        </div>
      )}
      onCalculate={convert}
      action={t("换算", "Convert")}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Conversion Formulas")}</h2>
        <p>{t("流量单位之间的换算：", "Common flow unit conversions")}</p>
        <div className="formula-box">1 m³/h = 0.27778 L/s<br/>1 GPM = 0.06309 L/s<br/>1 CFM = 0.47195 L/s</div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入流量数值", "Enter the flow value.")}</li>
          <li>{t("选择源单位", "Choose the source unit.")}</li>
          <li>{t("点击换算查看所有结果", "Select Convert to see all equivalent values.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("为什么不同行业用不同单位？", "Why do industries use different units?")}</p><p className="faq-answer">{t("不同行业习惯不同。暖通通常用 GPM 或 L/s，工艺行业通常用 m³/h。", "Unit conventions vary. HVAC often uses GPM or L/s, while process engineering often uses m³/h.")}</p></div>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照。", "Use the results for reference.")}</div>
    </CalculatorWorkbench>
  )
}
