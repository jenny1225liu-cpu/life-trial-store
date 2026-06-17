import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bkdvjvqxttvavaufpbao.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ksbtkr-LB3iiEI0Xq0zeog_tYYxhGam";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// Types
// ============================================
export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  trend: string | null;
  outlook: string | null;
  hot_skills: string[] | null;
  avg_salary_range: string | null;
  risk_level: string | null;
  is_active: boolean;
}

export interface Job {
  id: string;
  industry_id: string;
  name: string;
  icon: string;
  description: string | null;
  responsibilities: string[] | null;
  required_skills: string[] | null;
  preferred_skills: string[] | null;
  education_required: string | null;
  experience_required: string | null;
  freedom_score: number;
  connection_score: number;
  wealth_score: number;
  peace_score: number;
  growth_score: number;
  stability_score: number;
  competition_score: number;
  related_trial_ids: string[] | null;
  is_active: boolean;
}

export interface City {
  id: string;
  name: string;
  tier: number;
  region: string | null;
  description: string | null;
  living_cost: string | null;
  avg_rent: string | null;
  vibe: string | null;
  population: string | null;
  is_active: boolean;
}

export interface SalaryData {
  id: number;
  job_id: string;
  city_id: string;
  experience_level: string;
  min_salary: number | null;
  max_salary: number | null;
  median_salary: number | null;
  bonus_months: number | null;
  stock_likelihood: number | null;
}

export interface RiskAssessment {
  id: number;
  job_id: string;
  risk_type: string;
  risk_level: string;
  description: string | null;
  mitigation: string | null;
  probability: number | null;
  impact_score: number | null;
}

export interface MarketAnalysis {
  id: number;
  job_id: string;
  analysis_type: string;
  content: string;
  score: number | null;
  data_date: string | null;
}

export interface UserProfile {
  id: string;
  school: string | null;
  major: string | null;
  education_level: string | null;
  graduation_year: number | null;
  preferred_cities: string[] | null;
  min_salary: number | null;
  max_salary: number | null;
  budget: string | null;
  freedom_weight: number;
  connection_weight: number;
  wealth_weight: number;
  peace_weight: number;
  latest_trial_result_id: string | null;
}

export interface JobFavorite {
  id: number;
  user_id: string;
  job_id: string;
  note: string | null;
  source: string | null;
  created_at: string;
}

export interface CompareHistory {
  id: number;
  user_id: string;
  job_ids: string[];
  result_json: Record<string, unknown> | null;
  created_at: string;
}

export interface CareerReport {
  id: string;
  user_id: string;
  user_summary: Record<string, unknown> | null;
  recommended_jobs: string[] | null;
  analysis: string | null;
  action_items: string[] | null;
  ai_provider: string | null;
  created_at: string;
}
