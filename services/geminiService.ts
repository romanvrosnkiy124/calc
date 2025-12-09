
import { GoogleGenAI, Chat } from "@google/genai";
import { CabinConfig, ExteriorMaterial, InteriorMaterial, InsulationType } from "../types";
import { LABELS } from "../constants";

const getSystemInstruction = (config: CabinConfig) => {
  const windowDesc = config.windowList
    .map(w => `${w.count}шт (${LABELS.windowSize[w.size]})`)
    .join(', ') || 'Нет';

  const doorDesc = config.doorList
    .map(d => `${d.count}шт (${LABELS.doorType[d.type]})`)
    .join(', ') || 'Нет';
    
  const plumbingDesc = config.plumbingList
    .map(p => `${p.count}шт (${LABELS.plumbing[p.type]})`)
    .join(', ') || 'Нет';

  const partitionsDesc = [];
  if (config.partitionsShort > 0) partitionsDesc.push(`${config.partitionsShort} шт (2.45м)`);
  if (config.partitionsLong > 0) partitionsDesc.push(`${config.partitionsLong} шт (5.85м)`);
  const partitionsText = partitionsDesc.join(', ') || 'Нет';

  return `
    Вы — опытный консультант строительной компании "СтройБытПро", специализирующийся на модульных зданиях и бытовках.
    
    Ваша задача:
    1. Помогать клиенту выбирать материалы и комплектацию.
    2. Объяснять разницу между типами утепления и отделки.
    3. Давать рекомендации на основе текущей конфигурации пользователя.
    
    Текущая конфигурация пользователя:
    - Размер: ${config.length} x ${config.width} x ${config.height} м
    - Внешняя отделка: ${LABELS.exterior[config.exterior]}
    - Внутренняя отделка: ${LABELS.interior[config.interior]}
    - Утепление: ${LABELS.insulation[config.insulation]}
    - Окна: ${windowDesc}
    - Двери: ${doorDesc}
    - Сантехника: ${plumbingDesc}
    - Перегородки: ${partitionsText}
    - Электрика: ${config.electricWiring ? 'Да' : 'Нет'}
    - Отопление: ${config.heating ? 'Да' : 'Нет'}
    
    Цены:
    - Это калькулятор, точные цены рассчитываются автоматически. Вы можете говорить о *соотношении* цен (например, "Сэндвич-панели дороже, но теплее"), но не называйте точных сумм, если вас не спросили про конкретные артикулы (которых вы не знаете).
    
    Стиль общения: Дружелюбный, профессиональный, краткий. Используйте emoji 🏗️🏠.
    Отвечайте на русском языке.
  `;
};

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

export const initializeChat = (config: CabinConfig) => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY missing");
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  chatSession = aiClient.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: getSystemInstruction(config),
      temperature: 0.7,
    }
  });

  return chatSession;
};

export const sendMessageToGemini = async function* (message: string, currentConfig: CabinConfig) {
  if (!chatSession) {
    initializeChat(currentConfig);
  }

  if (!chatSession) {
      yield "Ошибка: API ключ не найден.";
      return;
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    yield "Извините, произошла ошибка соединения с консультантом.";
  }
};
