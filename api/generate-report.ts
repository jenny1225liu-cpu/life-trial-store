import type { VercelRequest, VercelResponse } from "@vercel/node";

// ============================================
// Vercel Serverless: Generate Report API
// 支持 Gemini / OpenAI 多模型
// ============================================

// --- Types ---

interface DimensionAnalysis {
  score: number;
  analysis: string;
}

interface RecommendedJob {
  name: string;
  matchScore: number;
  reason: string;
  salary: string;
}

interface ActionItem {
  text: string;
  timeline: string;
  category: string;
}

interface ReportResult {
  userSummary: string;
  dimensionAnalysis: {
    freedom: DimensionAnalysis;
    connection: DimensionAnalysis;
    wealth: DimensionAnalysis;
    peace: DimensionAnalysis;
  };
  recommendedJobs: RecommendedJob[];
  actionItems: ActionItem[];
  overallAdvice: string;
}

// --- AI Providers ---

async function callGemini(prompt: string): Promise<ReportResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") throw new Error("No Gemini key");

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "lifetrial-server" } } });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return parseReportResponse(response.text.trim());
}

async function callOpenAI(prompt: string): Promise<ReportResult> {
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
  return parseReportResponse(data.choices[0].message.content.trim());
}

// --- Response Parser ---

function parseReportResponse(text: string): ReportResult {
  const parsed = JSON.parse(text);
  const parseDimension = (d: any): DimensionAnalysis => ({
    score: Number(d?.score) || 50,
    analysis: d?.analysis || "",
  });

  return {
    userSummary: parsed.userSummary || "",
    dimensionAnalysis: {
      freedom: parseDimension(parsed.dimensionAnalysis?.freedom),
      connection: parseDimension(parsed.dimensionAnalysis?.connection),
      wealth: parseDimension(parsed.dimensionAnalysis?.wealth),
      peace: parseDimension(parsed.dimensionAnalysis?.peace),
    },
    recommendedJobs: Array.isArray(parsed.recommendedJobs)
      ? parsed.recommendedJobs.map((j: any) => ({
          name: j.name || "",
          matchScore: Number(j.matchScore) || 50,
          reason: j.reason || "",
          salary: j.salary || "",
        }))
      : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((a: any) => ({
          text: a.text || "",
          timeline: a.timeline || "",
          category: a.category || "explore",
        }))
      : [],
    overallAdvice: parsed.overallAdvice || "",
  };
}

// --- Fallback ---

function generateFallbackReport(profile: any, trialResults: any[], favoriteJobs: string[]): ReportResult {
  const freedomWeight = profile?.dimensionWeights?.freedom ?? 50;
  const connectionWeight = profile?.dimensionWeights?.connection ?? 50;
  const wealthWeight = profile?.dimensionWeights?.wealth ?? 50;
  const peaceWeight = profile?.dimensionWeights?.peace ?? 50;

  let freedomScore = freedomWeight, connectionScore = connectionWeight, wealthScore = wealthWeight, peaceScore = peaceWeight;
  if (trialResults.length > 0) {
    const avg = (key: string) => {
      const vals = trialResults.map((t: any) => t.finalStats?.[key] ?? 50);
      return Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length);
    };
    freedomScore = avg("freedom") || avg("happiness") || freedomWeight;
    connectionScore = avg("connection") || connectionWeight;
    wealthScore = avg("wealth") || avg("growth") || wealthWeight;
    peaceScore = avg("peace") || avg("health") || peaceWeight;
  }

  return {
    userSummary: "你是一个追求自由与平衡的人。在试玩中，你展现了清晰的自我认知和独立的判断力，善于在现实与理想之间找到属于自己的节奏。",
    dimensionAnalysis: {
      freedom: { score: freedomScore, analysis: "你对自由有强烈的渴望，不愿被规则和框架束缚" },
      connection: { score: connectionScore, analysis: "你重视与人的深度连接，但不依赖社交获取认同" },
      wealth: { score: wealthScore, analysis: "你对财富有务实的态度，把它看作自由的工具" },
      peace: { score: peaceScore, analysis: "你追求内心的安宁，比外在成就更在意内在满足" },
    },
    recommendedJobs: [
      { name: "产品经理", matchScore: 88, reason: "你的综合能力适合在产品领域发挥，兼顾创意与逻辑", salary: "15k-35k" },
      { name: "用户体验设计师", matchScore: 82, reason: "你的共情力和审美感能让你创造出打动人心的体验", salary: "12k-28k" },
      { name: "内容策略师", matchScore: 75, reason: "你的洞察力和表达力适合用内容影响和帮助更多人", salary: "10k-25k" },
    ],
    actionItems: [
      { text: "找一个你最常用的App，写下3个你觉得可以改进的地方", timeline: "今天", category: "explore" },
      { text: "花30分钟了解一个你从未接触过的职业领域", timeline: "本周", category: "learn" },
      { text: "找一位从事你感兴趣职业的人聊15分钟，了解真实的工作日常", timeline: "本月", category: "practice" },
    ],
    overallAdvice: "你拥有难得的平衡感——既能看清现实，又没放弃理想。接下来的关键是把这种平衡力变成行动力：别想太多，先做起来。每一步真实的体验，都比十次完美的想象更有价值。",
  };
}

