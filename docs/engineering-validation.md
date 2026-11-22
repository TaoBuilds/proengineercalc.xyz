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

- Cable ampacity: 2.5 mm² copper, B1, 30°C gives 21.0 A. At 40°C the same
  entry gives 18.2 A under the simplified temperature model.
- Voltage drop: 230 V source, 20 A, 100 m one-way, 2.5 mm² copper gives
  33.60 V (14.61%), leaving 196.4 V at the load. A 3% drop limit gives
  approximately 4.11 A for the same cable or 12.17 mm² for the same 20 A load.
- Straight pipe: water at 20°C, 30 m³/h, 100 mm actual internal diameter,
  50 m length and 0.046 mm roughness give 1.061 m/s and about 5.641 kPa
  of friction pressure loss under the Darcy–Weisbach model.

## Assumptions
The Tetens saturation equation is an approximation over **liquid water** and
not suitable for precision sub-zero work. The wet-bulb result uses an iterative
adiabatic-saturation approximation rather than a calibrated hygrometer.
Actual transformer design must additionally consider voltage class, harmonic
currents, thermal derating, expansion, parallel-operation constraints, redundancy,
short-circuit levels and local standards.

Cable ampacity uses a simplified lookup and a 70°C conductor approximation.
Verify the applicable installation table, insulation rating and correction
factors for cable grouping and other site conditions. The voltage-drop model
uses round-trip resistance and a factor of 1.2 for DC or single-phase estimates
that neglect reactance. The 3% threshold is a screening target. Select actual
cable sizes from the applicable catalogue and also check ampacity. Pipe pressure
covers straight-pipe friction. Account for fittings, valves and elevation
separately. Transitional-flow results use the same friction approximation as
turbulent flow and are especially sensitive to operating conditions.

Run tests locally with Node.js 22: `npm run test:engineering`.
CI also checks TypeScript and production build after dependencies are installed.
