/**
 * Moist-air approximations for HVAC preliminary estimates.
 * T in °C, total/saturation/vapour pressure in kPa, W in kg/kg dry air,
 * and enthalpy in kJ/kg dry air. Saturation correlation is over liquid water;
 * subzero and precision engineering designs require a vetted property library.
 */
export type MoistAir = {
  pressureKpa: number;
  saturationKpa: number;
  vaporKpa: number;
  humidityRatio: number;
  enthalpyKjKg: number;
  dewPointC: number;
  wetBulbC: number;
};

function checkInputs(tempC: number, rhPercent: number, pressureKpa: number): void {
  if (![tempC, rhPercent, pressureKpa].every(Number.isFinite)) {
    throw new Error('请输入有效的数字');
  }
  if (tempC < -20 || tempC > 60) {
    throw new Error('当前近似公式仅支持 -20～60°C');
  }
  if (rhPercent <= 0 || rhPercent > 100) {
    throw new Error('相对湿度应大于 0% 且不超过 100%');
  }
  if (pressureKpa < 40 || pressureKpa > 120) {
    throw new Error('大气压力应在 40～120 kPa');
  }
}

export function pressureAtAltitudeKpa(altitudeM: number): number {
  if (!Number.isFinite(altitudeM) || altitudeM < -500 || altitudeM > 5000) {
    throw new Error('海拔应在 -500～5000 m 范围内');
  }
  return 101.325 * Math.pow(1 - 2.25577e-5 * altitudeM, 5.25588);
}

export function saturationVaporPressureKpa(tempC: number): number {
  // Tetens approximation: 0.61078 kPa, 17.27, 237.3°C
  return 0.61078 * Math.exp(17.27 * tempC / (tempC + 237.3));
}

export function moistAir(tempC: number, rhPercent: number, pressureKpa = 101.325): MoistAir {
  checkInputs(tempC, rhPercent, pressureKpa);
  const saturationKpa = saturationVaporPressureKpa(tempC);
  const vaporKpa = saturationKpa * rhPercent / 100;
  if (pressureKpa <= saturationKpa) {
    throw new Error('大气压力必须高于该温度下的饱和水蒸气压');
  }
  const humidityRatio = 0.62198 * vaporKpa / (pressureKpa - vaporKpa);
  const enthalpyKjKg = 1.006 * tempC + humidityRatio * (2501 + 1.86 * tempC);
  const alpha = Math.log(vaporKpa / 0.61078);
  const dewPointC = 237.3 * alpha / (17.27 - alpha);

  // Thermodynamic wet-bulb approximation via adiabatic saturation energy balance.
  // h1 = h_saturated(Tw) - (Ws-W1) * h_liquid(Tw)
  let lo = dewPointC;
  let hi = tempC;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const psMid = saturationVaporPressureKpa(mid);
    const ws = 0.62198 * psMid / (pressureKpa - psMid);
    const hs = 1.006 * mid + ws * (2501 + 1.86 * mid);
    const hAirEquivalent = hs - (ws - humidityRatio) * 4.186 * mid;
    if (hAirEquivalent > enthalpyKjKg) hi = mid;
    else lo = mid;
  }
  const wetBulbC = (lo + hi) / 2;
  return {pressureKpa, saturationKpa, vaporKpa, humidityRatio,
    enthalpyKjKg, dewPointC, wetBulbC};
}

export function dryBulbFromEnthalpy(
  targetKjKg: number, rhPercent: number, pressureKpa = 101.325,
): number {
  if (!Number.isFinite(targetKjKg)) throw new Error('请输入有效焓值');
  // Validate the relative humidity and pressure before root-finding.
  checkInputs(20, rhPercent, pressureKpa);
  let lo = -20;
  let hi = 60;
  const lowH = moistAir(lo, rhPercent, pressureKpa).enthalpyKjKg;
  const highH = moistAir(hi, rhPercent, pressureKpa).enthalpyKjKg;
  if (targetKjKg < lowH || targetKjKg > highH) {
    throw new Error('目标焓值超出 -20～60°C 的求解范围');
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (moistAir(mid, rhPercent, pressureKpa).enthalpyKjKg > targetKjKg) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
