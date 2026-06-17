import type { VercelRequest, VercelResponse } from "@vercel/node";

// ============================================
// Vercel Serverless: Career Mapping API
// 支持 Gemini / OpenAI 多模型
// ============================================

// --- AI Providers ---

interface CareerMappingResult {
  title: string;
  resonance: string;
  cityMatch: { score: number; comment: string };
  mapping: { career: string; marketVibe: string; salaryExpectation: string; actionItem: string };
}

async function callGemini(prompt: string): Promise<CareerMappingResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") throw new Error("No Gemini key");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "lifetrial-server" } } });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text.trim());
}

async function callOpenAI(prompt: string): Promise<CareerMappingResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "MY_OPENAI_API_KEY") throw new Error("No OpenAI key");

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "你是一名顶级的人生职业咨询师与成长治愈系导师。请严格按照用户要求的JSON格式返回结果，不要带任何Markdown标记。" },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });

  if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
  const data = await resp.json();
  return JSON.parse(data.choices[0].message.content.trim());
}

// --- Fallback ---

function generateFallback(tid: string, stats: any): CareerMappingResult {
  const happyNum = Number(stats?.happiness !== undefined ? stats.happiness : 50);
  const peaceNum = Number(stats?.health !== undefined ? stats.health : 50);
  const wealthNum = Number(stats?.growth !== undefined ? stats.growth : 50);

  const defaults: CareerMappingResult = {
    title: "城市自洽探索家",
    resonance: "你做出了极具个性的模拟决策。你在追求物质生活保障的同时，对自我自由和内心的宁静保留了妥帖的边界线，善于在现实与情怀间架起平衡之桥。",
    cityMatch: { score: 80, comment: "在城市大舞台中保持抽离与自守，能让你随时退回自己的温暖小防线。" },
    mapping: {
      career: "生活方式内容策展人 / 创意全栈顾问",
      marketVibe: "大众对机械性单一岗位的依赖性正在下降。具备跨界能力的自洽斜杠人才，将享有极致的自由。",
      salaryExpectation: "约 12k - 24k/月",
      actionItem: "去家楼下的小便利店买一瓶冷泡茶，花10分钟在白纸上勾勒出它的包装，并写下 3 处最让你想吐槽的设计累赘。",
    },
  };

  return defaults;
}

// --- Prompt Builder ---

function buildPrompt(trialId: string, trialTitle: string, choices: any[], reflection: string, finalStats: any): string {
  const choicesSummary = choices
    .map((c: any) => `[${c.time} - ${c.scenario || c.sceneTitle}] 选择了: "${c.selectedOption || c.text}"`)
    .join("\n");

  return `
你是一名顶级的人生职业咨询师与成长治愈系导师。用户在我们的沉浸式人生模拟游戏《人生试玩店》中试玩了人生副本。

【副本基本信息】
- 副本名称：${trialTitle}
- 城市与职业：${trialId}
- 用户主观偏好反射："${reflection || "未填写"}"
- 体验中的决策流：
${choicesSummary}
- 体验结算数值：
  1. 快乐/幸福度: ${finalStats?.happiness || 50}/100
  2. 身体跟心理健康: ${finalStats?.health || 50}/100
  3. 精神压力负荷: ${finalStats?.stress || 50}/100
  4. 职业成长及积累: ${finalStats?.growth || 50}/100

根据以上数据，生成一份极具情感温度、治愈而实用的《人生映射结案报告》。
你必须遵循【人生试玩店】的年轻化、轻游戏风格。切记绝无官腔、大厂黑话或冷冰冰的教条！

返回精确的 JSON 格式（不要带 Markdown 标记）：
{
  "title": "人生试玩称号（15字以内）",
  "resonance": "灵魂共鸣分析（150字以内）",
  "cityMatch": { "score": 85, "comment": "城市契合点评（100字以内）" },
  "mapping": {
    "career": "2-3个现实对应职业",
    "marketVibe": "行业氛围（100字以内）",
    "salaryExpectation": "薪资预期",
    "actionItem": "可行小行动（120字以内）"
  }
}
`;
}

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { trialId, trialTitle, choices, reflection, finalStats } = req.body;
  const prompt = buildPrompt(trialId, trialTitle, choices, reflection, finalStats);
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();

  try {
    let result: CareerMappingResult;
    if (provider === "openai") {
      result = await callOpenAI(prompt);
    } else {
      result = await callGemini(prompt);
    }
    return res.json({ ...result, _provider: provider });
  } catch (err) {
    console.error(`[AI] ${provider} failed, using fallback:`, err);
    return res.json(generateFallback(trialId, finalStats));
  }
}
