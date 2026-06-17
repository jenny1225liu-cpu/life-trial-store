import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, FileText, Sparkles, CheckCircle2, Download,
  Briefcase, MapPin, DollarSign, TrendingUp, Lightbulb, BarChart3
} from "lucide-react";
import { loadProfileLocal, loadFavoritesLocal, getJobs } from "../lib/db";

interface DimensionScore {
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

interface ReportData {
  userSummary: string;
  dimensionAnalysis: {
    freedom: DimensionScore;
    connection: DimensionScore;
    wealth: DimensionScore;
    peace: DimensionScore;
  };
  recommendedJobs: RecommendedJob[];
  actionItems: ActionItem[];
  overallAdvice: string;
}

export default function ReportPage() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);

    const profile = loadProfileLocal();
    if (!profile) {
      setError("请先去「现实档案馆」填写你的个人档案，才能生成专属报告");
      return;
    }

    setGenerating(true);

    try {
      const raw = localStorage.getItem("latest_trial_result");
      const trialResults = raw ? JSON.parse(raw) : null;
      const favorites = loadFavoritesLocal();
      const allJobs = await getJobs();
      const favoriteJobs = allJobs.filter(j => favorites.some(f => f.jobId === j.id));

      const body: Record<string, any> = { profile, trialResults, favoriteJobs };

      const doFetch = async (payload: Record<string, any>) => {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`请求失败: ${res.status}`);
        return res.json();
      };

      let data: ReportData;
      try {
        data = await doFetch(body);
      } catch {
        data = await doFetch({ ...body, _forceFallback: true });
      }

      setReport(data);
    } catch (e: any) {
      setError(e.message || "生成报告失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (report) {
      localStorage.setItem("career_report", JSON.stringify(report));
    }
  };

  const dimMeta: Record<string, { label: string; emoji: string; color: string }> = {
    freedom: { label: "自由度", emoji: "🦋", color: "text-sky-600" },
    connection: { label: "人脉圈", emoji: "🤝", color: "text-violet-600" },
    wealth: { label: "财富力", emoji: "💰", color: "text-amber-600" },
    peace: { label: "内心安", emoji: "🧘", color: "text-emerald-600" },
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-stone-100 text-zinc-700 rounded-full transition border border-stone-200">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-black text-zinc-800">职业决策报告</h2>
            <p className="text-[10px] text-zinc-400">AI 为你量身定制的职业分析</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {!report ? (
          <div className="text-center py-16">
            <span className="text-5xl">📋</span>
            <h3 className="text-lg font-black text-zinc-800 mt-4">生成你的职业决策报告</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-[260px] mx-auto">
              基于你的试玩结果、现实档案和收藏岗位，AI 将为你深度分析并给出行动建议
            </p>
            {error && (
              <div className="mt-4 mx-auto max-w-[280px] bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600">
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition active:scale-[0.98] disabled:opacity-50"
            >
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  AI 正在分析...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成报告
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Report Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-white/70" />
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Career Decision Report</span>
              </div>
              <h3 className="text-lg font-black">你的职业导航报告</h3>
              <p className="text-xs text-white/60 mt-1">基于试玩数据 + 现实档案 + 职业对比综合分析</p>
              <div className="mt-3 text-[10px] text-white/40">生成时间：{new Date().toLocaleDateString("zh-CN")}</div>
            </div>

            {/* User Summary */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <h4 className="text-xs font-black text-indigo-600 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                你的画像
              </h4>
              <div className="grid grid-cols-2 gap-2">
              {Object.entries(report.dimensionAnalysis).map(([key, dim]: [string, DimensionScore]) => {
                const meta = dimMeta[key];
                return (
                  <div key={key} className="bg-stone-50 rounded-xl p-2.5">
                    <span className="text-[9px] text-zinc-400 font-bold">{meta.emoji} {meta.label}</span>
                    <p className={`text-sm font-black ${meta.color}`}>{dim.score}/100</p>
                  </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                {report.userSummary}
              </p>
            </div>

            {/* Dimension Analysis Detail */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <h4 className="text-xs font-black text-blue-600 mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                维度深度分析
              </h4>
              <div className="space-y-3">
              {Object.entries(report.dimensionAnalysis).map(([key, dim]: [string, DimensionScore]) => {
                const meta = dimMeta[key];
                return (
                  <div key={key} className="bg-stone-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-zinc-700">{meta.emoji} {meta.label}</span>
                      <span className={`text-xs font-black ${meta.color}`}>{dim.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{dim.analysis}</p>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Careers */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <h4 className="text-xs font-black text-emerald-600 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                推荐职业方向
              </h4>
              {report.recommendedJobs.map((rec, idx) => (
                <div key={idx} className="mb-3 last:mb-0 bg-stone-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-zinc-800">{rec.name}</h5>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          匹配 {rec.matchScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{rec.reason}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">💳 {rec.salary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <h4 className="text-xs font-black text-amber-700 mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                行动建议
              </h4>
              <div className="space-y-2">
                {report.actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <div className="flex-1">
                      <p className="text-[11px] text-zinc-700 leading-relaxed">{item.text}</p>
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {item.timeline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Advice */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100">
              <h4 className="text-xs font-black text-indigo-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI 总体建议
              </h4>
              <p className="text-[11px] text-zinc-700 leading-relaxed">{report.overallAdvice}</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-white border border-stone-200 text-zinc-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 transition"
            >
              <Download className="w-3.5 h-3.5" />
              保存报告到本地
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
