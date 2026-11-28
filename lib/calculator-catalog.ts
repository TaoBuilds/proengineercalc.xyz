const calculators = {
  hvac: [
    { slug: 'dewpoint', title: '露点计算器', desc: '根据海拔、温度和湿度计算露点温度', enTitle: "Dew Point Calculator", enDescription: "Calculate dew point from altitude, temperature, and relative humidity." },
    { slug: 'psychrometric', title: '湿空气性质计算器', desc: '计算焓值、含湿量及空气其他参数', enTitle: "Moist Air Properties Calculator", enDescription: "Calculate enthalpy, humidity ratio, and other moist-air properties." },
    { slug: 'duct-velocity', title: '风管风速计算器', desc: '计算矩形和圆形风管内的空气流速', enTitle: "Duct Velocity Calculator", enDescription: "Calculate air velocity in rectangular and circular ducts." },
    { slug: 'cooling-load', title: '冷负荷估算器', desc: '快速估算建筑冷负荷', enTitle: "Cooling Load Estimator", enDescription: "Estimate a building’s cooling load." },
    { slug: 'pump-head', title: '水泵扬程计算器', desc: '计算暖通空调系统所需的水泵扬程', enTitle: "Pump Head Calculator", enDescription: "Estimate the pump head needed for an HVAC system." },
    { slug: 'air-changes', title: '换气次数计算器', desc: '根据房间尺寸和换气次数计算所需风量', enTitle: "Air Changes Calculator", enDescription: "Calculate required airflow from room dimensions and air changes per hour." },
  ],
  electrical: [
    { slug: 'power', title: '功率计算器', desc: '根据任意两个已知值计算功率、电流、电压', enTitle: "Electrical Power Calculator", enDescription: "Calculate power, current, or voltage from two known values." },
    { slug: 'voltage-drop', title: '电压降计算器', desc: '用双线回路估算压降、电流上限或所需线径', enTitle: "Voltage Drop Calculator", enDescription: "Estimate voltage drop, allowable current, or conductor size for a two-wire circuit." },
    { slug: 'cable-ampacity', title: '电缆载流量计算器', desc: '基于材质、截面积、敷设方式和环境温度估算载流量', enTitle: "Cable Ampacity Calculator", enDescription: "Estimate ampacity from conductor material, cross-sectional area, installation, and ambient temperature." },
    { slug: 'illuminance', title: '照度计算器', desc: '计算室内照明水平', enTitle: "Illuminance Calculator", enDescription: "Estimate indoor lighting levels." },
    { slug: 'battery-capacity', title: '蓄电池容量计算器', desc: '计算备用电源的电池容量', enTitle: "Battery Capacity Calculator", enDescription: "Estimate battery capacity for backup power." },
    { slug: 'transformer-capacity', title: '变压器容量计算器', desc: '根据用电负荷计算所需变压器容量', enTitle: "Transformer Sizing Calculator", enDescription: "Estimate the required transformer rating from connected loads." },
    { slug: 'motor-current', title: '电机电流计算器', desc: '计算电机额定电流和启动电流', enTitle: "Motor Current Calculator", enDescription: "Calculate a motor’s rated and starting currents." },
  ],
  fluid: [
    { slug: 'pipe-pressure', title: '管道压力损失计算器', desc: '估算直管沿程压损、流速与雷诺数', enTitle: "Pipe Pressure Drop Calculator", enDescription: "Estimate friction loss, velocity, and Reynolds number in a straight pipe." },
    { slug: 'flow-conversion', title: '流量单位换算', desc: 'GPM、L/s、m³/h 之间互转', enTitle: "Flow Unit Converter", enDescription: "Convert between GPM, L/s, and m³/h." },
    { slug: 'reynolds', title: '雷诺数计算器', desc: '计算管道流动的雷诺数', enTitle: "Reynolds Number Calculator", enDescription: "Calculate the Reynolds number for flow in a pipe." },
  ],
  structure: [
    { slug: 'concrete-mix', title: '混凝土配比计算器', desc: '计算混凝土配合比', enTitle: "Concrete Mix Calculator", enDescription: "Estimate material quantities for concrete mixes." },
    { slug: 'beam-load', title: '梁荷载计算器', desc: '计算梁的挠度和应力', enTitle: "Beam Load Calculator", enDescription: "Estimate beam deflection and bending stress." },
    { slug: 'unit-converter', title: '单位换算器', desc: '工程单位之间的换算', enTitle: "Unit Converter", enDescription: "Convert common engineering units." },
    { slug: 'steel-weight', title: '钢材重量计算器', desc: '计算各类型钢材的重量', enTitle: "Steel Weight Calculator", enDescription: "Estimate the weight of common steel sections." },
  ],
}

export type CalculatorCategory = keyof typeof calculators

export const categories = [
  { id: 'hvac', label: '暖通空调', code: 'HV', description: '湿空气、通风、冷负荷与水泵选型的初步计算。', enTitle: "HVAC", enDescription: "Preliminary calculations for moist air, ventilation, cooling loads, and pump selection." },
  { id: 'electrical', label: '电气工程', code: 'EL', description: '功率、电流、线缆和供电容量的初步估算。', enTitle: "Electrical Engineering", enDescription: "Preliminary estimates for power, current, cables, and electrical capacity." },
  { id: 'fluid', label: '流体与管道', code: 'FL', description: '管道沿程压损、流动状态和流量单位换算。', enTitle: "Fluids and Piping", enDescription: "Pipe friction loss, flow regimes, and flow unit conversions." },
  { id: 'structure', label: '结构工程', code: 'STRUCT', description: '材料、梁荷载、钢材重量和工程单位换算。', enTitle: "Structural Engineering", enDescription: "Tools for materials, beams, steel weight, and engineering unit conversions." },
] as const

export const calculatorCatalog = categories.flatMap(category =>
  calculators[category.id].map(tool => ({
    ...tool,
    category: category.id,
    categoryLabel: category.label,
    enCategoryLabel: category.enTitle,
    categoryCode: category.code,
  })),
)
