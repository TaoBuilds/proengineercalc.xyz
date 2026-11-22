import test from 'node:test'
import assert from 'node:assert/strict'
import {estimateCableAmpacity} from '../lib/cable-ampacity.ts'
import {
  calculateDropLimitedCurrent, calculateMinimumArea, calculateVoltageDrop,
} from '../lib/voltage-drop.ts'
import {calculatePipePressure} from '../lib/pipe-pressure.ts'

const close = (actual, expected, tolerance) =>
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`)

test('cable ampacity applies material, installation and temperature factors', () => {
  assert.equal(estimateCableAmpacity('copper', 2.5, 'B1', 30), 21)
  assert.equal(estimateCableAmpacity('copper', 2.5, 'B1', 40), 18.2)
  assert.equal(estimateCableAmpacity('aluminum', 2.5, 'A2', 30), 13.2)
})

test('cable ampacity rejects undocumented sizes and out-of-range temperatures', () => {
  assert.throws(() => estimateCableAmpacity('copper', 3, 'B1', 30), /截面积/)
  assert.throws(() => estimateCableAmpacity('copper', 2.5, 'B1', 70), /温度/)
  assert.throws(() => estimateCableAmpacity('copper', 2.5, 'B1', NaN), /温度/)
})

const circuit = {voltageV: 230, lengthM: 100, material: 'copper'}

test('voltage drop uses twice the one-way length and the resistance factor', () => {
  const result = calculateVoltageDrop(circuit, 20, 2.5)
  close(result.dropV, 33.60, 0.001)
  close(result.dropPercent, 14.61, 0.01)
  close(result.loadVoltageV, 196.4, 0.001)
  close(calculateVoltageDrop(circuit, 20, 1.5).dropV, 56, 0.001)
  assert.equal(calculateVoltageDrop(circuit, 0, 2.5).dropV, 0)
})

test('voltage-drop inverse modes use the same three percent threshold', () => {
  const {limitV, currentA} = calculateDropLimitedCurrent(circuit, 2.5)
  close(limitV, 6.9, 0.001)
  close(currentA, 4.107, 0.001)
  close(calculateMinimumArea(circuit, 20), 12.174, 0.001)
  close(calculateVoltageDrop(circuit, currentA, 2.5).dropPercent, 3, 0.001)
})

test('voltage-drop modes reject missing and nonphysical inputs', () => {
  assert.throws(() => calculateVoltageDrop({...circuit, voltageV: 0}, 20, 2.5), /电压/)
  assert.throws(() => calculateDropLimitedCurrent({...circuit, lengthM: 0}, 2.5), /长度/)
  assert.throws(() => calculateMinimumArea(circuit, NaN), /电流/)
  assert.throws(() => calculateVoltageDrop(circuit, 20, 0), /截面积/)
})

test('straight steel pipe pressure loss matches the turbulent reference case', () => {
  const result = calculatePipePressure(30, 100, 50, 'water20', 0.046)
  assert.equal(result.regime, '湍流')
  close(result.v, 1.061, 0.001)
  close(result.Re, 106103, 1)
  close(result.f, 0.02008, 0.00001)
  close(result.hf, 0.576, 0.001)
  close(result.dP, 5.641, 0.002)
})

test('pipe pressure handles a hydraulically smooth laminar case', () => {
  const result = calculatePipePressure(0.2, 100, 50, 'water20', 0)
  assert.equal(result.regime, '层流')
  close(result.Re, 707.36, 0.01)
  close(result.dP, 0.0011295, 0.0000001)
})

test('pipe pressure rejects missing values, zero diameter and negative roughness', () => {
  assert.throws(() => calculatePipePressure(30, 0, 50, 'water20', 0.046), /内径/)
  assert.throws(() => calculatePipePressure(30, 100, 50, 'water20', -0.1), /粗糙度/)
  assert.throws(() => calculatePipePressure(Infinity, 100, 50, 'water20', 0), /流量/)
})
