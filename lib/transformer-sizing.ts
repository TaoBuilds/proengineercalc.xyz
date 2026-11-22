/** Preliminary distribution-transformer sizing, not a final electrical design. */
export const STANDARD_CAPACITIES_KVA = [50,100,160,200,250,315,400,500,630,800,1000,1250,1600,2000] as const;

export function sizeTransformer(
  installedKw: number,
  demandFactor: number,
  coincidenceFactor: number,
  powerFactor: number,
  marginFactor: number,
) {
  if (![installedKw, demandFactor, coincidenceFactor, powerFactor, marginFactor].every(Number.isFinite) ||
      installedKw <= 0 ||
      demandFactor <= 0 || demandFactor > 1 ||
      coincidenceFactor <= 0 || coincidenceFactor > 1 ||
      powerFactor <= 0 || powerFactor > 1 ||
      marginFactor < 1 || marginFactor > 3) {
    throw new Error('请输入正的设备功率、0～1 的有效系数及 1～3 的余量系数');
  }
  const loadKw = installedKw * demandFactor * coincidenceFactor;
  const apparentKva = loadKw / powerFactor;
  const requiredKva = apparentKva * marginFactor;
  const suggestedSingleKva = STANDARD_CAPACITIES_KVA.find(x => x >= requiredKva) ?? null;
  return {loadKw, apparentKva, requiredKva, suggestedSingleKva};
}
