import type {ConductorMaterial} from './cable-ampacity'

const RESISTIVITY_OHM_MM2_PER_M = {copper: 0.0175, aluminum: 0.0283}
const RESISTANCE_FACTOR = 1.2
const DROP_FRACTION = 0.03

type Circuit = {voltageV: number; lengthM: number; material: ConductorMaterial}

function roundTripResistanceFactor({voltageV, lengthM, material}: Circuit) {
  if (![voltageV, lengthM].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error('请输入有效的正数作为系统电压和单程线路长度')
  }
  return RESISTIVITY_OHM_MM2_PER_M[material] * lengthM * 2 * RESISTANCE_FACTOR
}

function requireArea(areaMm2: number) {
  if (!Number.isFinite(areaMm2) || areaMm2 <= 0) {
    throw new Error('请输入有效的正数作为导体截面积')
  }
}

function requireCurrent(currentA: number) {
  if (!Number.isFinite(currentA) || currentA < 0) {
    throw new Error('请输入有效的非负电流')
  }
}

export function calculateVoltageDrop(circuit: Circuit, currentA: number, areaMm2: number) {
  requireCurrent(currentA)
  requireArea(areaMm2)
  const dropV = currentA * (roundTripResistanceFactor(circuit) / areaMm2)
  return {
    dropV,
    dropPercent: dropV / circuit.voltageV * 100,
    loadVoltageV: circuit.voltageV - dropV,
  }
}

export function calculateDropLimitedCurrent(circuit: Circuit, areaMm2: number) {
  requireArea(areaMm2)
  const resistance = roundTripResistanceFactor(circuit) / areaMm2
  const limitV = circuit.voltageV * DROP_FRACTION
  return {limitV, currentA: limitV / resistance}
}

export function calculateMinimumArea(circuit: Circuit, currentA: number) {
  requireCurrent(currentA)
  const limitV = circuit.voltageV * DROP_FRACTION
  return roundTripResistanceFactor(circuit) * currentA / limitV
}
