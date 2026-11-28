'use client'

import {calculatorError} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'
import {moistAir, dryBulbFromEnthalpy} from '@/lib/psychrometrics'

export default function Psychrometric() {
  const t = useTranslation()
  const [mode, setMode] = useState('enthalpy')
  const [temp, setTemp] = useState('')
  const [humidity, setHumidity] = useState('50')
  const [pressure, setPressure] = useState('101.325')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    try {
      const result = moistAir(parseFloat(temp), parseFloat(humidity), parseFloat(pressure))
      setResult({
        W: (result.humidityRatio * 1000).toFixed(2),
        h: result.enthalpyKjKg.toFixed(1),
        Td: result.dewPointC.toFixed(1),
      })
    } catch (e) {
      setResult({error: calculatorError(t, e, '输入参数无效', "Invalid inputs.")})
    }
  }

  const calculateFromEnthalpy = () => {
    try {
      const temperature = dryBulbFromEnthalpy(parseFloat(temp), parseFloat(humidity), parseFloat(pressure))
      setResult({temp: temperature.toFixed(1)})
    } catch (e) {
      setResult({error: calculatorError(t, e, '无法反算温度', "Unable to solve for temperature.")})
    }
  }

  return (
    <CalculatorWorkbench
      slug="psychrometric"
      inputs={
        <>
          <div className="form-group"><label htmlFor="psychrometric-field-1">{t("计算模式", "Calculation mode")}</label>
              <select id="psychrometric-field-1" value={mode} onChange={(e)=>setMode(e.target.value)}>
                <option value="enthalpy">{t("根据温度+湿度计算", "Find properties from temperature and humidity")}</option>
                <option value="reverse">{t("根据焓值反算温度", "Find temperature from enthalpy")}</option>
              </select>
            </div>
          <div className="form-group"><label htmlFor="psychrometric-field-2">{mode === 'reverse' ? t('目标焓值 (kJ/kg干空气)', "Target enthalpy (kJ/kg dry air)") : t('干球温度 (°C)', "Dry-bulb temperature (°C)")}</label><input id="psychrometric-field-2" type="number" value={temp} onChange={(e)=>setTemp(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="psychrometric-field-3">{t("相对湿度 (%)", "Relative humidity (%)")}</label><input id="psychrometric-field-3" type="number" value={humidity} onChange={(e)=>setHumidity(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="psychrometric-field-4">{t("大气压力 (kPa)", "Atmospheric pressure (kPa)")}</label><input id="psychrometric-field-4" type="number" value={pressure} onChange={(e)=>setPressure(e.target.value)}/></div>
          {result?.error && <p role="alert" style={{color:'#b91c1c'}}>{result.error}</p>}
        </>
      }
      result={result && !result.error && (
        <div className="result-group">
          {result.h && <div className="result-item"><span className="result-label">{t("焓值", "Enthalpy")}</span><span className="result-value">{result.h} kJ/kg</span></div>}
          {result.W && <div className="result-item"><span className="result-label">{t("含湿量", "Humidity ratio")}</span><span className="result-value">{result.W} g/kg</span></div>}
          {result.Td && <div className="result-item"><span className="result-label">{t("露点", "Dew point")}</span><span className="result-value">{result.Td} °C</span></div>}
          {result.temp && <div className="result-item"><span className="result-label">{t("温度", "Temperature")}</span><span className="result-value">{result.temp} °C</span></div>}
        </div>
      )}
      onCalculate={mode==='enthalpy'?calculate:calculateFromEnthalpy}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("湿空气性质是暖通空调设计的基础参数。", "Moist-air properties are basic inputs for HVAC design.")}</p>
        <div className="formula-box">
          Ps = 0.61078 × exp(17.27T/(T+237.3))<br/>
          Pv = Ps × RH/100<br/>
          W = 0.622 × Pv/(P-Pv)<br/>
          h = 1.005T + W(2501 + 1.86T)
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择计算模式", "Choose a calculation mode.")}</li>
          <li>{t("输入温度和相对湿度", "Enter temperature and relative humidity, or target enthalpy and relative humidity in inverse mode.")}</li>
          <li>{t("根据需要调整压力（默认：101.325 kPa）", "Adjust atmospheric pressure if needed. It defaults to 101.325 kPa.")}</li>
          <li>{t("点击计算获取所有湿空气参数", "Select Calculate to see the estimated moist-air properties.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <div className="faq-item"><p className="faq-question">{t("什么是焓值？", "What is enthalpy?")}</p><p className="faq-answer">{t("焓值是空气的总热量，单位 kJ/kg，由显热和潜热组成。", "Moist-air enthalpy combines sensible and latent energy and is reported in kJ per kilogram of dry air.")}</p></div>
        <div className="faq-item"><p className="faq-question">{t("为什么压力会影响计算？", "Why does pressure affect the calculation?")}</p><p className="faq-answer">{t("相同温度和相对湿度下，压力越低，含湿量通常越大；压力变化会影响焓值和湿球温度。", "At the same temperature and relative humidity, lower pressure generally increases the humidity ratio. Pressure also affects enthalpy and wet-bulb temperature.")}</p></div>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("近似公式仅供初步估算，低于 0°C 或重要工艺设计请使用经验证的湿空气物性数据和仪表。", "Use these approximations for preliminary estimates. Use validated property data and instruments for subzero conditions or critical process design.")}</div>
    </CalculatorWorkbench>
  )
}
