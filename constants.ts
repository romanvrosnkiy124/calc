

import { CabinConfig, ExteriorMaterial, InteriorMaterial, InsulationType, PricingRule, WindowSize, DoorType, DoorCategory, PlumbingType } from './types';

export const DEFAULT_CONFIG: CabinConfig = {
  length: 5.85,
  width: 2.45,
  height: 2.45,
  exterior: ExteriorMaterial.METAL_SIDING,
  interior: InteriorMaterial.DVPO,
  insulation: InsulationType.MINERAL_WOOL_50,
  windowList: [
    { id: '1', size: WindowSize.WOOD_75x85, count: 1 }
  ],
  doorList: [
    { id: '1', type: DoorType.DVP_EXT, category: DoorCategory.EXTERIOR, count: 1 }
  ],
  plumbingList: [],
  partitionsShort: 0,
  partitionsLong: 0,
  electricWiring: true,
  heating: false,
};

// Pricing Logic:
// STANDARD Base: 162,000 RUB. Dimensions 5.85 * 2.45 = 14.3325 m2.

const DEFAULT_AREA = 5.85 * 2.45;
export const BASE_HEIGHT = 2.45;

export const INCLUDED_OPTIONS = {
    windowSize: WindowSize.WOOD_75x85,
    doorType: DoorType.DVP_EXT,
    interior: InteriorMaterial.DVPO,
    exterior: ExteriorMaterial.METAL_SIDING,
};

export const DOOR_CATEGORIES: Record<DoorType, DoorCategory> = {
    [DoorType.DVP_EXT]: DoorCategory.EXTERIOR,
    [DoorType.METAL_RF]: DoorCategory.EXTERIOR,
    [DoorType.PVC_EXT]: DoorCategory.INTERIOR, // Reverted to INTERIOR
    [DoorType.DVP_INT]: DoorCategory.INTERIOR,
    [DoorType.WOOD_INT]: DoorCategory.INTERIOR,
};

export const PRICING: PricingRule = {
  basePricePerSqm: 162000 / DEFAULT_AREA,
  exteriorPricesPerSqm: {
    [ExteriorMaterial.METAL_SIDING]: 0, // Включено в базу
    [ExteriorMaterial.GALVANIZED]: 16500 / DEFAULT_AREA,
  },
  interiorPricesPerSqm: {
    [InteriorMaterial.DVPO]: 0, // Включено в базу
    [InteriorMaterial.OSB]: 2190,
    [InteriorMaterial.WOODEN_LINING]: 2640,
    [InteriorMaterial.PVC_PANELS]: 1430,
    // Цена 20000 за всю бытовку 5.85x2.45
    [InteriorMaterial.MDF_PVC]: 20000 / DEFAULT_AREA, 
  },
  insulationPricesPerSqm: {
    [InsulationType.NONE]: 0,
    [InsulationType.MINERAL_WOOL_50]: 0, // Включено в базу
    [InsulationType.MINERAL_WOOL_100]: 16000 / DEFAULT_AREA,
  },
  extras: {
    window: {
      [WindowSize.PVC_50x50]: 8100,
      [WindowSize.PVC_80x100]: 8534,
      [WindowSize.PVC_80x100_TILT]: 10438,
      [WindowSize.WOOD_90x110]: 5250,
      [WindowSize.WOOD_75x85]: 4200, 
      [WindowSize.PVC_100x85]: 9500, 
    },
    windowSubstitutionPVC: 8500,
    door: {
      [DoorType.DVP_EXT]: 7472,
      [DoorType.METAL_RF]: 29400, 
      [DoorType.PVC_EXT]: 44482,
      [DoorType.DVP_INT]: 5150,
      [DoorType.WOOD_INT]: 9596,
    },
    doorSubstitutionMetal: 25800,
    plumbing: {
        [PlumbingType.TOILET]: 14500,
        [PlumbingType.SINK]: 8500,
        [PlumbingType.SHOWER_TRAY]: 18000,
        [PlumbingType.SHOWER_CABIN]: 32000,
        [PlumbingType.WATER_HEATER_30]: 16500,
        [PlumbingType.WATER_HEATER_50]: 18500,
        [PlumbingType.WATER_HEATER_80]: 21500,
        [PlumbingType.WATER_HEATER_100]: 24500,
        [PlumbingType.SEWERAGE_OUT]: 4500
    },
    partitionShort: 4300, // 2.45m
    partitionLong: 7300,  // 5.85m
    electricWiringBase: 8000,
    heatingUnit: 5250,
  },
};

export const LABELS = {
  exterior: {
    [ExteriorMaterial.METAL_SIDING]: 'Профлист С8 (Стандарт)',
    [ExteriorMaterial.GALVANIZED]: 'Профлист, RAL на выбор',
  },
  interior: {
    [InteriorMaterial.DVPO]: 'ДВП/Оргалит (База)',
    [InteriorMaterial.OSB]: 'OSB плита',
    [InteriorMaterial.WOODEN_LINING]: 'Вагонка деревянная',
    [InteriorMaterial.PVC_PANELS]: 'ПВХ панели (Влагостойкие)',
    [InteriorMaterial.MDF_PVC]: 'МДФ стены, потолок ПВХ (вместо ДВП)',
  },
  insulation: {
    [InsulationType.NONE]: 'Без утепления',
    [InsulationType.MINERAL_WOOL_50]: 'Минвата 50мм (База)',
    [InsulationType.MINERAL_WOOL_100]: 'Минвата 100мм (Зима)',
  },
  windowSize: {
    [WindowSize.WOOD_75x85]: 'Деревянное 75х85 см (База)',
    [WindowSize.PVC_100x85]: 'ПВХ 100х85 см',
    [WindowSize.PVC_50x50]: 'ПВХ 50х50 см (Поворотное)',
    [WindowSize.PVC_80x100]: 'ПВХ 80х100 см (Поворотное)',
    [WindowSize.PVC_80x100_TILT]: 'ПВХ 80х100 см (Пов/Откидное)',
    [WindowSize.WOOD_90x110]: 'Деревянное 90х110 см',
  },
  doorType: {
    [DoorType.DVP_EXT]: 'Дверь ДВП (Обшита листом)',
    [DoorType.METAL_RF]: 'Металлическая (РФ) утепленная',
    [DoorType.PVC_EXT]: 'ПВХ дверь (со стеклом)', 
    [DoorType.DVP_INT]: 'Дверь ДВП (Внутренняя)',
    [DoorType.WOOD_INT]: 'Дверь Филенчатая (Дерево)',
  },
  doorCategory: {
    [DoorCategory.EXTERIOR]: 'Наружные',
    [DoorCategory.INTERIOR]: 'Внутренние',
  },
  plumbing: {
    [PlumbingType.TOILET]: 'Унитаз (керамика, бачок)',
    [PlumbingType.SINK]: 'Раковина (смеситель, тумба)',
    [PlumbingType.SHOWER_TRAY]: 'Душевой поддон (эмаль, шторка)',
    [PlumbingType.SHOWER_CABIN]: 'Душевая кабина (уголок)',
    [PlumbingType.WATER_HEATER_30]: 'Бойлер 30л (накопительный)',
    [PlumbingType.WATER_HEATER_50]: 'Бойлер 50л (накопительный)',
    [PlumbingType.WATER_HEATER_80]: 'Бойлер 80л (накопительный)',
    [PlumbingType.WATER_HEATER_100]: 'Бойлер 100л (накопительный)',
    [PlumbingType.SEWERAGE_OUT]: 'Вывод канализации (труба)',
  }
};