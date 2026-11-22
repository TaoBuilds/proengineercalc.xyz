export const miniProgramName = '智效动力计算器'

type MiniTool = {code: string; title: string; description: string; href?: string; search?: string}
const tool = (code: string, title: string, description: string, href?: string, search?: string): MiniTool => ({code, title, description, href, search})
const calc = (slug: string) => '/calculators/' + slug
const units = (category: string) => calc('unit-converter') + '?category=' + category

export const miniCategories = [
  {id: 'hvac', code: 'HV', title: '暖通空调', description: '露点、湿空气、风管和冷负荷', tools: [
    tool('DP', '露点计算器', '计算露点、湿球温度与焓值', calc('dewpoint')),
    tool('HX', '焓湿图', '焓值、含湿量与状态点分析'),
    tool('HP', '湿空气参数', '计算焓值、含湿量与湿球温度', calc('psychrometric'), '焓湿图'),
    tool('FS', '风管风速', '矩形和圆形风管内空气流速', calc('duct-velocity')),
    tool('LH', '冷负荷估算', '快速估算建筑冷负荷', calc('cooling-load')),
    tool('LS', '冷冻水流量速算', '按冷量和供回水温差估算水流量'),
    tool('RT', '冷量单位速查', '冷吨、千瓦、英热单位和制冷量单位互转'),
    tool('PT', '制冷剂压力温度对照', '常用制冷剂饱和压力与温度双向查询'),
    tool('YC', '水泵扬程', '估算暖通系统所需水泵扬程', calc('pump-head')),
    tool('HQ', '换气次数', '根据房间尺寸计算所需风量', calc('air-changes')),
  ]},
  {id: 'electrical', code: 'EL', title: '电气工程', description: '功率、电压降、载流量和照度', tools: [
    tool('GL', '功率计算', '功率、电流、电压互算', calc('power')),
    tool('YJ', '电压降', '估算电力线路的电压损失', calc('voltage-drop')),
    tool('ZL', '电缆载流量', '估算不同敷设条件下的电缆载流量', calc('cable-ampacity')),
    tool('DX', '电缆选型', '结合载流量和压降筛选电缆截面'),
    tool('ZD', '照度计算', '计算室内照明水平', calc('illuminance')),
    tool('DC', '蓄电池容量', '估算备用电源的电池容量', calc('battery-capacity')),
    tool('BY', '变压器容量', '根据负荷计算所需变压器容量', calc('transformer-capacity')),
    tool('DJ', '电机电流', '计算电机额定电流和启动电流', calc('motor-current')),
    tool('3P', '三相不平衡诊断', '三相电流幅值与负序电压不平衡诊断'),
  ]},
  {id: 'fluid', code: 'FL', title: '流体与管道', description: '管道压损、流量换算和雷诺数', tools: [
    tool('YS', '管道压力损失', '计算管道系统的沿程压力损失', calc('pipe-pressure')),
    tool('KY', '压缩空气管径压降', '压缩空气管径选型与压降校核'),
    tool('GV', '管径–流速–流量换算', '管径、流速、流量互算与校核'),
    tool('LL', '流量单位换算', 'GPM、L/s、m³/h 等单位互转', calc('flow-conversion')),
    tool('LN', '雷诺数', '计算管道流动的雷诺数', calc('reynolds')),
  ]},
  {id: 'quick-reference', code: 'CK', title: '厂务速查', description: '设备、管材、标准和工程术语', tools: [
    tool('GJ', '管径规格速查', 'PVC-U、PPR、PE、碳钢和卫生级不锈钢规格'),
    tool('BH', '管径外径壁厚速查', '常用管材外径、壁厚和内径对照'),
    tool('LS', '常用螺栓规格速查', '公制粗牙螺距与六角头对边尺寸'),
    tool('EN', '厂务英文及缩写速查', '暖通、气水、电气与自控常用中英术语'),
    tool('VL', '常用推荐流速速查', '水管、风管和气体管道推荐流速'),
    tool('IP', 'IP 防护等级速查', '解读防尘防水等级'),
    tool('CR', '洁净室洁净等级速查', '千级万级与 ISO 等级、粒子限值对照'),
    tool('NB', '能源折标系数速查', '常用能源折标煤系数与自定义口径提示'),
  ]},
  {id: 'units', code: 'UT', title: '单位换算', description: '长度、质量、温度、压力和能耗单位', tools: [
    tool('CD', '长度换算', '米、毫米、英寸和英尺互转', units('length')),
    tool('ZL', '质量换算', 'kg、g、lb 和 oz 等单位互转', units('mass')),
    tool('WD', '温度换算', '摄氏、华氏和开尔文换算', units('temperature')),
    tool('BQ', '标况 / 工况流量换算', 'Nm³/min 与 m³/min 在标况和工况之间换算'),
    tool('QM', '气体体积与质量换算', '常用气体标况体积、工况体积与质量互转'),
    tool('GL', '功率换算', 'W、kW、HP 和 BTU/h 互转', units('power')),
    tool('NL', '能量换算', 'J、kJ、kWh 和 BTU 等单位互转', units('energy')),
    tool('DD', '电阻电导换算', '电阻、电导与电导率换算'),
    tool('YL', '压力换算', 'kPa、MPa、bar 和 psi 等单位互转', units('pressure')),
  ]},
  {id: 'energy', code: 'ES', title: '节能降耗', description: '制冷、空压与公用工程的节能评估', tools: [
    tool('ZH', '综合能耗折算', '多能源折标煤、费用和占比汇总'),
    tool('IR', '投资回收期计算器', '技改投资、年净收益和累计收益初筛'),
    tool('BF', '水泵变频节能估算', '按频率变化估算节电量与回收期'),
    tool('CP', 'COP / EER 计算', '制冷性能系数与能效比换算'),
    tool('BJ', '冷却塔逼近度计算', '按环境温湿度和出水温度评价冷却塔逼近度'),
    tool('LT', '冷却塔补水排污', '蒸发、漂水、排污与补水量校核'),
    tool('HR', '水系统热回收计算', '按水流量与温差估算可回收热量'),
    tool('BG', '空压机比功率', '按输入功率和产气量计算空压机比功率', undefined, '压缩空气'),
  ]},
] as const

export type MiniCategoryId = typeof miniCategories[number]['id']
export type CatalogEntry = MiniTool & {id: string; category: MiniCategoryId}

export const miniCatalog: CatalogEntry[] = miniCategories.flatMap(category =>
  category.tools.map(tool => ({...tool, id: category.code + '-' + tool.code, category: category.id})),
)

export const featuredToolIds = ['HV-DP', 'EL-DX', 'CK-GJ']
