'use client'

import {useTranslation} from '@/components/LocaleProvider'
import { useEffect, useState } from 'react'
import CalculatorWorkbench from '@/components/CalculatorWorkbench'

type UnitLabel = string | readonly [string, string]

const unitLabels: Record<string, Record<string, UnitLabel>> = {
  length:      { m: ['m（米）', "m (meter)"], cm: ['cm（厘米）', "cm (centimeter)"], mm: ['mm（毫米）', "mm (millimeter)"], km: ['km（千米）', "km (kilometer)"], inch: ['in（英寸）', "in (inch)"], ft: ['ft（英尺）', "ft (foot)"], yard: ['yd（码）', "yd (yard)"] },
  mass:        { kg: ['kg（千克）', "kg (kilogram)"], g: ['g（克）', "g (gram)"], tonne: ['t（吨）', "t (metric tonne)"], lb: ['lb（磅）', "lb (pound)"], oz: ['oz（盎司）', "oz (ounce)"] },
  pressure:    { bar: 'bar', kPa: ['kPa（千帕）', "kPa (kilopascal)"], psi: 'psi', atm: ['atm（标准大气压）', "atm (standard atmosphere)"], MPa: ['MPa（兆帕）', "MPa (megapascal)"] },
  temperature: { C: ['°C（摄氏度）', "°C (Celsius)"], F: ['°F（华氏度）', "°F (Fahrenheit)"], K: ['K（开尔文）', "K (kelvin)"] },
  energy:      { J: ['J（焦耳）', "J (joule)"], kJ: ['kJ（千焦）', "kJ (kilojoule)"], kWh: ['kWh（千瓦时）', "kWh (kilowatt-hour)"], BTU: ['BTU（英热单位）', "BTU (British thermal unit)"], kcal: ['kcal（千卡）', "kcal (kilocalorie)"] },
  power:       { W: ['W（瓦）', "W (watt)"], kW: ['kW（千瓦）', "kW (kilowatt)"], HP: ['HP（马力）', "HP (horsepower)"], BTUh: ['BTU/h（英热/时）', "BTU/h (British thermal units per hour)"] },
}

// Conversion factors relative to base unit
const units: Record<string, Record<string, number>> = {
  length:   { m: 1, cm: 100, mm: 1000, km: 0.001, inch: 39.3701, ft: 3.28084, yard: 1.09361 },
  mass:     { kg: 1, g: 1000, tonne: 0.001, lb: 2.20462, oz: 35.274 },
  pressure: { bar: 1, kPa: 100, psi: 14.5038, atm: 0.986923, MPa: 0.1 },
  energy:   { J: 1, kJ: 0.001, kWh: 2.77778e-7, BTU: 9.47817e-4, kcal: 2.38846e-4 },
  power:    { W: 1, kW: 0.001, HP: 1.34102e-3, BTUh: 3.41214 },
}

function convertTemp(v: number, from: string): Record<string, string> {
  let celsius: number
  if (from === 'C') celsius = v
  else if (from === 'F') celsius = (v - 32) * 5 / 9
  else celsius = v - 273.15
  return {
    C: celsius.toFixed(4),
    F: (celsius * 9 / 5 + 32).toFixed(4),
    K: (celsius + 273.15).toFixed(4),
  }
}

const categoryLabels: Record<string, readonly [string, string]> = {
  length: ['长度', "Length"], mass: ['质量', "Mass"], pressure: ['压力', "Pressure"], temperature: ['温度', "Temperature"], energy: ['能量', "Energy"], power: ['功率', "Power"],
}

