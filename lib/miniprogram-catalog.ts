import {text} from './locale'
import type {Locale} from './locale'

export const miniProgramName = '智效动力计算器'

export const brandName = (locale: Locale) => text(locale, miniProgramName, 'ProEngineerCalc')

type MiniTool = {code: string; title: string; description: string; enTitle: string; enDescription: string; href?: string; search?: string}
const tool = (code: string, title: string, description: string, enTitle: string, enDescription: string, href?: string, search?: string): MiniTool => ({code, title, description, enTitle, enDescription, href, search})
const calc = (slug: string) => '/calculators/' + slug
const units = (category: string) => calc('unit-converter') + '?category=' + category

export const miniCategories = [
  {id: 'hvac', code: 'HV', title: '暖通空调', description: '露点、湿空气、风管和冷负荷', enTitle: "HVAC", enDescription: "Dew point, moist air, duct velocity, and cooling loads", tools: [
    tool('DP', '露点计算器', '计算露点、湿球温度与焓值', "Dew Point Calculator", "Calculate dew point, wet-bulb temperature, and enthalpy", calc('dewpoint')),
    tool('HX', '焓湿图', '焓值、含湿量与状态点分析', "Psychrometric Chart", "Analyze enthalpy, humidity ratio, and air states"),
    tool('HP', '湿空气参数', '计算焓值、含湿量与湿球温度', "Moist Air Properties", "Calculate enthalpy, humidity ratio, and wet-bulb temperature", calc('psychrometric'), '焓湿图 psychrometric'),
    tool('FS', '风管风速', '矩形和圆形风管内空气流速', "Duct Velocity", "Find air velocity in round and rectangular ducts", calc('duct-velocity')),
    tool('LH', '冷负荷估算', '快速估算建筑冷负荷', "Cooling Load Estimate", "Estimate building cooling loads", calc('cooling-load')),
    tool('LS', '冷冻水流量速算', '按冷量和供回水温差估算水流量', "Chilled Water Flow", "Estimate flow from cooling capacity and supply-return temperature difference"),
    tool('RT', '冷量单位速查', '冷吨、千瓦、英热单位和制冷量单位互转', "Cooling Capacity Conversion", "Convert tons of refrigeration, kW, BTU/h, and other units"),
    tool('PT', '制冷剂压力温度对照', '常用制冷剂饱和压力与温度双向查询', "Refrigerant Pressure and Temperature", "Look up saturation pressure or temperature for common refrigerants"),
    tool('YC', '水泵扬程', '估算暖通系统所需水泵扬程', "Pump Head", "Estimate pump head for HVAC systems", calc('pump-head')),
    tool('HQ', '换气次数', '根据房间尺寸计算所需风量', "Air Changes", "Find required airflow from room dimensions", calc('air-changes')),
  ]},
  {id: 'electrical', code: 'EL', title: '电气工程', description: '功率、电压降、载流量和照度', enTitle: "Electrical Engineering", enDescription: "Power, voltage drop, ampacity, and illuminance", tools: [
    tool('GL', '功率计算', '功率、电流、电压互算', "Electrical Power", "Calculate power, current, and voltage", calc('power')),
    tool('YJ', '电压降', '估算电力线路的电压损失', "Voltage Drop", "Estimate the voltage drop on an electrical circuit", calc('voltage-drop')),
    tool('ZL', '电缆载流量', '估算不同敷设条件下的电缆载流量', "Cable Ampacity", "Estimate ampacity for different cable installations", calc('cable-ampacity')),
    tool('DX', '电缆选型', '结合载流量和压降筛选电缆截面', "Cable Sizing", "Select conductor sizes using ampacity and voltage drop"),
    tool('ZD', '照度计算', '计算室内照明水平', "Illuminance", "Estimate indoor lighting levels", calc('illuminance')),
    tool('DC', '蓄电池容量', '估算备用电源的电池容量', "Battery Capacity", "Estimate battery capacity for backup power", calc('battery-capacity')),
    tool('BY', '变压器容量', '根据负荷计算所需变压器容量', "Transformer Sizing", "Calculate the required transformer rating from the load", calc('transformer-capacity')),
    tool('DJ', '电机电流', '计算电机额定电流和启动电流', "Motor Current", "Calculate rated and starting current", calc('motor-current')),
    tool('3P', '三相不平衡诊断', '三相电流幅值与负序电压不平衡诊断', "Three-Phase Unbalance", "Check current magnitude and negative-sequence voltage unbalance"),
  ]},
  {id: 'fluid', code: 'FL', title: '流体与管道', description: '管道压损、流量换算和雷诺数', enTitle: "Fluids and Piping", enDescription: "Pipe pressure drop, flow conversions, and Reynolds number", tools: [
    tool('YS', '管道压力损失', '计算管道系统的沿程压力损失', "Pipe Pressure Drop", "Calculate distributed friction loss in pipes", calc('pipe-pressure')),
    tool('KY', '压缩空气管径压降', '压缩空气管径选型与压降校核', "Compressed Air Pipe Sizing", "Check compressed air pipe sizes and pressure drop"),
    tool('GV', '管径–流速–流量换算', '管径、流速、流量互算与校核', "Pipe Diameter, Velocity, and Flow", "Calculate or check any of the three from the other two"),
    tool('LL', '流量单位换算', 'GPM、L/s、m³/h 等单位互转', "Flow Unit Conversion", "Convert between GPM, L/s, m³/h, and other units", calc('flow-conversion')),
    tool('LN', '雷诺数', '计算管道流动的雷诺数', "Reynolds Number", "Calculate Reynolds number for pipe flow", calc('reynolds')),
  ]},
  {id: 'quick-reference', code: 'CK', title: '厂务速查', description: '设备、管材、标准和工程术语', enTitle: "Facility Reference", enDescription: "Equipment, piping materials, standards, and engineering terminology", tools: [
    tool('GJ', '管径规格速查', 'PVC-U、PPR、PE、碳钢和卫生级不锈钢规格', "Pipe Size Reference", "Look up PVC-U, PPR, PE, carbon steel, and sanitary stainless steel sizes"),
    tool('BH', '管径外径壁厚速查', '常用管材外径、壁厚和内径对照', "Pipe Dimensions", "Compare outside diameters, wall thicknesses, and inside diameters"),
    tool('LS', '常用螺栓规格速查', '公制粗牙螺距与六角头对边尺寸', "Bolt Size Reference", "Look up metric coarse thread pitch and hex width across flats"),
    tool('EN', '厂务英文及缩写速查', '暖通、气水、电气与自控常用中英术语', "Facility Terms and Abbreviations", "Chinese and English terms for HVAC, utilities, electrical, and controls"),
    tool('VL', '常用推荐流速速查', '水管、风管和气体管道推荐流速', "Recommended Flow Velocities", "Reference velocities for water pipes, ducts, and gas lines"),
    tool('IP', 'IP 防护等级速查', '解读防尘防水等级', "IP Protection Ratings", "Interpret ingress protection ratings for dust and water"),
    tool('CR', '洁净室洁净等级速查', '千级万级与 ISO 等级、粒子限值对照', "Cleanroom Class Reference", "Compare traditional classifications, ISO classes, and particle limits"),
    tool('NB', '能源折标系数速查', '常用能源折标煤系数与自定义口径提示', "Standard Coal Conversion Factors", "Look up standard coal equivalent factors for common energy sources"),
  ]},
  {id: 'units', code: 'UT', title: '单位换算', description: '长度、质量、温度、压力和能耗单位', enTitle: "Unit Conversions", enDescription: "Length, mass, temperature, pressure, and energy units", tools: [
    tool('CD', '长度换算', '米、毫米、英寸和英尺互转', "Length Conversion", "Convert meters, millimeters, inches, and feet", units('length')),
    tool('ZL', '质量换算', 'kg、g、lb 和 oz 等单位互转', "Mass Conversion", "Convert kg, g, lb, oz, and other units", units('mass')),
    tool('WD', '温度换算', '摄氏、华氏和开尔文换算', "Temperature Conversion", "Convert Celsius, Fahrenheit, and Kelvin", units('temperature')),
    tool('BQ', '标况 / 工况流量换算', 'Nm³/min 与 m³/min 在标况和工况之间换算', "Standard and Actual Volume Flow", "Convert between Nm³/min and m³/min at standard and operating conditions"),
    tool('QM', '气体体积与质量换算', '常用气体标况体积、工况体积与质量互转', "Gas Volume and Mass", "Convert standard volume, actual volume, and mass for common gases"),
    tool('GL', '功率换算', 'W、kW、HP 和 BTU/h 互转', "Power Conversion", "Convert W, kW, HP, and BTU/h", units('power')),
    tool('NL', '能量换算', 'J、kJ、kWh 和 BTU 等单位互转', "Energy Conversion", "Convert J, kJ, kWh, and BTU", units('energy')),
    tool('DD', '电阻电导换算', '电阻、电导与电导率换算', "Resistance and Conductance", "Convert electrical resistance, conductance, and conductivity"),
    tool('YL', '压力换算', 'kPa、MPa、bar 和 psi 等单位互转', "Pressure Conversion", "Convert kPa, MPa, bar, psi, and other units", units('pressure')),
  ]},
  {id: 'energy', code: 'ES', title: '节能降耗', description: '制冷、空压与公用工程的节能评估', enTitle: "Energy Efficiency", enDescription: "Energy assessments for refrigeration, compressed air, and facility utilities", tools: [
    tool('ZH', '综合能耗折算', '多能源折标煤、费用和占比汇总', "Total Energy Use", "Summarize standard coal equivalents, costs, and each energy source’s share"),
    tool('IR', '投资回收期计算器', '技改投资、年净收益和累计收益初筛', "Payback Period Calculator", "Estimate retrofit payback, annual net benefits, and cumulative returns"),
    tool('BF', '水泵变频节能估算', '按频率变化估算节电量与回收期', "Variable-Speed Pump Savings", "Estimate electricity savings and payback from changing pump speed"),
    tool('CP', 'COP / EER 计算', '制冷性能系数与能效比换算', "COP and EER", "Convert between coefficient of performance and energy efficiency ratio"),
    tool('BJ', '冷却塔逼近度计算', '按环境温湿度和出水温度评价冷却塔逼近度', "Cooling Tower Approach", "Evaluate approach from ambient conditions and leaving-water temperature"),
    tool('LT', '冷却塔补水排污', '蒸发、漂水、排污与补水量校核', "Cooling Tower Makeup and Blowdown", "Estimate evaporation, drift, blowdown, and makeup water"),
    tool('HR', '水系统热回收计算', '按水流量与温差估算可回收热量', "Water-Side Heat Recovery", "Estimate recoverable heat from water flow and temperature difference"),
    tool('BG', '空压机比功率', '按输入功率和产气量计算空压机比功率', "Compressor Specific Power", "Calculate specific power from input power and delivered air flow", undefined, '压缩空气 compressed air'),
  ]},
] as const

export type MiniCategoryId = typeof miniCategories[number]['id']
export type CatalogEntry = MiniTool & {id: string; category: MiniCategoryId}

export const miniCatalog: CatalogEntry[] = miniCategories.flatMap(category =>
  category.tools.map(tool => ({...tool, id: category.code + '-' + tool.code, category: category.id})),
)

export const featuredToolIds = ['HV-DP', 'EL-DX', 'CK-GJ']
