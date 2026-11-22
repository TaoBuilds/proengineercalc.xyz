export const CABLE_BASE_AMPS = {
  copper: {
    1.5: 15.5, 2.5: 21, 4: 28, 6: 36, 10: 50, 16: 68, 25: 89,
    35: 110, 50: 134, 70: 171, 95: 207, 120: 239,
  },
  aluminum: {
    1.5: 12, 2.5: 16.5, 4: 22, 6: 28, 10: 39, 16: 53, 25: 70,
    35: 86, 50: 104, 70: 133, 95: 161, 120: 186,
  },
} satisfies Record<string, Record<number, number>>

export const INSTALL_METHODS = {
  A1: {label: '墙内导管', factor: 0.77},
  A2: {label: '墙内导管', factor: 0.8},
  B1: {label: '墙上导管', factor: 1},
  B2: {label: '墙上导管', factor: 0.95},
  C: {label: '空气中电缆', factor: 1.15},
  D: {label: '直埋', factor: 1.08},
}

export type ConductorMaterial = keyof typeof CABLE_BASE_AMPS
export type InstallMethod = keyof typeof INSTALL_METHODS

export function estimateCableAmpacity(
  material: ConductorMaterial, areaMm2: number, method: InstallMethod, ambientC: number,
) {
  const baseTable: Record<number, number> = CABLE_BASE_AMPS[material]
  if (!(areaMm2 in baseTable) || !Number.isFinite(ambientC) || ambientC < -20 || ambientC >= 70) {
    throw new Error('请使用表中支持的导体截面积；环境温度须大于等于 −20°C 且低于 70°C')
  }

  // Simplified model with a 70°C conductor limit and a 30°C reference ambient.
  const temperatureFactor = ambientC <= 30 ? 1 : Math.sqrt((70 - ambientC) / 40)
  const amps = baseTable[areaMm2] * INSTALL_METHODS[method].factor * temperatureFactor
  return Math.round(amps * 10) / 10
}
