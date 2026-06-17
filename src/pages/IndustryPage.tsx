import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, TrendingUp, AlertTriangle, Building, Briefcase,
  ChevronRight, ShoppingCart, Zap, Shield, BarChart3, Star, Eye
} from "lucide-react";
import {
  getIndustry, getJobsByIndustry, getMarketAnalysis,
  isFavoritedLocal, addFavoriteLocal, removeFavoriteLocal,
  type Industry, type Job, type MarketAnalysis
} from "../lib/db";
import { showToast } from "../components/Toast";

// 代表企业数据（本地）
const TOP_COMPANIES: Record<string, string[]> = {
  internet: ["字节跳动", "腾讯", "阿里巴巴", "美团", "拼多多", "小红书"],
  creative: ["站酷", "特赞", "Canva", "Figma中国", "独立工作室"],
  finance: ["中金", "中信", "华泰", "招商证券", "蚂蚁集团"],
  education: ["新东方", "好未来", "知乎", "得到", "Coursera"],
  healthcare: ["协和", "药明康德", "恒瑞医药", "联影医疗", "微医"],
  ecommerce: ["阿里巴巴", "拼多多", "SHEIN", "TikTok Shop", "京东"],
  media: ["爱奇艺", "优酷", "腾讯视频", "光线传媒", "抖音"],
  hospitality: ["万豪", "希尔顿", "洲际", "悦榕庄", "花间堂"],
  legal: ["金杜", "中伦", "方达", "通商", "红圈所"],
  food: ["海底捞", "喜茶", "蜜雪冰城", "瑞幸", "奈雪"],
  public: ["各级政府机关", "事业单位", "国有企业"],
  tea: ["八马茶业", "华祥苑", "日春", "独立茶庄"],
  automotive: ["比亚迪", "蔚来", "小鹏", "理想", "华为车BU"],
  realestate: ["万科", "龙湖", "华润", "保利", "绿城"],
};

