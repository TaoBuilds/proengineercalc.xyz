'use client'

import {calculatorError} from '@/lib/calculator-messages'
import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'
import {estimateCableAmpacity, INSTALL_METHODS} from '@/lib/cable-ampacity'
import type {ConductorMaterial, InstallMethod} from '@/lib/cable-ampacity'

export default function CableAmpacity() {
  const t = useTranslation()
  const [conductorType, setConductorType] = useState<ConductorMaterial>('copper')
  const [size, setSize] = useState(2.5)
  const [installMethod, setInstallMethod] = useState<InstallMethod>('B1')
  const [temp, setTemp] = useState('30')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    try {
      setResult(estimateCableAmpacity(conductorType, size, installMethod, parseFloat(temp)))
      setError('')
    } catch (err) {
      setResult(null)
      setError(calculatorError(t, err, '输入参数无效', "Invalid inputs."))
    }
  }

  return (
    <CalculatorWorkbench
      slug="cable-ampacity"
      inputs={
        <>
          <div className="form-group">
              <label htmlFor="cable-ampacity-field-1">{t("导体材质", "Conductor material")}</label>
              <select id="cable-ampacity-field-1" value={conductorType} onChange={(e) => setConductorType(e.target.value as ConductorMaterial)}>
                <option value="copper">{t("铜", "Copper")}</option>
                <option value="aluminum">{t("铝", "Aluminum")}</option>
              </select>
            </div>
          <div className="form-group">
              <label htmlFor="cable-ampacity-field-2">{t("导体截面积 (mm²)", "Conductor cross-sectional area (mm²)")}</label>
              <input id="cable-ampacity-field-2" type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>
          <div className="form-group">
              <label htmlFor="cable-ampacity-field-3">{t("敷设方式", "Installation method")}</label>
              <select id="cable-ampacity-field-3" value={installMethod} onChange={(e) => setInstallMethod(e.target.value as InstallMethod)}>
                {Object.entries(INSTALL_METHODS).map(([code, method]) => (
                  <option key={code} value={code}>{code} - {t(method.label, method.enLabel)}</option>
                ))}
              </select>
            </div>
          <div className="form-group">
              <label htmlFor="cable-ampacity-field-4">{t("环境温度 (°C)", "Ambient temperature (°C)")}</label>
              <input id="cable-ampacity-field-4" type="number" value={temp} onChange={(e) => setTemp(e.target.value)} />
            </div>
          {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
        </>
      }
      result={result !== null && (
        <div className="result-group">
          <div className="result-item">
            <span className="result-label">{t("估算载流量", "Estimated ampacity")}</span>
            <span className="result-value">{result} A</span>
          </div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("电缆载流量根据导体截面积、材质、敷设方式和环境温度计算。", "Cable ampacity depends on conductor area, material, installation method, and ambient temperature.")}</p>
        <div className="formula-box">
          I = I_base × F_method × F_temp<br/><br/>
          {t("其中:", "Where")}<br/>
          {t("I = 载流量 (A)", "I = ampacity (A)")}<br/>
          {t("I_base = 按导体材质和截面积查表的基准电流 (A)", "I_base = base current from the table for the conductor material and area (A)")}<br/>
          {t("F_method = 敷设方式系数", "F_method = installation factor")}<br/>
          {t("F_temp = 温度系数（30°C 及以下取 1，高于 30°C 采用 70°C 导体温度的简化模型）", "F_temp = temperature factor, set to 1 at 30°C and below. Above 30°C it uses a simplified model with a 70°C conductor temperature.")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("选择导体材质（铜或铝）", "Choose the conductor material, copper or aluminum.")}</li>
          <li>{t("输入电缆截面积（mm²）", "Select the conductor cross-sectional area in mm².")}</li>
          <li>{t("选择敷设方式", "Choose the installation method.")}</li>
          <li>{t("输入环境温度", "Enter ambient temperature.")}</li>
          <li>{t("点击计算", "Select Calculate.")}</li>
        </ol>
      </div>
      <div className="disclaimer">
        <strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照之用。请勿将计算结果作为工程设计或施工的最终依据。", "Use the results for reference. Verify final engineering and construction decisions separately.")}
      </div>
    </CalculatorWorkbench>
  )
}
