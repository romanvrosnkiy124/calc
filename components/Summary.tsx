
import React, { useMemo } from 'react';
import { CabinConfig, CalculationResult, DoorType } from '../types';
import { PRICING, LABELS, INCLUDED_OPTIONS, BASE_HEIGHT } from '../constants';

interface SummaryProps {
  config: CabinConfig;
}

const Summary: React.FC<SummaryProps> = ({ config }) => {
  const result: CalculationResult = useMemo(() => {
    const area = config.length * config.width;
    
    // Base cost calculation with Height multiplier
    // Price scales proportionally with height relative to BASE_HEIGHT (2.45m)
    const heightMultiplier = config.height / BASE_HEIGHT;
    // Base structure now does not include exterior multiplier (it is 0 or additive)
    const baseStructureCost = (area * PRICING.basePricePerSqm) * heightMultiplier;
    
    const exteriorCost = area * (PRICING.exteriorPricesPerSqm[config.exterior] || 0);
    const interiorCost = area * PRICING.interiorPricesPerSqm[config.interior];
    const insulationCost = area * PRICING.insulationPricesPerSqm[config.insulation];
    
    // Windows Calculation with Substitution Logic
    const includedWindowType = INCLUDED_OPTIONS.windowSize;
    let windowsCost = 0;
    
    // Calculate totals to determine if we are substituting
    const windowCounts: Record<string, number> = {};
    config.windowList.forEach(w => {
        windowCounts[w.size] = (windowCounts[w.size] || 0) + w.count;
    });
    const hasIncludedWindow = (windowCounts[includedWindowType] || 0) > 0;

    let includedDeducted = false;
    let substitutionApplied = false;

    for (const item of config.windowList) {
        const isPVC = item.size.startsWith('PVC');

        for (let i = 0; i < item.count; i++) {
             let unitPrice = PRICING.extras.window[item.size];
             
             if (item.size === includedWindowType && !includedDeducted) {
                 // Free included window
                 unitPrice = 0;
                 includedDeducted = true;
             } else if (isPVC && !hasIncludedWindow && !substitutionApplied) {
                 // Substitution price for first PVC window if no included windows exist
                 unitPrice = PRICING.extras.windowSubstitutionPVC;
                 substitutionApplied = true;
             }
             windowsCost += unitPrice;
        }
    }

    // Doors Calculation logic with substitution
    const includedDoorType = INCLUDED_OPTIONS.doorType;
    let doorsCost = 0;
    
    // Calculate totals to determine if we are substituting
    const doorCounts: Record<string, number> = {};
    config.doorList.forEach(d => {
        doorCounts[d.type] = (doorCounts[d.type] || 0) + d.count;
    });
    
    const hasIncludedDoor = (doorCounts[includedDoorType] || 0) > 0;
    
    let doorIncludedDeducted = false;
    let doorSubstitutionApplied = false;

    for (const item of config.doorList) {
        // Process item count
        // We use a loop to handle items one by one in case a single row has multiple items that need split logic
        for(let i=0; i<item.count; i++) {
             let unitPrice = PRICING.extras.door[item.type];
             
             if (item.type === includedDoorType && !doorIncludedDeducted) {
                 // Free included door
                 unitPrice = 0; 
                 doorIncludedDeducted = true;
             } else if (item.type === DoorType.METAL_RF && !hasIncludedDoor && !doorSubstitutionApplied) {
                 // Substitution price for first metal door if no included doors exist
                 unitPrice = PRICING.extras.doorSubstitutionMetal;
                 doorSubstitutionApplied = true;
             }
             // else use full unitPrice
             doorsCost += unitPrice;
        }
    }

    // Plumbing Calculation
    let plumbingCost = 0;
    config.plumbingList.forEach(item => {
        plumbingCost += item.count * PRICING.extras.plumbing[item.type];
    });

    // Partitions
    const partitionsShortCost = config.partitionsShort * PRICING.extras.partitionShort;
    const partitionsLongCost = config.partitionsLong * PRICING.extras.partitionLong;
    const partitionsCost = partitionsShortCost + partitionsLongCost;

    // Heating
    const heatingCost = config.heating ? PRICING.extras.heatingUnit : 0;

    // Electric Wiring is included in base price for Standard
    const wiringCost = 0;

    const extrasCost = wiringCost;

    return {
      baseStructureCost,
      exteriorCost,
      interiorCost,
      insulationCost,
      windowsCost,
      doorsCost,
      partitionsCost,
      heatingCost,
      plumbingCost,
      extrasCost,
      totalCost: baseStructureCost + exteriorCost + interiorCost + insulationCost + windowsCost + doorsCost + partitionsCost + heatingCost + plumbingCost + extrasCost
    };
  }, [config]);

  // Breakdown helpers for display
  const windowBreakdown = useMemo(() => {
    const includedType = INCLUDED_OPTIONS.windowSize;
    
    // Recalculate context for breakdown
    const windowCounts: Record<string, number> = {};
    config.windowList.forEach(d => {
        windowCounts[d.size] = (windowCounts[d.size] || 0) + d.count;
    });
    const hasIncludedWindow = (windowCounts[includedType] || 0) > 0;

    let includedDeducted = false;
    let substitutionApplied = false;
    
    return config.windowList.map(item => {
        const fullUnitPrice = PRICING.extras.window[item.size];
        let totalItemCost = 0;
        let notes: string[] = [];
        const isPVC = item.size.startsWith('PVC');

        for(let i=0; i<item.count; i++) {
            let price = fullUnitPrice;

            if (item.size === includedType && !includedDeducted) {
                price = 0;
                notes.push('Включено');
                includedDeducted = true;
            } else if (isPVC && !hasIncludedWindow && !substitutionApplied) {
                price = PRICING.extras.windowSubstitutionPVC;
                notes.push('Замена базовой');
                substitutionApplied = true;
            }
            
            totalItemCost += price;
        }
        
        // Format note
        let note = '';
        if (notes.includes('Включено')) {
             note = notes.length === item.count ? '(Включено)' : '(1 шт. включена)';
        } else if (notes.includes('Замена базовой')) {
             note = '(Замена базовой)';
        }
        
        return { ...item, totalItemCost, note };
    });
  }, [config.windowList]);

  const doorBreakdown = useMemo(() => {
    const includedType = INCLUDED_OPTIONS.doorType;
    
    // Recalculate context for breakdown display
    const doorCounts: Record<string, number> = {};
    config.doorList.forEach(d => {
        doorCounts[d.type] = (doorCounts[d.type] || 0) + d.count;
    });
    const hasIncludedDoor = (doorCounts[includedType] || 0) > 0;

    let includedDeducted = false;
    let substitutionApplied = false;

    return config.doorList.map(item => {
        const fullUnitPrice = PRICING.extras.door[item.type];
        let totalItemCost = 0;
        let notes: string[] = [];

        // Calculate cost per item in the stack
        for(let i=0; i<item.count; i++) {
            let price = fullUnitPrice;
            
            if (item.type === includedType && !includedDeducted) {
                price = 0;
                notes.push('Включено');
                includedDeducted = true;
            } else if (item.type === DoorType.METAL_RF && !hasIncludedDoor && !substitutionApplied) {
                price = PRICING.extras.doorSubstitutionMetal;
                notes.push('Замена базовой');
                substitutionApplied = true;
            }
            
            totalItemCost += price;
        }

        // Format note
        let note = '';
        if (notes.includes('Включено')) {
             note = notes.length === item.count ? '(Включено)' : '(1 шт. включена)';
        } else if (notes.includes('Замена базовой')) {
             note = '(Замена базовой)';
        }

        return { ...item, totalItemCost, note };
    });
  }, [config.doorList]);


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
  };

  const renderPrice = (price: number, isIncluded: boolean = false) => {
    if (price === 0 || isIncluded) return <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-1 rounded">Включено</span>;
    return <span className="font-medium text-slate-700">{formatPrice(price)}</span>;
  };

  const getTotalWindowsCount = () => config.windowList.reduce((acc, i) => acc + i.count, 0);
  const getTotalDoorsCount = () => config.doorList.reduce((acc, i) => acc + i.count, 0);
  const getTotalPlumbingCount = () => config.plumbingList.reduce((acc, i) => acc + i.count, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Итоговая смета</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Каркас (база)</span>
            {renderPrice(result.baseStructureCost)}
        </div>
        
        {/* Exterior Cost - Show if not included/zero */}
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Внешняя отделка ({LABELS.exterior[config.exterior]})</span>
            {renderPrice(result.exteriorCost)}
        </div>

        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Внутренняя отделка ({LABELS.interior[config.interior]})</span>
            {renderPrice(result.interiorCost)}
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Утепление</span>
            {renderPrice(result.insulationCost)}
        </div>
        
        <div className="border-t border-slate-100 my-2 pt-2"></div>
        
        {/* Windows */}
        <div className="mb-2">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-500 font-semibold">Окна ({getTotalWindowsCount()})</span>
            </div>
            <div className="space-y-1">
                {windowBreakdown.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-xs text-slate-600 pl-2">
                        <span className="max-w-[70%]">
                            {item.count}x {LABELS.windowSize[item.size]} {item.note && <span className="text-green-600 font-medium">{item.note}</span>}
                        </span>
                        <span>{renderPrice(item.totalItemCost)}</span>
                    </div>
                ))}
                 {config.windowList.length === 0 && <div className="text-xs text-slate-400 italic pl-2">Нет окон</div>}
            </div>
        </div>

        {/* Doors */}
        <div className="mb-2">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-slate-500 font-semibold">Двери ({getTotalDoorsCount()})</span>
            </div>
            <div className="space-y-1">
                {doorBreakdown.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-xs text-slate-600 pl-2">
                        <span className="max-w-[70%]">
                            {item.count}x {LABELS.doorType[item.type]} {item.note && <span className="text-green-600 font-medium">{item.note}</span>}
                        </span>
                        <span>{renderPrice(item.totalItemCost)}</span>
                    </div>
                ))}
                 {config.doorList.length === 0 && <div className="text-xs text-slate-400 italic pl-2">Нет дверей</div>}
            </div>
        </div>

        {/* Plumbing */}
        <div className="mb-2">
             {config.plumbingList.length > 0 && (
                <>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-slate-500 font-semibold">Сантехника ({getTotalPlumbingCount()})</span>
                    </div>
                    <div className="space-y-1">
                        {config.plumbingList.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-xs text-slate-600 pl-2">
                                <span className="max-w-[70%]">
                                    {item.count}x {LABELS.plumbing[item.type]}
                                </span>
                                <span>{renderPrice(item.count * PRICING.extras.plumbing[item.type])}</span>
                            </div>
                        ))}
                    </div>
                </>
             )}
        </div>

        <div className="border-t border-slate-100 my-2 pt-2"></div>

        <div className="mb-2 space-y-2">
            {config.partitionsShort > 0 && (
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Перегородка (2.45м) - {config.partitionsShort} шт</span>
                    {renderPrice(config.partitionsShort * PRICING.extras.partitionShort)}
                </div>
            )}
            {config.partitionsLong > 0 && (
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Перегородка (5.85м) - {config.partitionsLong} шт</span>
                    {renderPrice(config.partitionsLong * PRICING.extras.partitionLong)}
                </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Электрика (под ключ)</span>
                {config.electricWiring ? renderPrice(0, true) : <span className="text-slate-400 text-xs">Не выбрано</span>}
            </div>

            {config.heating && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Конвектор (Обогрев)</span>
                    {renderPrice(result.heatingCost)}
                </div>
            )}
        </div>

      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-end">
            <span className="text-slate-600 font-bold">ИТОГО:</span>
            <span className="text-3xl font-extrabold text-primary">{formatPrice(result.totalCost)}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-right">*Цена ориентировочная и не является офертой</p>
      </div>

      <button className="w-full mt-6 bg-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md transform active:scale-95">
        Оформить заявку
      </button>
    </div>
  );
};

export default Summary;
