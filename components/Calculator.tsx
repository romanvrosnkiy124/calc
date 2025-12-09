
import React from 'react';
import { CabinConfig, ExteriorMaterial, InteriorMaterial, InsulationType, WindowSize, WindowItem, DoorType, DoorCategory, DoorItem, PlumbingType, PlumbingItem } from '../types';
import { LABELS, DOOR_CATEGORIES } from '../constants';

interface CalculatorProps {
  config: CabinConfig;
  onChange: (newConfig: CabinConfig) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ config, onChange }) => {
  
  const handleChange = (key: keyof CabinConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  // --- Window List Management ---
  const addWindow = () => {
    const newItem: WindowItem = {
      id: Date.now().toString(),
      size: WindowSize.WOOD_75x85,
      count: 1,
    };
    handleChange('windowList', [...config.windowList, newItem]);
  };

  const removeWindow = (id: string) => {
    handleChange('windowList', config.windowList.filter(item => item.id !== id));
  };

  const updateWindow = (id: string, field: keyof WindowItem, value: any) => {
    const newList = config.windowList.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    handleChange('windowList', newList);
  };

  // --- Door List Management ---
  const addDoor = (category: DoorCategory) => {
    // Default types per category
    const defaultType = category === DoorCategory.EXTERIOR ? DoorType.DVP_EXT : DoorType.DVP_INT;
    
    const newItem: DoorItem = {
      id: Date.now().toString(),
      type: defaultType,
      category: category,
      count: 1,
    };
    handleChange('doorList', [...config.doorList, newItem]);
  };

  const removeDoor = (id: string) => {
    handleChange('doorList', config.doorList.filter(item => item.id !== id));
  };

  const updateDoor = (id: string, field: keyof DoorItem, value: any) => {
    const newList = config.doorList.map(item => {
      if (item.id === id) {
        // If type changes, check if category needs update (though UI enforces category)
        return { ...item, [field]: value };
      }
      return item;
    });
    handleChange('doorList', newList);
  };

  // --- Plumbing List Management ---
  const addPlumbing = () => {
    const newItem: PlumbingItem = {
      id: Date.now().toString(),
      type: PlumbingType.TOILET,
      count: 1,
    };
    handleChange('plumbingList', [...config.plumbingList, newItem]);
  };

  const removePlumbing = (id: string) => {
    handleChange('plumbingList', config.plumbingList.filter(item => item.id !== id));
  };

  const updatePlumbing = (id: string, field: keyof PlumbingItem, value: any) => {
    const newList = config.plumbingList.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    handleChange('plumbingList', newList);
  };


  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-xs mr-2">1</span>
            Габариты
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Длина (м)</label>
            <input
              type="number"
              min="2"
              max="12"
              step="0.5"
              value={config.length}
              onChange={(e) => handleChange('length', parseFloat(e.target.value))}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Ширина (м)</label>
            <input
              type="number"
              min="2"
              max="3"
              step="0.1"
              value={config.width}
              onChange={(e) => handleChange('width', parseFloat(e.target.value))}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Высота (м)</label>
            <input
              type="number"
              min="2.2"
              max="3.2"
              step="0.1"
              value={config.height}
              onChange={(e) => handleChange('height', parseFloat(e.target.value))}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 border p-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-xs mr-2">2</span>
            Отделка
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Внешняя отделка</label>
            <select
              value={config.exterior}
              onChange={(e) => handleChange('exterior', e.target.value as ExteriorMaterial)}
              className="w-full rounded-md border-slate-300 border p-2 bg-slate-50"
            >
              {Object.entries(LABELS.exterior).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Внутренняя отделка</label>
            <select
              value={config.interior}
              onChange={(e) => handleChange('interior', e.target.value as InteriorMaterial)}
              className="w-full rounded-md border-slate-300 border p-2 bg-slate-50"
            >
              {Object.entries(LABELS.interior).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Влияет на стоимость стен и потолка.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Утепление</label>
            <select
              value={config.insulation}
              onChange={(e) => handleChange('insulation', e.target.value as InsulationType)}
              className="w-full rounded-md border-slate-300 border p-2 bg-slate-50"
            >
              {Object.entries(LABELS.insulation).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center text-xs mr-2">3</span>
            Комплектация
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Windows Configuration */}
            <div className="md:col-span-2 p-5 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-base font-bold text-slate-700">Окна</span>
              </div>
              
              <div className="space-y-3">
                {config.windowList.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-3 rounded shadow-sm border border-slate-100">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Тип</label>
                            <select
                                value={item.size}
                                onChange={(e) => updateWindow(item.id, 'size', e.target.value as WindowSize)}
                                className="w-full text-sm rounded border-slate-300 border p-1.5 bg-slate-50 focus:ring-primary focus:border-primary"
                            >
                                {Object.entries(LABELS.windowSize).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end justify-between sm:justify-start gap-3">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Кол-во</label>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => updateWindow(item.id, 'count', Math.max(1, item.count - 1))} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">-</button>
                                    <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                                    <button onClick={() => updateWindow(item.id, 'count', item.count + 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">+</button>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeWindow(item.id)}
                                title="Удалить"
                                className="h-8 w-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {config.windowList.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 italic bg-white/50 rounded border border-dashed border-slate-200">Нет добавленных окон</div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-200/50">
                  <button onClick={addWindow} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Добавить окно
                 </button>
              </div>
            </div>

            {/* Doors Configuration */}
            <div className="md:col-span-2 p-5 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-base font-bold text-slate-700">Двери</span>
              </div>
              
              <div className="space-y-3">
                {config.doorList.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-3 rounded shadow-sm border border-slate-100">
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">
                                    {LABELS.doorCategory[item.category]}
                                </label>
                            </div>
                            <select
                                value={item.type}
                                onChange={(e) => updateDoor(item.id, 'type', e.target.value as DoorType)}
                                className="w-full text-sm rounded border-slate-300 border p-1.5 bg-slate-50 focus:ring-primary focus:border-primary"
                            >
                                {Object.entries(LABELS.doorType)
                                    .filter(([key]) => DOOR_CATEGORIES[key as DoorType] === item.category)
                                    .map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end justify-between sm:justify-start gap-3">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Кол-во</label>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => updateDoor(item.id, 'count', Math.max(1, item.count - 1))} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">-</button>
                                    <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                                    <button onClick={() => updateDoor(item.id, 'count', item.count + 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">+</button>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeDoor(item.id)}
                                title="Удалить"
                                className="h-8 w-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {config.doorList.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 italic bg-white/50 rounded border border-dashed border-slate-200">Нет добавленных дверей</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-200/50">
                     <button onClick={() => addDoor(DoorCategory.EXTERIOR)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Наружная
                     </button>
                     <button onClick={() => addDoor(DoorCategory.INTERIOR)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary hover:bg-orange-50 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Внутренняя
                     </button>
                 </div>
            </div>

            {/* Plumbing Configuration */}
            <div className="md:col-span-2 p-5 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-base font-bold text-slate-700">Сантехника</span>
              </div>
              
              <div className="space-y-3">
                {config.plumbingList.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-3 rounded shadow-sm border border-slate-100">
                        <div className="flex-1">
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Тип</label>
                            <select
                                value={item.type}
                                onChange={(e) => updatePlumbing(item.id, 'type', e.target.value as PlumbingType)}
                                className="w-full text-sm rounded border-slate-300 border p-1.5 bg-slate-50 focus:ring-primary focus:border-primary"
                            >
                                {Object.entries(LABELS.plumbing).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end justify-between sm:justify-start gap-3">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Кол-во</label>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => updatePlumbing(item.id, 'count', Math.max(1, item.count - 1))} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">-</button>
                                    <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                                    <button onClick={() => updatePlumbing(item.id, 'count', item.count + 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">+</button>
                                </div>
                            </div>
                            <button 
                                onClick={() => removePlumbing(item.id)}
                                title="Удалить"
                                className="h-8 w-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                {config.plumbingList.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 italic bg-white/50 rounded border border-dashed border-slate-200">Нет сантехники</div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/50">
                 <button onClick={addPlumbing} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Добавить сантехнику
                 </button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-white space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 font-medium">Перегородка (2.45м)</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleChange('partitionsShort', Math.max(0, config.partitionsShort - 1))} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">-</button>
                        <span className="text-sm font-bold w-6 text-center">{config.partitionsShort}</span>
                        <button onClick={() => handleChange('partitionsShort', config.partitionsShort + 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">+</button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 font-medium">Перегородка (5.85м)</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleChange('partitionsLong', Math.max(0, config.partitionsLong - 1))} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">-</button>
                        <span className="text-sm font-bold w-6 text-center">{config.partitionsLong}</span>
                        <button onClick={() => handleChange('partitionsLong', config.partitionsLong + 1)} className="w-8 h-8 flex items-center justify-center border rounded bg-slate-50 text-slate-600 font-bold hover:bg-slate-100">+</button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <input type="checkbox" checked={config.electricWiring} onChange={(e) => handleChange('electricWiring', e.target.checked)} className="rounded text-primary focus:ring-primary mr-3 h-5 w-5" />
                    <span className="text-sm text-slate-700 font-medium">Электрика (под ключ)</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <input type="checkbox" checked={config.heating} onChange={(e) => handleChange('heating', e.target.checked)} className="rounded text-primary focus:ring-primary mr-3 h-5 w-5" />
                    <span className="text-sm text-slate-700 font-medium">Конвектор (Обогрев)</span>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
