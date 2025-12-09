
import React, { useState } from 'react';
import { CabinConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import Calculator from './components/Calculator';
import Summary from './components/Summary';

const App: React.FC = () => {
  const [config, setConfig] = useState<CabinConfig>(DEFAULT_CONFIG);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <h1 className="text-2xl font-bold text-slate-800">
                Конфигуратор <span className="text-primary">КП</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Бытовки и модульные здания под ключ
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator Controls */}
          <div className="lg:col-span-7 space-y-8">
             <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Конфигурация</h2>
                <Calculator config={config} onChange={setConfig} />
             </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-6 space-y-6">
                <Summary config={config} />
            </div>
          </div>
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 СтройБытПро. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
