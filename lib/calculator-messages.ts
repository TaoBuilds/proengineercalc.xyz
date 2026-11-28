import type {Translator} from './locale'

const englishErrors: Record<string, string> = {
  '请输入正的设备功率、0～1 的有效系数及 1～3 的余量系数': 'Enter a positive connected load, factors above 0 and at most 1, and a margin multiplier from 1 to 3.',
  '请使用表中支持的导体截面积；环境温度须大于等于 −20°C 且低于 70°C': 'Select a supported conductor area. Ambient temperature must be at least −20°C and below 70°C.',
  '请输入有效的正数作为系统电压和单程线路长度': 'Enter positive values for system voltage and one-way circuit length.',
  '请输入有效的正数作为导体截面积': 'Enter a positive conductor cross-sectional area.',
  '请输入有效的非负电流': 'Enter a valid current of zero or greater.',
  '请输入有效的正数作为流量、内径和管长；粗糙度须大于等于 0': 'Enter positive flow, inside diameter, and pipe length, and roughness of zero or greater.',
  '请输入有效的数字': 'Enter valid numbers.',
  '当前近似公式仅支持 -20～60°C': 'The approximation supports temperatures from −20°C to 60°C.',
  '相对湿度应大于 0% 且不超过 100%': 'Relative humidity must be greater than 0% and at most 100%.',
  '大气压力应在 40～120 kPa': 'Atmospheric pressure must be between 40 and 120 kPa.',
  '海拔应在 -500～5000 m 范围内': 'Altitude must be between −500 and 5000 m.',
  '大气压力必须高于该温度下的饱和水蒸气压': 'Atmospheric pressure must exceed the saturation vapor pressure at this temperature.',
  '请输入有效焓值': 'Enter a valid enthalpy.',
  '目标焓值超出 -20～60°C 的求解范围': 'The target enthalpy is outside the range that can be solved from −20°C to 60°C.',
}

export function calculatorError(t: Translator, error: unknown, zh: string, en: string) {
  if (!(error instanceof Error)) return t(zh, en)
  return t(error.message, englishErrors[error.message] ?? en)
}

const englishFlowRegimes: Record<string, string> = {'层流': 'Laminar', '过渡流': 'Transitional', '湍流': 'Turbulent'}

export function flowRegimeLabel(t: Translator, regime: string) {
  return t(regime, englishFlowRegimes[regime] ?? regime)
}