export default function IndustryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [markets, setMarkets] = useState<Record<string, MarketAnalysis[]>>({});
  const [cartState, setCartState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [indData, jobData] = await Promise.all([
        getIndustry(id!),
        getJobsByIndustry(id!),
      ]);
      setIndustry(indData);
      setJobs(jobData);

      // 批量获取市场分析
      const marketMap: Record<string, MarketAnalysis[]> = {};
      const cartMap: Record<string, boolean> = {};
      for (const job of jobData) {
        marketMap[job.id] = await getMarketAnalysis(job.id);
        cartMap[job.id] = isFavoritedLocal(job.id);
      }
      setMarkets(marketMap);
      setCartState(cartMap);
      setLoading(false);
    }
    load();
  }, [id]);

  const toggleCart = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isIn = cartState[jobId];
    if (isIn) {
      removeFavoriteLocal(jobId);
      showToast("info", "已从购物车移除");
    } else {
      addFavoriteLocal(jobId, "industry");
      showToast("success", "已加入购物车 🛒");
    }
    setCartState(prev => ({ ...prev, [jobId]: !isIn }));
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

  if (!industry) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm font-bold text-zinc-400">行业数据暂未收录</p>
          <button onClick={() => navigate("/map")} className="mt-3 text-xs text-indigo-600 font-bold">返回职业探索</button>
        </div>
      </div>
    );
  }

  const topCompanies = TOP_COMPANIES[industry.id] || [];

  return (
    <div className="min-h-screen bg-stone-50 pb-6">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 px-5 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-white/10 text-white/80 rounded-full transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">行业</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{industry.icon}</span>
          <div>
            <h2 className="text-xl font-black text-white">{industry.name}</h2>
            <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed max-w-[260px]">{industry.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm text-center">
            <span className="text-[9px] text-zinc-400 font-bold block">前景</span>
            <span className="text-xs font-black text-emerald-600">{industry.outlook?.slice(0, 6) || "—"}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm text-center">
            <span className="text-[9px] text-zinc-400 font-bold block">风险</span>
            <span className={`text-xs font-black ${industry.risk_level === '高' ? 'text-rose-600' : industry.risk_level === '中' ? 'text-amber-600' : 'text-emerald-600'}`}>{industry.risk_level || "—"}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-sm text-center">
            <span className="text-[9px] text-zinc-400 font-bold block">薪资</span>
            <span className="text-[10px] font-black text-zinc-700">{industry.avg_salary_range || "—"}</span>
          </div>
        </div>

        {/* Trend Card */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
          <h4 className="text-xs font-black text-indigo-600 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            行业趋势
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">{industry.trend}</p>
          <p className="text-[10px] text-zinc-400 mt-2 italic">{industry.outlook}</p>
        </div>

        {/* Hot Skills */}
        {industry.hot_skills && industry.hot_skills.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <h4 className="text-xs font-black text-amber-600 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              当红技能
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industry.hot_skills.map((skill: string) => (
                <span key={skill} className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
            <h4 className="text-xs font-black text-violet-600 mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              代表企业
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {topCompanies.map((company: string) => (
                <span key={company} className="text-[10px] font-bold px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg border border-violet-100">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ====================== */}
        {/* 岗位目录：JD + 市场分析 + 加入购物车 */}
        {/* ====================== */}
        <div className="space-y-0">
          <div className="flex items-center gap-2 mb-1 px-1">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <h4 className="text-xs font-black text-emerald-600">岗位目录</h4>
            <span className="text-[9px] text-zinc-400 font-bold">{jobs.length} 个岗位</span>
          </div>

          {jobs.map((job, idx) => {
            const jobMarkets = markets[job.id] || [];
            const demandMarket = jobMarkets.find(m => m.analysis_type === "demand");
            const trendMarket = jobMarkets.find(m => m.analysis_type === "trend");
            const isInCart = cartState[job.id];

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-2.5"
              >
                {/* 岗位头部：名称 + 购物车 */}
                <div className="p-4 pb-3">
                  <div className="flex items-start gap-3">
                    <Link to={`/job/${job.id}`} className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl mt-0.5">{job.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-black text-zinc-900">{job.name}</h5>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{job.education_required} · {job.experience_required}</p>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => toggleCart(job.id, e)}
                      className={`shrink-0 p-2 rounded-xl transition-all ${
                        isInCart
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-stone-100 text-zinc-400 hover:bg-indigo-50 hover:text-indigo-500"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* JD 摘要 */}
                <div className="px-4 pb-3">
                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{job.description}</p>
                </div>

                {/* 核心职责 */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-1">
                      {job.responsibilities.slice(0, 3).map((r: string, i: number) => (
                        <span key={i} className="text-[9px] font-medium px-2 py-0.5 bg-stone-50 text-zinc-500 rounded-md border border-stone-100">
                          {r.length > 10 ? r.slice(0, 10) + '...' : r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 技能标签 */}
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.slice(0, 4).map((s: string) => (
                        <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 市场分析 */}
                {jobMarkets.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BarChart3 className="w-3 h-3 text-blue-500" />
                      <span className="text-[9px] font-black text-blue-600 uppercase">市场分析</span>
                    </div>
                    {demandMarket && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] text-zinc-400 font-bold shrink-0">需求</span>
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${demandMarket.score || 0}%` }}
                            transition={{ delay: 0.2 + idx * 0.05, duration: 0.4 }}
                            className={`h-full rounded-full ${
                              (demandMarket.score || 0) >= 70 ? 'bg-emerald-500' :
                              (demandMarket.score || 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>
                        <span className="text-[9px] font-black text-zinc-500 w-6 text-right">{demandMarket.score}</span>
                      </div>
                    )}
                    {trendMarket && (
                      <p className="text-[10px] text-zinc-400 leading-relaxed">{trendMarket.content}</p>
                    )}
                  </div>
                )}

                {/* 底部操作栏 */}
                <div className="flex items-center border-t border-stone-100 bg-stone-50/50">
                  <Link
                    to={`/job/${job.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Eye className="w-3 h-3" />
                    查看详情
                  </Link>
                  <div className="w-px h-5 bg-stone-200" />
                  <button
                    onClick={(e) => toggleCart(job.id, e)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold transition ${
                      isInCart
                        ? "text-indigo-600 hover:bg-indigo-50"
                        : "text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {isInCart ? "已在购物车" : "加入购物车"}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {jobs.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
              <span className="text-3xl">📭</span>
              <p className="text-xs text-zinc-400 mt-3">该行业暂无收录岗位</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
