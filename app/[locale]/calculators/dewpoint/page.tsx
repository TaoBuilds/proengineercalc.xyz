'use client'

import {calculatorError} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState, useEffect } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'
import {moistAir, pressureAtAltitudeKpa} from '@/lib/psychrometrics'

export default function DewPointCalculator() {
  const t = useTranslation()
  const [altitude, setAltitude] = useState(0)
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity] = useState(50)
  const [results, setResults] = useState<{
    dewPoint: number
    wetBulb: number
    enthalpy: number
    humidityRatio: number
    pressure: number
  } | null>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const pressure = pressureAtAltitudeKpa(altitude)
      const x = moistAir(temperature, humidity, pressure)
      setResults({
        dewPoint: Number(x.dewPointC.toFixed(1)),
        wetBulb: Number(x.wetBulbC.toFixed(1)),
        enthalpy: Number(x.enthalpyKjKg.toFixed(1)),
        humidityRatio: Number(x.humidityRatio.toFixed(5)),
        pressure: Number(pressure.toFixed(1)),
      })
      setError('')
    } catch (e) {
      setResults(null)
      setError(calculatorError(t, e, '参数不在支持范围内', "Inputs are outside the supported range."))
    }
  }, [altitude, temperature, humidity])

  return (
    <CalculatorWorkbench
      slug="dewpoint"
      inputs={
        <>
          <div className="form-group">
              <label htmlFor="dewpoint-field-1">{t("海拔 (m)", "Altitude (m)")}</label>
              <input id="dewpoint-field-1"
                type="number"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                placeholder={t("输入海拔", "Enter altitude")}
              />
              <p className="hint">{t("输入海拔高度（0为海平面）", "Use 0 for sea level.")}</p>
            </div>
          <div className="form-group">
              <label htmlFor="dewpoint-field-2">{t("温度 (°C)", "Temperature (°C)")}</label>
              <input id="dewpoint-field-2"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                placeholder={t("输入温度", "Enter temperature")}
              />
            </div>
          <div className="form-group">
              <label htmlFor="dewpoint-field-3">{t("相对湿度 (%)", "Relative humidity (%)")}</label>
              <input id="dewpoint-field-3"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                min={0}
                max={100}
                placeholder={t("输入湿度", "Enter humidity")}
              />
            </div>
          {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
        </>
      }
      result={results && (
        <div className="result-group">
          <div className="result-item">
            <span className="result-label">{t("露点温度", "Dew point temperature")}</span>
            <span className="result-value">{results.dewPoint} °C</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t("近似湿球温度", "Approximate wet-bulb temperature")}</span>
            <span className="result-value">{results.wetBulb} °C</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t("焓值", "Enthalpy")}</span>
            <span className="result-value">{results.enthalpy} kJ/kg</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t("含湿量", "Humidity ratio")}</span>
            <span className="result-value">{results.humidityRatio} kg/kg</span>
          </div>
          <div className="result-item">
            <span className="result-label">{t("大气压力", "Atmospheric pressure")}</span>
            <span className="result-value">{results.pressure} kPa</span>
          </div>
        </div>
      )}
    >
      <div className="content-section">
        <h2>{t("📐 公式与原理", "Formula and Principles")}</h2>

        <h3>{t("什么是露点？", "What is dew point?")}</h3>
        <p>{t("露点是空气冷却到饱和（相对湿度100%）时的温度。当空气冷却到露点以下，水蒸气会凝结成水滴。这就是为什么冷表面会出现凝水。", "Dew point is the temperature at which cooling air reaches saturation at 100% relative humidity. Below the dew point, water vapor condenses. That is why droplets form on cold surfaces.")}</p>

        <h3>{' '}{t("Magnus 公式", "Magnus formula")}</h3>
        <p>{t("露点计算使用 Magnus 公式，建立饱和水蒸气压与温度的关系：", "The Magnus equation relates saturation vapor pressure to temperature to estimate the dew point.")}</p>
        <div className="formula-box">
          γ(T,RH) = ln(RH/100) + (17.27T / (T + 237.3))
          <br />
          Td = (237.3 × γ) / (17.27 - γ)
          <br /><br />
          {t("其中:", "Where")}
          <br />{t("T = 温度 (°C)", "T = temperature (°C)")}
          <br />{t("RH = 相对湿度 (%)", "RH = relative humidity (%)")}
          <br />{t("Td = 露点温度 (°C)", "Td = dew point temperature (°C)")}
        </div>

        <h3>{t("海拔修正", "Altitude correction")}</h3>
        <p>{t("不同海拔的大气压力不同，需用气压公式计算：", "The barometric formula estimates atmospheric pressure at a given altitude.")}</p>
        <div className="formula-box">
          P = P₀ × (1 - 2.25577 × 10⁻⁵ × h)^5.25588
          <br /><br />
          {t("其中:", "Where")}
          <br />{t("P = 海拔h处的大气压力", "P = atmospheric pressure at altitude h")}
          <br />{t("P₀ = 海平面压力 (101.325 kPa)", "P₀ = sea-level pressure (101.325 kPa)")}
          <br />{t("h = 海拔（米）", "h = altitude (m)")}
        </div>

        <h3>{t("湿球温度", "Wet-bulb temperature")}</h3>
        <p>{t("湿球温度是空气在恒定压力下通过蒸发水所能冷却到的最低温度。对冷却塔性能和 HVAC 系统设计至关重要。", "Wet-bulb temperature is the lowest temperature air can reach through evaporative cooling at constant pressure. It matters for cooling tower performance and HVAC design.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("📖 使用说明", "How to Use")}</h2>

        <h3>{t("第一步：输入海拔", "1. Enter altitude")}</h3>
        <p>{t("输入当地海拔（米）。海平面输入0。常见海拔：成都约500m，昆明约1900m。", "Enter local altitude in meters. Use 0 for sea level. Chengdu is about 500 m and Kunming is about 1900 m.")}</p>

        <h3>{t("第二步：输入温度", "2. Enter temperature")}</h3>
        <p>{t("输入干球温度（°C），即普通温度计测量的空气温度。", "Use the dry-bulb air temperature in °C, as measured by a standard thermometer.")}</p>

        <h3>{t("第三步：输入相对湿度", "3. Enter relative humidity")}</h3>
        <p>{t("输入相对湿度百分比（0-100%），可用湿度计测量或查询当地天气数据。", "Enter relative humidity as a percentage above 0 and up to 100. Use a humidity sensor or local weather data.")}</p>

        <h3>{t("第四步：解读结果", "4. Interpret the results")}</h3>
        <ul>
          <li><strong>{t("露点：", "Dew point —")}</strong>{' '}{t("低于13°C = 舒适，21°C以上 = 闷热潮湿", "below 13°C often feels comfortable. Above 21°C often feels humid and oppressive.")}</li>
          <li><strong>{t("湿球：", "Wet-bulb temperature —")}</strong>{' '}{t("蒸发冷却系统的关键参数", "a key input for evaporative cooling systems.")}</li>
          <li><strong>{t("焓值：", "Enthalpy —")}</strong>{' '}{t("空气的总热含量 (kJ/kg)", "total heat content per kilogram of dry air (kJ/kg).")}</li>
          <li><strong>{t("含湿量：", "Humidity ratio —")}</strong>{' '}{t("每千克干空气中所含水蒸气的质量", "mass of water vapor per kilogram of dry air.")}</li>
        </ul>
      </div>
      <div className="content-section">
        <h2>{t("❓ 常见问题", "Frequently Asked Questions")}</h2>

        <div className="faq-item">
          <p className="faq-question">{t("露点对暖通空调为什么重要？", "Why does dew point matter in HVAC?")}</p>
          <p className="faq-answer">{t("露点决定何时产生凝水。在暖通空调中，它有助于选型除湿设备、防止霉菌生长、确保人体舒适度。当室内表面温度低于露点时，就会出现凝水和发霉问题。", "Dew point helps predict condensation, select dehumidification equipment, and manage comfort and mold risk. Indoor surfaces colder than the dew point can collect moisture.")}</p>
        </div>

        <div className="faq-item">
          <p className="faq-question">{t("舒适的露点范围是多少？", "What dew point feels comfortable?")}</p>
          <p className="faq-answer">{t("低于13°C对大多数人来说舒适。13-21°C会感觉越来越潮湿。超过21°C会感觉非常闷热不舒服。", "A dew point below 13°C feels comfortable to many people. Humidity is more noticeable from 13 to 21°C, and above 21°C conditions often feel muggy.")}</p>
        </div>

        <div className="faq-item">
          <p className="faq-question">{t("海拔如何影响露点？", "How does altitude affect the results?")}</p>
          <p className="faq-answer">{t("海拔越高，气压越低，空气能容纳的水分越少。这通常导致露点降低，但关系是非线性的。本计算器自动修正海拔对气压的影响。", "Atmospheric pressure decreases with altitude. The calculator adjusts pressure to estimate moist-air properties, while dew point is calculated from dry-bulb temperature and relative humidity.")}</p>
        </div>

        <div className="faq-item">
          <p className="faq-question">{t("露点和湿球温度有什么区别？", "How do dew point and wet-bulb temperature differ?")}</p>
          <p className="faq-answer">{t("露点是空气达到饱和（产生凝结）的温度。湿球温度是通过蒸发冷却能达到的最低温度。湿球温度始终低于或等于干球温度。", "Dew point is the temperature where condensation starts. Wet-bulb temperature is the lowest temperature available through evaporative cooling and is at or below the dry-bulb temperature.")}</p>
        </div>

        <div className="faq-item">
          <p className="faq-question">{t("这个计算器准吗？", "How accurate is this calculator?")}</p>
          <p className="faq-answer">{t("本计算器使用标准 Magnus 公式和气压公式，在大多数条件下精度在 ±0.5°C 以内。对于精确的工程计算，请用专业软件或湿空气图表验证。", "It uses the Magnus and barometric approximations. For design work, verify the result with engineering software or a psychrometric chart.")}</p>
        </div>
      </div>
      <div className="content-section">
        <h2>{t("📋 案例", "Examples")}</h2>

        <h3>{t("案例1：洁净室设计", "1. Cleanroom design")}</h3>
        <p>{t("半导体洁净室需要精确控制温湿度。典型千级洁净室要求：温度20±2°C，相对湿度45±10%。在20°C和45%RH条件下，本计算器得出露点为7.6°C——任何低于此温度的表面都会产生凝水。", "Semiconductor cleanrooms often require tight temperature and humidity control. At 20°C and 45% relative humidity, the dew point is about 7.6°C. Colder surfaces can collect condensation.")}</p>

        <h3>{t("案例2：工业除湿", "2. Industrial dehumidification")}</h3>
        <p>{t("某仓库位于成都（海拔约500m，夏季条件：32°C，80%RH），露点为28°C。要防止潮湿损害，空调系统必须使所有表面保持在28°C以上，或使用转轮除湿机。", "For a warehouse in Chengdu at about 500 m, a summer condition of 32°C and 80% RH gives a dew point of about 28°C. Keep surfaces above the dew point or use dehumidification to control moisture.")}</p>
      </div>
      <div className="disclaimer">
        <strong>{t("⚠️ 免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照之用。请勿将计算结果作为工程设计或施工的最终依据。", "Use the results for reference. Verify final engineering and construction decisions separately.")}
      </div>
    </CalculatorWorkbench>
  )
}
