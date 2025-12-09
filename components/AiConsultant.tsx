import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { CabinConfig } from '../types';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AiConsultantProps {
  currentConfig: CabinConfig;
}

const AiConsultant: React.FC<AiConsultantProps> = ({ currentConfig }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Здравствуйте! Я ИИ-консультант. Подсказать что-то по материалам или комплектации? 🏗️' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        const stream = sendMessageToGemini(userMsg, currentConfig);
        let fullResponse = "";
        
        // Add a placeholder for the AI response
        setMessages(prev => [...prev, { role: 'ai', text: '...' }]);

        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1] = { role: 'ai', text: fullResponse };
                return newArr;
            });
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Произошла ошибка связи.' }]);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[400px]">
      <div className="bg-slate-800 p-3 flex justify-between items-center">
        <h3 className="text-white font-semibold flex items-center gap-2">
            🤖 Онлайн-Консультант
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Gemini AI</span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t bg-slate-50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Спросите про утепление, материалы..."
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default AiConsultant;