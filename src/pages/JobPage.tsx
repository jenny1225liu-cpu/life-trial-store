import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, Star, MapPin, DollarSign, TrendingUp, AlertTriangle,
  Shield, Briefcase, BookOpen, Zap, Heart, BarChart3, ChevronRight
} from "lucide-react";
import {
  getJob, getRisksByJob, getSalaryByJob,
  isFavoritedLocal, addFavoriteLocal, removeFavoriteLocal,
  type Job, type RiskAssessment, type SalaryByCity
} from "../lib/db";
import { showToast } from "../components/Toast";

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [salaries, setSalaries] = useState<SalaryByCity[]>([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [jobData, riskData, salaryData] = await Promise.all([
        getJob(id!),
        getRisksByJob(id!),
        getSalaryByJob(id!),
      ]);
      setJob(jobData);
      setRisks(riskData);
      setSalaries(salaryData);
      setFavorited(isFavoritedLocal(id!));
      setLoading(false);
    }
    load();
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    if (favorited) {
      removeFavoriteLocal(id);
      showToast("info", "已取消收藏");
    } else {
      addFavoriteLocal(id);
      showToast("success", "已收藏该岗位");
    }
    setFavorited(!favorited);
  };

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

  if (!job) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm font-bold text-zinc-400">岗位数据暂未收录</p>
          <button onClick={() => navigate("/map")} className="mt-3 text-xs text-indigo-600 font-bold">返回职业地图</button>
        </div>
      </div>
    );
  }

  const dims = [
    { label: "自由度", emoji: "🦋", value: job.freedom_score, color: "bg-sky-500" },
    { label: "人脉圈", emoji: "🤝", value: job.connection_score, color: "bg-violet-500" },
    { label: "财富力", emoji: "💰", value: job.wealth_score, color: "bg-amber-500" },
    { label: "内心安", emoji: "🧘", value: job.peace_score, color: "bg-emerald-500" },
    { label: "成长性", emoji: "📈", value: job.growth_score, color: "bg-blue-500" },
    { label: "稳定性", emoji: "🛡️", value: job.stability_score, color: "bg-stone-500" },
    { label: "竞争度", emoji: "⚔️", value: job.competition_score, color: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 text-white/80 rounded-full transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition ${favorited ? "bg-amber-400 text-white" : "bg-white/10 text-white/60"}`}
          >
            <Star className="w-4 h-4" fill={favorited ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{job.icon}</span>
          <div>
            <h2 className="text-xl font-black text-white">{job.name}</h2>
            <p className="text-[11px] text-white/60 mt-0.5">{job.education_required} · {job.experience_required}</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mt-3 leading-relaxed">{job.description}</p>
      </div>

      <div className="px-4 -mt-4 space-y-3">
        {/* Dimensions Radar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <h4 className="text-xs font-black text-blue-600 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            职业维度评分
          </h4>
          <div className="space-y-2.5">
            {dims.map((dim, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs w-5 text-center">{dim.emoji}</span>
                <span className="text-[10px] font-bold text-zinc-500 w-10">{dim.label}</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value}%` }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                    className={`h-full ${dim.color} rounded-full`}
                  />
                </div>
                <span className="text-[10px] font-black text-zinc-600 w-7 text-right">{dim.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Salary by City */}
        {salaries.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <h4 className="text-xs font-black text-amber-600 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              薪资参考
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-1.5 text-zinc-400 font-bold">城市</th>
                    <th className="text-right py-1.5 text-zinc-400 font-bold">初级</th>
                    <th className="text-right py-1.5 text-zinc-400 font-bold">中级</th>
                    <th className="text-right py-1.5 text-zinc-400 font-bold">资深</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((row) => (
                    <tr key={row.city_id || row.city_name} className="border-b border-stone-50">
                      <td className="py-1.5 font-bold text-zinc-700">{row.city_name}</td>
                      <td className="py-1.5 text-right text-zinc-500">
                        {row.entry_min && row.entry_max ? `${row.entry_min}-${row.entry_max}k` : "—"}
                      </td>
                      <td className="py-1.5 text-right text-zinc-600 font-semibold">
                        {row.mid_min && row.mid_max ? `${row.mid_min}-${row.mid_max}k` : "—"}
                      </td>
                      <td className="py-1.5 text-right text-emerald-600 font-bold">
                        {row.senior_min && row.senior_max ? `${row.senior_min}-${row.senior_max}k` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <h4 className="text-xs font-black text-indigo-600 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              核心职责
            </h4>
            <ul className="space-y-1.5">
              {job.responsibilities.map((r: string, i: number) => (
                <li key={i} className="text-[11px] text-zinc-600 flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <h4 className="text-xs font-black text-emerald-600 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            技能要求
          </h4>
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="mb-2">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">必备：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.required_skills.map((s: string) => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">{s}</span>
                ))}
              </div>
            </div>
          )}
          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">加分：</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.preferred_skills.map((s: string) => (
                  <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-stone-50 text-zinc-500 rounded-md border border-stone-100">{s}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-4 text-[10px] text-zinc-400">
            <span>🎓 {job.education_required}</span>
            <span>📅 {job.experience_required}</span>
          </div>
        </div>

        {/* Risk Assessment */}
        {risks.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <h4 className="text-xs font-black text-rose-600 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              风险提示
            </h4>
            {risks.map((risk, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    risk.risk_level === '高' ? 'bg-rose-100 text-rose-700' :
                    risk.risk_level === '中' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{risk.risk_level}</span>
                  <span className="text-[10px] font-bold text-zinc-600">{risk.risk_type}</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 ml-7">{risk.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Related Trial */}
        {job.related_trial_ids && job.related_trial_ids.length > 0 && (
          <Link
            to={`/trial#${job.related_trial_ids[0]}`}
            className="block bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div className="flex-1">
                <h5 className="text-xs font-black text-indigo-700">试玩这个职业</h5>
                <p className="text-[10px] text-indigo-400">去人生试玩店体验一天</p>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-300" />
            </div>
          </Link>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 z-30">
        <div className="flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              favorited ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-stone-100 text-zinc-500 border border-stone-200"
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={favorited ? "currentColor" : "none"} />
            {favorited ? "已收藏" : "收藏"}
          </button>
          <Link
            to="/compare"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black transition active:scale-[0.98]"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            加入对比
          </Link>
        </div>
      </div>
    </div>
  );
}
