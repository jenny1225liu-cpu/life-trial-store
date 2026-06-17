/**
 * 人生试玩店 - 后端 API 客户端
 * 优先调用 Supabase API，localStorage 作为离线 fallback
 */

import { SavedResult, ChoiceRecord, CustomTrial } from "./types";

const API_BASE = "/api";

// ============================================
// 类型定义
// ============================================
export interface SaveResultResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface GetResultsResponse {
  data: any[];
  count: number;
}

export interface LeaderboardEntry {
  id: string;
  trial_id: string;
  trial_title: string;
  city: string;
  career_title: string;
  city_match_score: number;
  happiness: number;
  health: number;
  stress: number;
  growth: number;
  created_at: string;
}

export interface TrialStat {
  trial_id: string;
  play_count: number;
  last_played_at: string;
  avg_happiness: number;
  avg_health: number;
  avg_stress: number;
  avg_growth: number;
  avg_city_match_score: number;
}

// ============================================
// API 调用函数
// ============================================

/**
 * 保存试玩结果到后端 Supabase
 */
export async function saveResultToServer(
  result: SavedResult,
  choices: ChoiceRecord[],
  aiProvider?: string
): Promise<SaveResultResponse> {
  try {
    const response = await fetch(`${API_BASE}/save-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result: {
          id: result.id,
          trialId: result.trialId,
          trialTitle: result.trialTitle,
          city: result.city,
          careerTitle: result.careerTitle,
          resonance: result.resonance,
          cityMatchScore: result.cityMatchScore,
          cityMatchComment: result.cityMatchComment,
          mappedCareer: result.mappedCareer,
          marketVibe: result.marketVibe,
          salaryExpectation: result.salaryExpectation,
          actionItem: result.actionItem,
          stats: result.stats,
          aiProvider: aiProvider || "unknown",
        },
        choices: choices.map((c, idx) => ({
          order: idx,
          time: c.time,
          sceneTitle: c.sceneTitle,
          selectedOption: c.selectedOption,
          narrationResult: c.narrationResult,
          effects: c.effects,
        })),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${response.status}` };
    }

    return await response.json();
  } catch (err) {
    console.warn("[API] save-result failed (offline?):", err);
    return { success: false, error: String(err) };
  }
}

/**
 * 从后端获取试玩历史
 */
export async function fetchResultsFromServer(limit = 50, offset = 0): Promise<SavedResult[] | null> {
  try {
    const response = await fetch(`${API_BASE}/results?limit=${limit}&offset=${offset}`);
    if (!response.ok) return null;

    const data: GetResultsResponse = await response.json();

    // 将 Supabase 行格式转换为前端 SavedResult 格式
    return (data.data || []).map(mapDbRowToSavedResult);
  } catch (err) {
    console.warn("[API] fetch-results failed:", err);
    return null;
  }
}

/**
 * 获取排行榜
 */
export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[] | null> {
  try {
    const response = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (err) {
    console.warn("[API] fetch-leaderboard failed:", err);
    return null;
  }
}

/**
 * 获取副本统计
 */
export async function fetchTrialStats(): Promise<TrialStat[] | null> {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (err) {
    console.warn("[API] fetch-stats failed:", err);
    return null;
  }
}

/**
 * 软删除试玩记录
 */
export async function deleteResultFromServer(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/results/${id}`, { method: "DELETE" });
    return response.ok;
  } catch (err) {
    console.warn("[API] delete-result failed:", err);
    return false;
  }
}

// ============================================
// localStorage Fallback
// ============================================
const LOCAL_STORAGE_KEY = "life_trials_archive";

export function loadFromLocalStorage(): SavedResult[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn("[localStorage] Read error:", e);
  }
  return [];
}

export function saveToLocalStorage(records: SavedResult[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("[localStorage] Write error:", e);
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.error("[localStorage] Clear error:", e);
  }
}

// ============================================
// 数据格式映射
// ============================================
function mapDbRowToSavedResult(row: any): SavedResult {
  return {
    id: row.id,
    date: new Date(row.created_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    trialId: row.trial_id,
    trialTitle: row.trial_title,
    city: row.city,
    careerTitle: row.career_title,
    resonance: row.resonance || "",
    cityMatchScore: row.city_match_score || 80,
    cityMatchComment: row.city_match_comment || "",
    mappedCareer: row.mapped_career || "",
    marketVibe: row.market_vibe || "",
    salaryExpectation: row.salary_expectation || "",
    actionItem: row.action_item || "",
    choices: [], // 列表视图不需要 choices 详情
    stats: {
      happiness: row.happiness || 50,
      health: row.health || 50,
      stress: row.stress || 50,
      growth: row.growth || 50,
      wealth: row.wealth,
      freedom: row.freedom,
      connection: row.connection,
      peace: row.peace,
    },
  };
}

// ============================================
// 副本数据拉取（从 Supabase 获取最新副本列表）
// ============================================

/**
 * 从 Supabase 获取上线的职业副本列表
 * 失败时返回 null，调用方应 fallback 到本地 CUSTOM_TRIALS
 */
export async function fetchTrialsFromServer(): Promise<CustomTrial[] | null> {
  try {
    const response = await fetch(`${API_BASE}/trials`);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.data || data.data.length === 0) return null;

    // 将 Supabase 行格式转换为前端 CustomTrial 格式
    return data.data.map(mapDbRowToCustomTrial);
  } catch (err) {
    console.warn("[API] fetch-trials failed:", err);
    return null;
  }
}

/**
 * 将 Supabase trials 表行转换为前端 CustomTrial
 */
function mapDbRowToCustomTrial(row: any): CustomTrial {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    career: row.career,
    city: row.city,
    lifestyle: row.lifestyle,
    vibe: row.vibe,
    duration: row.duration,
    coverImage: row.cover_image,
    difficulty: row.difficulty,
    freedom: row.freedom,
    connection: row.connection,
    wealth: row.wealth,
    peace: row.peace,
    scenarios: row.scenarios || [], // JSONB 直接就是 scenarios 数组
  };
}
