import test from 'node:test';
import assert from 'node:assert/strict';
import {moistAir, dryBulbFromEnthalpy, pressureAtAltitudeKpa} from '../lib/psychrometrics.ts';
import {sizeTransformer} from '../lib/transformer-sizing.ts';

const close = (actual, expected, tolerance) =>
  assert.ok(Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`);

test('25°C / 60%RH / 101.325 kPa gives physically plausible moist-air values', () => {
  const x = moistAir(25, 60, 101.325);
  close(x.dewPointC, 16.7, 0.3);
  close(x.humidityRatio * 1000, 11.9, 0.3); // g/kg dry air
  close(x.enthalpyKjKg, 55.4, 0.6);
  assert.ok(x.dewPointC < x.wetBulbC && x.wetBulbC < 25);
});

test('at saturation, dry bulb, wet bulb and dew point are identical', () => {
  const x = moistAir(25, 100);
  close(x.dewPointC, 25, 0.0001);
  close(x.wetBulbC, 25, 0.0001);
});

test('high altitude produces lower ambient pressure and changed humidity ratio', () => {
  const p = pressureAtAltitudeKpa(2000);
  close(p, 79.5, 1);
  assert.ok(moistAir(25, 60, p).humidityRatio > moistAir(25, 60).humidityRatio);
});

test('reverse enthalpy solver is consistent with direct formula', () => {
  const input = moistAir(32, 45, 90);
  close(dryBulbFromEnthalpy(input.enthalpyKjKg, 45, 90), 32, 0.01);
});

test('invalid moisture input is rejected instead of rendering NaN', () => {
  assert.throws(() => moistAir(25, 0), /相对湿度/);
  assert.throws(() => moistAir(25, 101), /相对湿度/);
  assert.throws(() => moistAir(100, 50), /范围|支持/);
  assert.throws(() => moistAir(25, 50, 0), /压力/);
  assert.throws(() => pressureAtAltitudeKpa(9000), /海拔/);
  assert.throws(() => dryBulbFromEnthalpy(1e5, 50), /范围/);
});

test('transformer capacity selects next suitable listed size', () => {
  const x = sizeTransformer(500, 0.7, 0.9, 0.85, 1.2);
  close(x.requiredKva, 444.7, 0.1);
  assert.equal(x.suggestedSingleKva, 500);
});

test('transformer sizing must NEVER suggest 2000 kVA for higher loads', () => {
  const x = sizeTransformer(6000, 0.8, 0.9, 0.85, 1.2);
  assert.ok(x.requiredKva > 2000);
  assert.equal(x.suggestedSingleKva, null);
});

test('transformer rejects impossible factors', () => {
  assert.throws(() => sizeTransformer(500, 0.8, 0.9, 0, 1.2));
  assert.throws(() => sizeTransformer(500, 1.5, 0.9, 0.85, 1.2));
  assert.throws(() => sizeTransformer(500, 0.8, 0.9, 0.85, 0.5));
});
