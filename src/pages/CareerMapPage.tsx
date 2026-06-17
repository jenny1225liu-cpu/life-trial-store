import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Search, ChevronDown, ChevronRight
} from "lucide-react";
import { getIndustries, getJobs, LIFESTYLE_CATEGORIES, type Industry, type Job } from "../lib/db";

export default function CareerMapPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expandedLifestyle, setExpandedLifestyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 防抖搜索
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  useEffect(() => {
    async function load() {
      const [indData, jobData] = await Promise.all([
        getIndustries(),
        getJobs(),
      ]);
      setIndustries(indData);
      setJobs(jobData);
      setLoading(false);
    }
    load();
  }, []);

  // 搜索匹配的岗位和行业
  const filteredLifestyles = useMemo(() => {
    if (!debouncedQuery) return LIFESTYLE_CATEGORIES;
    const q = debouncedQuery;
    return LIFESTYLE_CATEGORIES.filter(cat => {
      // 生活方式名匹配
      if (cat.name.includes(q) || cat.desc.includes(q)) return true;
      // 行业名匹配
      if (cat.industryIds.some(indId => {
        const ind = industries.find(i => i.id === indId);
        return ind && (ind.name.includes(q) || ind.description?.includes(q));
      })) return true;
      // 岗位名匹配
      if (cat.jobs.some(j => j.includes(q))) return true;
      return false;
    });
  }, [debouncedQuery, industries]);

  // 搜索模式：直接展示匹配的岗位
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery;
    return jobs.filter(j =>
      j.name.includes(q) ||
      j.description?.includes(q) ||
      j.required_skills?.some(s => s.includes(q))
    );
  }, [debouncedQuery, jobs]);

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
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-stone-100 text-zinc-700 rounded-full transition border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-black text-zinc-800">职业探索</h2>
            <p className="text-[10px] text-zinc-400">从你想要的生活方式开始</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="搜索职业或行业..."
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* 搜索结果模式 */}
        {debouncedQuery ? (
          <div className="space-y-2.5">
            <p className="text-[10px] text-zinc-400 font-bold">
              找到 {searchResults.length} 个匹配岗位
            </p>
            {searchResults.map(job => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-stone-200 p-3.5 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span className="text-xl">{job.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-zinc-800">{job.name}</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{job.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
              </Link>
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl">🔍</span>
                <p className="text-xs text-zinc-400 mt-3">没有找到匹配的结果</p>
              </div>
            )}
          </div>
        ) : (
          /* 生活方式分类模式 */
          <div className="space-y-3">
            {/* 引导文案 */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-3.5 border border-indigo-100">
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                💡 选择你最向往的生活方式，发现适合你的行业和岗位
              </p>
            </div>

            {filteredLifestyles.map((cat, idx) => {
              const isExpanded = expandedLifestyle === cat.id;
              const relatedIndustries = cat.industryIds
                .map(id => industries.find(i => i.id === id))
                .filter(Boolean) as Industry[];
              const relatedJobCount = jobs.filter(j =>
                cat.industryIds.includes(j.industry_id)
              ).length;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm"
                >
                  {/* 生活方式卡片 - 可点击展开 */}
                  <button
                    onClick={() => setExpandedLifestyle(isExpanded ? null : cat.id)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-black text-zinc-900">{cat.name}</h3>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{cat.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {relatedJobCount} 个岗位
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 text-zinc-300" />
                        </motion.div>
                      </div>
                    </div>
                    {/* 岗位标签预览 */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cat.jobs.slice(0, 4).map(job => (
                        <span
                          key={job}
                          className="text-[10px] font-bold px-2.5 py-1 bg-stone-50 text-zinc-600 rounded-lg border border-stone-100"
                        >
                          {job}
                        </span>
                      ))}
                      {cat.jobs.length > 4 && (
                        <span className="text-[10px] px-2.5 py-1 text-zinc-300 font-bold">
                          +{cat.jobs.length - 4}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* 展开的行业列表 */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-stone-100 bg-stone-50/50">
                          {relatedIndustries.map(ind => {
                            const indJobs = jobs.filter(j => j.industry_id === ind.id);
                            return (
                              <Link
                                key={ind.id}
                                to={`/industry/${ind.id}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white transition border-b border-stone-100/60 last:border-b-0"
                              >
                                <span className="text-lg">{ind.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-black text-zinc-800">{ind.name}</h4>
                                  <p className="text-[10px] text-zinc-400 line-clamp-1">{ind.trend}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-bold text-indigo-500 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                                    {indJobs.length} 岗
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
