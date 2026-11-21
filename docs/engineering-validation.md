# Engineering calculations: verification and limitations

These calculators are **preliminary estimates**, not final engineering design or safety approval.

## Units
- Saturation/vapour/atmospheric pressures: kPa (not hPa)
- Humidity ratio: kg water / kg dry air (displayed as g/kg where labeled)
- Moist air enthalpy: kJ/kg dry air
- Transformer active power: kW; apparent power: kVA

## Regression cases
- 25°C, 60% RH, 101.325 kPa: dew point ~16.7°C, humidity ratio ~11.9 g/kg,
  enthalpy ~55.4 kJ/kg dry air; dew point <= wet bulb <= dry bulb.
- 25°C, 100% RH: dew point = wet bulb = dry bulb.
- 2000m altitude: pressure ~79.5kPa under the standard atmosphere approximation.
- Installed 500kW, demand 0.7, coincidence 0.9, PF 0.85, margin 1.2:
  required ~444.7kVA; listed option 500kVA.
- Capacity above 2000kVA: return **no single-transformer recommendation**,
  not a dangerous 2000kVA fallback.

## Assumptions
The Tetens saturation equation is an approximation over **liquid water** and
not suitable for precision sub-zero work. The wet-bulb result uses an iterative
adiabatic-saturation approximation rather than a calibrated hygrometer.
Actual transformer design must additionally consider voltage class, harmonic
currents, thermal derating, expansion, parallel-operation constraints, redundancy,
short-circuit levels and local standards.

Run tests locally with Node.js 22: `npm run test:engineering`.
CI also checks TypeScript and production build after dependencies are installed.
