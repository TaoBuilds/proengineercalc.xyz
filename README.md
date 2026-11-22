# ProEngineerCalc · 智效厂务工程计算器

[在线使用](https://www.proengineercalc.xyz/) · [计算验证与适用范围](docs/engineering-validation.md)

面向厂务工程的在线计算工具箱，覆盖暖通、电气、流体和结构领域的常见初步估算。

## 可复核算例：变压器容量

在[变压器容量计算器](https://www.proengineercalc.xyz/calculators/transformer-capacity)输入总设备功率 **500 kW**、需用系数 **0.7**、同时系数 **0.9**、功率因数 **0.85** 和余量系数 **1.2**。所需容量为 `500 × 0.7 × 0.9 ÷ 0.85 × 1.2 ≈ 444.7 kVA`，预设容量表中的单台候选为 **500 kVA**。

计算结果用于初步估算。变压器选型还需结合温升、谐波、短路水平、冗余和当地规范复核。其他工具的单位、参考结果和模型假设见[验证文档](docs/engineering-validation.md)。

## 工具分类

- **暖通**：露点、湿空气状态、风管风速、冷负荷和水泵扬程
- **电气**：交流功率、电压降、电缆载流量、变压器容量和照度
- **流体**：管道沿程压损、流量换算和雷诺数
- **结构**：混凝土配比、梁荷载、钢材重量和单位换算

## 本地开发

使用 Node.js 22。项目基于 Next.js App Router 和 TypeScript，部署在 Vercel。

```bash
npm ci
npm run dev
```

本地启动后访问 <http://localhost:3000>。修改计算逻辑后运行 `npm run test:engineering`、`npx tsc --noEmit` 和 `npm run build`。

## License

MIT
