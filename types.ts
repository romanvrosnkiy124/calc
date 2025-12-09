
export enum ExteriorMaterial {
  METAL_SIDING = 'METAL_SIDING', // Профлист
  GALVANIZED = 'GALVANIZED', // Профлист, RAL на выбор
}

export enum InteriorMaterial {
  DVPO = 'DVPO', // ДВПО/Оргалит
  OSB = 'OSB', // OSB плита
  PVC_PANELS = 'PVC_PANELS', // ПВХ панели
  WOODEN_LINING = 'WOODEN_LINING', // Вагонка
  MDF_PVC = 'MDF_PVC' // МДФ стены, потолок ПВХ
}

export enum InsulationType {
  NONE = 'NONE',
  MINERAL_WOOL_50 = 'MINERAL_WOOL_50',
  MINERAL_WOOL_100 = 'MINERAL_WOOL_100'
}

export enum WindowSize {
  PVC_50x50 = 'PVC_50x50',
  PVC_80x100 = 'PVC_80x100',
  PVC_80x100_TILT = 'PVC_80x100_TILT',
  WOOD_90x110 = 'WOOD_90x110',
  WOOD_75x85 = 'WOOD_75x85', // Деревянное 0.75x0.85
  PVC_100x85 = 'PVC_100x85'  // ПВХ 1.0x0.85
}

export enum DoorType {
  DVP_EXT = 'DVP_EXT',     // Дверь ДВП (Снаружи обшита листом)
  METAL_RF = 'METAL_RF',   // Металлическая РФ
  PVC_EXT = 'PVC_EXT',     // ПВХ входная
  DVP_INT = 'DVP_INT',     // Дверь ДВП внутренняя
  WOOD_INT = 'WOOD_INT'    // Дверь Филенчатая (Дерево)
}

export enum DoorCategory {
  EXTERIOR = 'EXTERIOR',
  INTERIOR = 'INTERIOR'
}

export enum PlumbingType {
  TOILET = 'TOILET',           // Унитаз
  SINK = 'SINK',               // Раковина
  SHOWER_TRAY = 'SHOWER_TRAY', // Душевой поддон
  SHOWER_CABIN = 'SHOWER_CABIN', // Душевая кабина
  WATER_HEATER_30 = 'WATER_HEATER_30', // Бойлер 30л
  WATER_HEATER_50 = 'WATER_HEATER_50', // Бойлер 50л
  WATER_HEATER_80 = 'WATER_HEATER_80', // Бойлер 80л
  WATER_HEATER_100 = 'WATER_HEATER_100', // Бойлер 100л
  SEWERAGE_OUT = 'SEWERAGE_OUT' // Вывод канализации
}

export interface WindowItem {
  id: string;
  size: WindowSize;
  count: number;
}

export interface DoorItem {
  id: string;
  type: DoorType;
  category: DoorCategory;
  count: number;
}

export interface PlumbingItem {
  id: string;
  type: PlumbingType;
  count: number;
}

export interface CabinConfig {
  length: number; // meters
  width: number; // meters
  height: number; // meters
  exterior: ExteriorMaterial;
  interior: InteriorMaterial;
  insulation: InsulationType;
  
  windowList: WindowItem[];
  doorList: DoorItem[];
  plumbingList: PlumbingItem[];
  
  partitionsShort: number; // 2.45m
  partitionsLong: number;  // 5.85m
  electricWiring: boolean;
  heating: boolean;
}

export interface PricingRule {
  // Base price per sqm for Standard
  basePricePerSqm: number;
  
  exteriorPricesPerSqm: Record<ExteriorMaterial, number>;
  interiorPricesPerSqm: Record<InteriorMaterial, number>;
  insulationPricesPerSqm: Record<InsulationType, number>;
  extras: {
    window: Record<WindowSize, number>;
    windowSubstitutionPVC: number;
    door: Record<DoorType, number>;
    doorSubstitutionMetal: number;
    plumbing: Record<PlumbingType, number>;
    partitionShort: number;
    partitionLong: number;
    electricWiringBase: number;
    heatingUnit: number;
  };
}

export interface CalculationResult {
  baseStructureCost: number;
  exteriorCost: number;
  interiorCost: number;
  insulationCost: number;
  windowsCost: number;
  doorsCost: number;
  partitionsCost: number;
  heatingCost: number;
  plumbingCost: number;
  extrasCost: number;
  totalCost: number;
}
