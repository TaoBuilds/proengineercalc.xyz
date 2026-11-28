'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

export default function MotorCurrent() {
  const t = useTranslation()
  const [power, setPower] = useState('37')
  const [voltage, setVoltage] = useState('380')
  const [pf, setPf] = useState('0.85')
  const [efficiency, setEfficiency] = useState('92')
  const [startMethod, setStartMethod] = useState('direct')
  const [result, setResult] = useState<any>(null)

  const startMultipliers: Record<string, number> = {
    direct: 6,
    star_delta: 2,
    soft_start: 3,
    vfd: 1.5
  }

  const startLabels: Record<string, string> = {
    direct: t('直接启动 (×6)', "Direct-on-line (×6)"),
    star_delta: t('星三角启动 (×2)', "Star-delta (×2)"),
    soft_start: t('软启动器 (×3)', "Soft starter (×3)"),
    vfd: t('变频器 (×1.5)', "Variable-frequency drive (×1.5)")
  }

  const calculate = () => {
    const P = parseFloat(power) * 1000
    const V = parseFloat(voltage)
    const PF = parseFloat(pf)
    const eta = parseFloat(efficiency) / 100
    if (isNaN(P) || isNaN(V) || isNaN(PF) || isNaN(eta)) return
    const I_rated = P / (Math.sqrt(3) * V * PF * eta)
    const I_start = I_rated * startMultipliers[startMethod]
    const breakerSizes = [6,10,16,20,25,32,40,50,63,80,100,125,160,200,250,315,400]
    const breaker = breakerSizes.find(s => s >= I_rated * 2.5) || 400
    const relay = I_rated * 1.05
    setResult({
      rated: I_rated.toFixed(2),
      start: I_start.toFixed(1),
      breaker,
      relay: relay.toFixed(2)
    })
  }

  return (
    <CalculatorWorkbench
      slug="motor-current"
      inputs={
        <>
          <div className="form-group"><label htmlFor="motor-current-field-1">{t("电机功率 (kW)", "Motor power (kW)")}</label><input id="motor-current-field-1" type="number" value={power} onChange={(e)=>setPower(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="motor-current-field-2">{t("电源电压 (V)", "Supply voltage (V)")}</label><input id="motor-current-field-2" type="number" value={voltage} onChange={(e)=>setVoltage(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="motor-current-field-3">{t("功率因数", "Power factor")}</label><input id="motor-current-field-3" type="number" step="0.01" value={pf} onChange={(e)=>setPf(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="motor-current-field-4">{t("电机效率 (%)", "Motor efficiency (%)")}</label><input id="motor-current-field-4" type="number" value={efficiency} onChange={(e)=>setEfficiency(e.target.value)}/></div>
          <div className="form-group"><label htmlFor="motor-current-field-5">{t("启动方式", "Starting method")}</label>
              <select id="motor-current-field-5" value={startMethod} onChange={(e)=>setStartMethod(e.target.value)}>
                {Object.entries(startLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
        </>
      }
      result={result && (
        <div className="result-group">
          <div className="result-item"><span className="result-label">{t("额定电流", "Rated current")}</span><span className="result-value">{result.rated} A</span></div>
          <div className="result-item"><span className="result-label">{t("启动电流", "Starting current")}</span><span className="result-value">{result.start} A</span></div>
          <div className="result-item"><span className="result-label">{t("推荐断路器", "Suggested breaker rating")}</span><span className="result-value">{result.breaker} A</span></div>
          <div className="result-item"><span className="result-label">{t("热继电器整定值", "Thermal overload setting")}</span><span className="result-value">{result.relay} A</span></div>
        </div>
      )}
      onCalculate={calculate}
    >
      <div className="content-section">
        <h2>{t("公式与原理", "Formula and Principles")}</h2>
        <p>{t("三相异步电动机额定电流由功率、电压、功率因数和效率共同决定，启动电流与启动方式密切相关。", "Three-phase induction motor rated current depends on power, voltage, power factor, and efficiency. Starting current depends on how the motor starts.")}</p>
        <div className="formula-box">
          I_rated = P / (√3 × V × cosφ × η)（A）<br/>
          {t("I_start = I_rated × 启动倍数", "I_start = I_rated × starting multiplier")}<br/>
          {t("断路器整定：≥ I_rated × 2.5", "Breaker screening rating ≥ I_rated × 2.5")}<br/>
          {t("热继电器整定：I_rated × 1.05", "Thermal overload setting = I_rated × 1.05")}
        </div>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入电机额定功率（kW）", "Enter the motor's rated power in kW.")}</li>
          <li>{t("输入电源电压（三相一般为 380V）", "Enter the line-to-line supply voltage, for example 380 V.")}</li>
          <li>{t("输入功率因数（一般取 0.85~0.90）和电机效率（一般取 88%~95%）", "Enter power factor and motor efficiency. Common estimates are 0.85–0.90 and 88–95%, respectively.")}</li>
          <li>{t("选择启动方式", "Choose the starting method.")}</li>
          <li>{t("点击\"计算\"查看额定电流、启动电流及保护元件推荐值", "Select Calculate to see rated current, starting current, and preliminary protective-device ratings.")}</li>
        </ol>
      </div>
      <div className="content-section">
        <h2>{t("常见问题", "Frequently Asked Questions")}</h2>
        <p><strong>{t("各启动方式的启动电流倍数是多少？", "What starting-current multipliers does this calculator use?")}</strong></p>
        <p>{t("直接启动：约 6 倍额定电流，适用于小功率电机。", "Direct-on-line — about six times rated current.")}</p>
        <p>{t("星三角启动：约 2 倍额定电流，适用于 15kW 以上电机。", "Star-delta — about twice rated current, with suitable motors and loads.")}</p>
        <p>{t("软启动器：约 3 倍额定电流，可平滑控制启动过程。", "Soft starter — about three times rated current, depending on settings.")}</p>
        <p>{t("变频器：约 1.5 倍额定电流，启动最平稳，节能效果好。", "Variable-frequency drive — about 1.5 times rated current as a screening value.")}</p>
        <p><strong>{t("断路器为什么取额定电流的 2.5 倍？", "Why use 2.5 times rated current for the breaker?")}</strong></p>
        <p>{t("断路器需躲过电机启动电流，同时保护线路。取 2.5 倍是工程经验值，实际应结合启动方式和断路器特性曲线选取。", "The breaker must accommodate starting current while protecting the circuit. This tool uses a rule of thumb for screening. Check motor starting characteristics, breaker curves, and applicable code for final selection.")}</p>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Example")}</h2>
        <p><strong>{t("案例：", "Example")}</strong>{' '}{t("37kW 电机，380V，功率因数 0.85，效率 92%，采用星三角启动。", "A 37 kW, 380 V motor has a power factor of 0.85 and efficiency of 92%. It uses star-delta starting.")}</p>
        <p>{t("额定电流：I = 37000 / (√3 × 380 × 0.85 × 0.92) = 71.8 A", "Rated current I = 37000 / (√3 × 380 × 0.85 × 0.92) ≈ 71.8 A")}</p>
        <p>{t("启动电流：71.8 × 2 = 143.6 A（星三角启动）", "Starting current ≈ 71.8 × 2 = 143.6 A for star-delta starting.")}</p>
        <p>{t("推荐断路器：71.8 × 2.5 = 179.5 A → 选 200 A", "Breaker screening value ≈ 71.8 × 2.5 = 179.5 A, giving a 200 A candidate.")}</p>
        <p>{t("热继电器整定值：71.8 × 1.05 = 75.4 A", "Thermal overload estimate ≈ 71.8 × 1.05 = 75.4 A.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考，实际工程设计请遵循相关规范并由专业工程师审核。", "Use the results for reference. Follow applicable standards and have a qualified engineer review final designs.")}</div>
    </CalculatorWorkbench>
  )
}