export default function UnitConverter() {
  const t = useTranslation()
  function displayUnit(unit: string) {
    const label = unitLabels[category][unit]
    return typeof label === 'string' ? label : t(...label)
  }
  const [value, setValue] = useState('1')
  const [category, setCategory] = useState('length')
  const [from, setFrom] = useState('m')
  const [result, setResult] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('category')
    if (preset && Object.hasOwn(unitLabels, preset)) {
      setCategory(preset)
      setFrom(Object.keys(unitLabels[preset])[0])
    }
  }, [])

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    const firstUnit = Object.keys(unitLabels[cat])[0]
    setFrom(firstUnit)
    setResult(null)
  }

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    if (category === 'temperature') {
      setResult(convertTemp(v, from))
    } else {
      const table = units[category]
      const base = v / (table[from] ?? 1)
      const r: Record<string, string> = {}
      Object.entries(table).forEach(([u, f]) => {
        r[u] = (base * f).toFixed(6).replace(/\.?0+$/, '')
      })
      setResult(r)
    }
  }

  const currentUnitKeys = Object.keys(unitLabels[category] ?? {})

  return (
    <CalculatorWorkbench
      slug="unit-converter"
      inputs={
        <>
          <div className="form-group"><label htmlFor="unit-converter-field-1">{t("数值", "Value")}</label><input id="unit-converter-field-1" type="number" value={value} onChange={(e)=>setValue(e.target.value)} /></div>
          <div className="form-group">
              <label htmlFor="unit-converter-field-2">{t("类别", "Category")}</label>
              <select id="unit-converter-field-2" value={category} onChange={(e)=>handleCategoryChange(e.target.value)}>
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{t(...v)}</option>)}
              </select>
            </div>
          <div className="form-group">
              <label htmlFor="unit-converter-field-3">{t("源单位", "From unit")}</label>
              <select id="unit-converter-field-3" value={from} onChange={(e)=>setFrom(e.target.value)}>
                {currentUnitKeys.map(u => <option key={u} value={u}>{displayUnit(u)}</option>)}
              </select>
            </div>
        </>
      }
      result={result && (
        <div className="result-group">
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className="result-item">
              <span className="result-label">{displayUnit(k)}</span>
              <span className="result-value">{v}</span>
            </div>
          ))}
        </div>
      )}
      onCalculate={calculate}
      action={t("换算", "Convert")}
    >
      <div className="content-section">
        <h2>{t("常用工程换算速查表", "Common Engineering Conversions")}</h2>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.9rem'}}>
          <thead><tr style={{background:'var(--primary)',color:'white'}}><th style={{padding:'8px',textAlign:'left'}}>{t("类别", "Category")}</th><th style={{padding:'8px',textAlign:'left'}}>{t("换算关系", "Conversion")}</th></tr></thead>
          <tbody>
            <tr style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px'}}>{t("长度", "Length")}</td><td style={{padding:'8px'}}>1 m = 100 cm = 1000 mm；1 ft = 0.3048 m；1 inch = 25.4 mm</td></tr>
            <tr style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px'}}>{t("质量", "Mass")}</td><td style={{padding:'8px'}}>1 t = 1000 kg；1 kg = 2.205 lb；1 lb = 453.6 g</td></tr>
            <tr style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px'}}>{t("压力", "Pressure")}</td><td style={{padding:'8px'}}>1 bar = 100 kPa = 14.5 psi；1 atm = 101.325 kPa = 1.013 bar</td></tr>
            <tr style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px'}}>{t("温度", "Temperature")}</td><td style={{padding:'8px'}}>°F = °C × 9/5 + 32；K = °C + 273.15</td></tr>
            <tr style={{borderBottom:'1px solid #eee'}}><td style={{padding:'8px'}}>{t("能量", "Energy")}</td><td style={{padding:'8px'}}>1 kWh = 3600 kJ = 3412 BTU = 860 kcal</td></tr>
            <tr><td style={{padding:'8px'}}>{t("功率", "Power")}</td><td style={{padding:'8px'}}>1 kW = 1000 W = 1.341 HP = 3412 BTU/h</td></tr>
          </tbody>
        </table>
      </div>
      <div className="content-section">
        <h2>{t("使用说明", "How to Use")}</h2>
        <ol>
          <li>{t("输入需要换算的数值", "Enter the value to convert.")}</li>
          <li>{t("选择换算类别（长度、质量、压力、温度、能量、功率）", "Choose length, mass, pressure, temperature, energy, or power.")}</li>
          <li>{t("选择源单位", "Choose the source unit.")}</li>
          <li>{t("点击换算，结果会同时显示该类别所有单位的对应值", "Select Convert to see the equivalent value in every unit in the category.")}</li>
        </ol>
        <p>{t("温度换算支持摄氏度（°C）、华氏度（°F）和开尔文（K）三种单位互转。", "The temperature tool converts between Celsius (°C), Fahrenheit (°F), and kelvin (K).")}</p>
      </div>
      <div className="content-section">
        <h2>{t("案例", "Examples")}</h2>
        <p><strong>{t("压力换算：", "Pressure —")}</strong>{' '}{t("某设备工作压力为6 bar，换算为常用单位：6 bar = 600 kPa = 0.6 MPa = 87 psi = 5.92 atm。", "a working pressure of 6 bar equals about 600 kPa, 0.6 MPa, 87 psi, or 5.92 atm.")}</p>
        <p><strong>{t("能量换算：", "Energy —")}</strong>{' '}{t("某电机每天耗电50 kWh，换算为：50 kWh = 180,000 kJ = 170,600 BTU = 43,000 kcal。", "a motor using 50 kWh per day consumes about 180,000 kJ, 170,600 BTU, or 43,000 kcal per day.")}</p>
        <p><strong>{t("功率换算：", "Power —")}</strong>{' '}{t("一台75 kW电机，换算为：75 kW = 100.6 HP = 255,910 BTU/h。", "a 75 kW motor is rated at about 100.6 HP or 255,910 BTU/h.")}</p>
      </div>
      <div className="disclaimer"><strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参考。", "Use the results for reference.")}</div>
    </CalculatorWorkbench>
  )
}
