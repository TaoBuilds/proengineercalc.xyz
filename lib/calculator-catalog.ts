const calculators = {
  hvac: [
    { slug: 'dewpoint', title: '露点计算器', desc: '根据海拔、温度和湿度计算露点温度' },
    { slug: 'psychrometric', title: '湿空气性质计算器', desc: '计算焓值、含湿量及空气其他参数' },
    { slug: 'duct-velocity', title: '风管风速计算器', desc: '计算矩形和圆形风管内的空气流速' },
    { slug: 'cooling-load', title: '冷负荷估算器', desc: '快速估算建筑冷负荷' },
    { slug: 'pump-head', title: '水泵扬程计算器', desc: '计算暖通空调系统所需的水泵扬程' },
    { slug: 'air-changes', title: '换气次数计算器', desc: '根据房间尺寸和换气次数计算所需风量' },
  ],
  electrical: [
    { slug: 'power', title: '功率计算器', desc: '根据任意两个已知值计算功率、电流、电压' },
    { slug: 'voltage-drop', title: '电压降计算器', desc: '用双线回路估算压降、电流上限或所需线径' },
    { slug: 'cable-ampacity', title: '电缆载流量计算器', desc: '基于材质、截面积、敷设方式和环境温度估算载流量' },
    { slug: 'illuminance', title: '照度计算器', desc: '计算室内照明水平' },
    { slug: 'battery-capacity', title: '蓄电池容量计算器', desc: '计算备用电源的电池容量' },
    { slug: 'transformer-capacity', title: '变压器容量计算器', desc: '根据用电负荷计算所需变压器容量' },
    { slug: 'motor-current', title: '电机电流计算器', desc: '计算电机额定电流和启动电流' },
  ],
  fluid: [
    { slug: 'pipe-pressure', title: '管道压力损失计算器', desc: '估算直管沿程压损、流速与雷诺数' },
    { slug: 'flow-conversion', title: '流量单位换算', desc: 'GPM、L/s、m³/h 之间互转' },
    { slug: 'reynolds', title: '雷诺数计算器', desc: '计算管道流动的雷诺数' },
  ],
  structure: [
    { slug: 'concrete-mix', title: '混凝土配比计算器', desc: '计算混凝土配合比' },
    { slug: 'beam-load', title: '梁荷载计算器', desc: '计算梁的挠度和应力' },
    { slug: 'unit-converter', title: '单位换算器', desc: '工程单位之间的换算' },
    { slug: 'steel-weight', title: '钢材重量计算器', desc: '计算各类型钢材的重量' },
  ],
}

export type CalculatorCategory = keyof typeof calculators

export const categories = [
  { id: 'hvac', label: '暖通空调', code: 'HVAC', description: '湿空气、通风、冷负荷与水泵选型的初步计算。' },
  { id: 'electrical', label: '电气工程', code: 'ELEC', description: '功率、电流、线缆和供电容量的初步估算。' },
  { id: 'fluid', label: '流体力学', code: 'FLUID', description: '管道沿程压损、流动状态和流量单位换算。' },
  { id: 'structure', label: '结构工程', code: 'STRUCT', description: '材料、梁荷载、钢材重量和工程单位换算。' },
] as const

export const calculatorCatalog = categories.flatMap(category =>
  calculators[category.id].map(tool => ({
    ...tool,
    category: category.id,
    categoryLabel: category.label,
    categoryCode: category.code,
  })),
)