// --- Prompt Builder ---

function buildReportPrompt(profile: any, trialResults: any[], favoriteJobs: string[]): string {
  const profileSection = `
【用户档案】
- 学校：${profile?.school || "未填写"}
- 专业：${profile?.major || "未填写"}
- 城市偏好：${profile?.cityPreference || "未填写"}
- 维度权重：自由 ${profile?.dimensionWeights?.freedom ?? 50}、连接 ${profile?.dimensionWeights?.connection ?? 50}、财富 ${profile?.dimensionWeights?.wealth ?? 50}、平和 ${profile?.dimensionWeights?.peace ?? 50}`;

  const trialsSection = trialResults.length > 0
    ? trialResults.map((t: any, i: number) => `
【试玩 ${i + 1}】${t.trialTitle} (${t.trialId})
- 结算数值：自由 ${t.finalStats?.freedom ?? t.finalStats?.happiness ?? 50}、连接 ${t.finalStats?.connection ?? 50}、财富 ${t.finalStats?.wealth ?? t.finalStats?.growth ?? 50}、平和 ${t.finalStats?.peace ?? t.finalStats?.health ?? 50}
- 用户感受："${t.reflection || "未填写"}"`).join("\n")
    : "（暂无试玩记录）";

  const favJobsSection = favoriteJobs.length > 0
    ? favoriteJobs.map((j: string, i: number) => `${i + 1}. ${j}`).join("\n")
    : "（暂无收藏岗位）";

  return `
你是一名顶级的人生职业咨询师与成长治愈系导师。用户在我们的沉浸式人生模拟游戏《人生试玩店》中完成了多次人生试玩，现在需要生成一份综合职业决策报告。

${profileSection}

【试玩结果】
${trialsSection}

【收藏的岗位】
${favJobsSection}

根据以上所有数据，生成一份极具情感温度、治愈而实用的《职业决策报告》。
你必须遵循【人生试玩店】的年轻化、轻游戏、Netflix/Duolingo/Forest式温暖风格。切记绝无官腔、大厂黑话或冷冰冰的教条！字词要像和老朋友聊天，充满生活细节与奇妙想象。

返回一个精确的 JSON 格式响应（不要带任何 Markdown \`\`\`json 标记，直接返回 JSON 串即可）。
JSON 结构如下：
{
  "userSummary": "基于用户档案和试玩行为的画像分析，150字以内，温暖有洞察",
  "dimensionAnalysis": {
    "freedom": { "score": 75, "analysis": "你对自由的追求分析，60字以内" },
    "connection": { "score": 70, "analysis": "你对人际连接的需求分析，60字以内" },
    "wealth": { "score": 65, "analysis": "你对物质财富的态度分析，60字以内" },
    "peace": { "score": 80, "analysis": "你对内心平和的看重程度分析，60字以内" }
  },
  "recommendedJobs": [
    { "name": "产品经理", "matchScore": 92, "reason": "推荐理由，80字以内", "salary": "15k-35k" },
    { "name": "第二个推荐职业", "matchScore": 85, "reason": "推荐理由", "salary": "薪资范围" },
    { "name": "第三个推荐职业", "matchScore": 78, "reason": "推荐理由", "salary": "薪资范围" }
  ],
  "actionItems": [
    { "text": "一个今天就可以做的小行动，游戏化、有体验感", "timeline": "今天", "category": "explore" },
    { "text": "本周可以尝试的探索行动", "timeline": "本周", "category": "learn" },
    { "text": "本月可以推进的实践行动", "timeline": "本月", "category": "practice" }
  ],
  "overallAdvice": "综合职业建议，150字以内，温暖治愈且有实操性"
}

注意：
- dimensionAnalysis 的 score 必须是 0-100 的整数，基于用户的维度权重和试玩结果综合计算
- recommendedJobs 至少 3 个，matchScore 是 0-100 的整数
- actionItems 的 category 只能是 "explore"（探索）、"learn"（学习）、"practice"（实践）之一
- 如果用户收藏了岗位，推荐职业要优先参考收藏岗位的方向
`;
}

// --- Handler ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { profile, trialResults, favoriteJobs, _forceFallback } = req.body;

  if (_forceFallback) {
    return res.json(generateFallbackReport(profile, trialResults || [], favoriteJobs || []));
  }

  const prompt = buildReportPrompt(profile, trialResults || [], favoriteJobs || []);
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();

  try {
    let result: ReportResult;
    if (provider === "openai") {
      result = await callOpenAI(prompt);
    } else {
      result = await callGemini(prompt);
    }
    return res.json({ ...result, _provider: provider });
  } catch (err) {
    console.error(`[AI] ${provider} failed, using fallback:`, err);
    return res.json(generateFallbackReport(profile, trialResults || [], favoriteJobs || []));
  }
}
