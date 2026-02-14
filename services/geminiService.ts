
import { GoogleGenAI, Type } from "@google/genai";
import { CyclePhase, UserCycleData } from "../types";

const SYSTEM_INSTRUCTION = `
你是一位精通女性内分泌学与运动营养学的 AI 私教。
你的任务是根据用户录入的生理周期数据，提供定制化的“周期同步减脂”方案。
你需要结合雌激素、孕激素的变化，调整饮食比例（碳水/蛋白质/脂肪）和运动强度（高强度间歇/力量训练/瑜伽）。
你的回答必须基于科学事实，同时语调亲切、专业且具有鼓励性。
`;

export const getCoachAdvice = async (
  phase: CyclePhase,
  dayInCycle: number,
  userData: UserCycleData
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
  用户当前处于周期第 ${dayInCycle} 天，属于 ${phase} 阶段（平均周期 ${userData.cycleLength} 天）。
  
  请基于此提供详细的减脂方案。返回内容必须包括：
  1. 当前激素环境对身体的影响（简单解释）。
  2. 具体的饮食建议：
     - 碳水、蛋白质、脂肪的比例。
     - 推荐的特定食物清单。
  3. 具体的运动建议：
     - 训练类型、强度、时长。
     - 具体的训练计划（如：周一HIIT，周二休息）。
  4. 针对此阶段减脂心态的专业指导。
  
  请使用中文回答，并使用清晰的 Markdown 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
