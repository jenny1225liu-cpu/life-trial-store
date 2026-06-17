import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, BarChart3, ChevronRight, Star, Plus, X,
  TrendingUp, Shield, DollarSign, Heart, Zap
} from "lucide-react";
import { getJobs, loadFavoritesLocal, type Job } from "../lib/db";

const COLORS = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500"];
const LIGHT_COLORS = ["bg-indigo-100", "bg-emerald-100", "bg-amber-100"];

export default function ComparePage() {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [jobData, favData] = await Promise.all([
        getJobs(),
        Promise.resolve(loadFavoritesLocal()),
      ]);
      setAllJobs(jobData);
      // 默认选中收藏的前2个，否则选前2个
      const favIds = favData.slice(0, 2).map(f => f.jobId);
      const defaultIds = favIds.length >= 2
        ? favIds
        : jobData.slice(0, 2).map(j => j.id);
      setSelectedIds(defaultIds);
      setLoading(false);
    }
    load();
  }, []);

  const toggleJob = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getJob = (id: string) => allJobs.find(j => j.id === id);

  const dimensions = [
    { key: "freedom_score" as const, label: "自由度", emoji: "🦋" },
    { key: "connection_score" as const, label: "人脉圈", emoji: "🤝" },
    { key: "wealth_score" as const, label: "财富力", emoji: "💰" },
    { key: "peace_score" as const, label: "内心安", emoji: "🧘" },
    { key: "growth_score" as const, label: "成长性", emoji: "📈" },
    { key: "stability_score" as const, label: "稳定性", emoji: "🛡️" },
    { key: "competition_score" as const, label: "竞争度", emoji: "⚔️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-stone-100 text-zinc-700 rounded-full transition border border-stone-200">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-black text-zinc-800">职业对比中心</h2>
            <p className="text-[10px] text-zinc-400">选择2-3个岗位进行多维对比</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Selected Jobs */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-indigo-600 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              对比岗位
            </h4>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 添加
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedIds.map((id, idx) => {
              const job = getJob(id);
              return job ? (
                <div key={id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${LIGHT_COLORS[idx]} border border-stone-100`}>
                  <span className="text-sm">{job.icon}</span>
                  <span className="text-[11px] font-bold text-zinc-700">{job.name}</span>
                  <button onClick={() => toggleJob(id)} className="text-zinc-300 hover:text-rose-500 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null;
            })}
            {selectedIds.length < 3 && (
              <button
                onClick={() => setShowPicker(true)}
                className="px-3 py-1.5 border-2 border-dashed border-stone-200 rounded-xl text-[11px] text-zinc-300 font-bold flex items-center gap-1 hover:border-indigo-300 hover:text-indigo-400 transition"
              >
                <Plus className="w-3 h-3" /> 添加岗位
              </button>
            )}
          </div>
        </div>

        {/* Job Picker Modal */}
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm"
          >
            <h4 className="text-xs font-bold text-zinc-500 mb-3">选择要对比的岗位：</h4>
            <div className="grid grid-cols-2 gap-2">
              {allJobs.filter(j => !selectedIds.includes(j.id)).map(job => (
                <button
                  key={job.id}
                  onClick={() => { toggleJob(job.id); if (selectedIds.length >= 2) setShowPicker(false); }}
                  className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 hover:bg-indigo-50 hover:border-indigo-200 transition text-left"
                >
                  <span className="text-lg">{job.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-700">{job.name}</p>
                    <p className="text-[9px] text-zinc-400">{job.education_required}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowPicker(false)} className="mt-3 w-full py-2 text-xs text-zinc-400 font-bold hover:text-zinc-600 transition">
              关闭
            </button>
          </motion.div>
        )}

        {/* Salary Comparison */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <h4 className="text-xs font-black text-amber-600 mb-3 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            维度总览
          </h4>
          <div className="space-y-2">
            {selectedIds.map((id, idx) => {
              const job = getJob(id);
              return job ? (
                <div key={id} className="flex items-center gap-2">
                  <span className="text-sm">{job.icon}</span>
                  <span className="text-[11px] font-bold text-zinc-600 w-24 truncate">{job.name}</span>
                  <span className="text-[9px] text-zinc-400">自由{job.freedom_score}</span>
                  <span className="text-[9px] text-zinc-400">财富{job.wealth_score}</span>
                  <span className="text-[9px] text-zinc-400">稳定{job.stability_score}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Dimension Comparison */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <h4 className="text-xs font-black text-blue-600 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            维度对比
          </h4>
          <div className="space-y-3">
            {dimensions.map((dim) => (
              <div key={dim.key}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">{dim.emoji}</span>
                  <span className="text-[10px] font-bold text-zinc-500">{dim.label}</span>
                </div>
                <div className="space-y-1">
                  {selectedIds.map((id, idx) => {
                    const job = getJob(id);
                    const val = job ? job[dim.key] : 0;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-zinc-400 w-4 text-right">{val}</span>
                        <div className="flex-1 h-2.5 bg-stone-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className={`h-full ${COLORS[idx]} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-2 border-t border-stone-100">
            {selectedIds.map((id, idx) => {
              const job = getJob(id);
              return job ? (
                <span key={id} className="text-[9px] text-zinc-400 font-bold flex items-center gap-1">
                  <span className={`w-3 h-1.5 ${COLORS[idx]} rounded-full inline-block`} />
                  {job.icon} {job.name}
                </span>
              ) : null;
            })}
          </div>
        </div>

        {/* Verdict */}
        {selectedIds.length >= 2 && (() => {
          const selectedJobs = selectedIds.map(id => getJob(id)).filter(Boolean) as Job[];
          if (selectedJobs.length < 2) return null;
          const topWealth = selectedJobs.reduce((a, b) => a.wealth_score > b.wealth_score ? a : b);
          const topFreedom = selectedJobs.reduce((a, b) => a.freedom_score > b.freedom_score ? a : b);
          const topStability = selectedJobs.reduce((a, b) => a.stability_score > b.stability_score ? a : b);
          return (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100">
              <h4 className="text-xs font-black text-indigo-700 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                对比小结
              </h4>
              <div className="space-y-1.5 text-[11px] text-zinc-600">
                <p>💰 <b>{topWealth.name}</b> 的财富潜力最高 ({topWealth.wealth_score}/100)</p>
                <p>🦋 <b>{topFreedom.name}</b> 的自由度最高 ({topFreedom.freedom_score}/100)</p>
                <p>🛡️ <b>{topStability.name}</b> 的稳定性最好 ({topStability.stability_score}/100)</p>
              </div>
            </div>
          );
        })()}

        {/* CTA */}
        {selectedIds.length >= 2 && (
          <Link
            to="/report"
            className="block bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <div>
                <h4 className="text-sm font-black">生成职业决策报告</h4>
                <p className="text-[10px] text-white/60">AI 为你深度分析，给出行动建议</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
