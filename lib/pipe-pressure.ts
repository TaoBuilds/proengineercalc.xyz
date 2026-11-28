export const PIPE_FLUIDS = {
  water20: {nu: 1e-6, rho: 998, label: '水 20°C', enLabel: 'Water at 20°C'},
  water60: {nu: 0.474e-6, rho: 983, label: '水 60°C', enLabel: 'Water at 60°C'},
  oil: {nu: 50e-6, rho: 870, label: '油', enLabel: 'Oil'},
}

export type PipeFluid = keyof typeof PIPE_FLUIDS

export function calculatePipePressure(
  flowM3h: number, diameterMm: number, lengthM: number, fluid: PipeFluid, roughnessMm: number,
) {
  if (![flowM3h, diameterMm, lengthM].every(value => Number.isFinite(value) && value > 0) ||
      !Number.isFinite(roughnessMm) || roughnessMm < 0) {
    throw new Error('请输入有效的正数作为流量、内径和管长；粗糙度须大于等于 0')
  }

  const flowM3s = flowM3h / 3600
  const diameterM = diameterMm / 1000
  const roughnessM = roughnessMm / 1000
  const {nu, rho} = PIPE_FLUIDS[fluid]
  const v = flowM3s / (Math.PI * (diameterM / 2) ** 2)
  const Re = v * diameterM / nu
  const laminar = Re < 2300
  const f = laminar ? 64 / Re : 0.25 / Math.log10(
    roughnessM / (3.7 * diameterM) + 5.74 / Re ** 0.9,
  ) ** 2
  const hf = f * (lengthM / diameterM) * v ** 2 / (2 * 9.81)
  const dP = rho * 9.81 * hf / 1000
  const regime = laminar ? '层流' : Re < 4000 ? '过渡流' : '湍流'
  return {v, Re, f, hf, dP, regime}
}
