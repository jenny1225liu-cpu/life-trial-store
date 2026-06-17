import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, Star, Trash2, Briefcase, ChevronRight,
  BarChart3, MapPin, DollarSign, Heart
} from "lucide-react";
import {
  getJobs, loadFavoritesLocal, removeFavoriteLocal,
  type Job, type LocalFavorite
} from "../lib/db";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<LocalFavorite[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [favData, jobData] = await Promise.all([
        Promise.resolve(loadFavoritesLocal()),
        getJobs(),
      ]);
      setFavorites(favData);
      setJobs(jobData);
      setLoading(false);
    }
    load();
  }, []);

  const removeFavorite = (jobId: string) => {
    const updated = removeFavoriteLocal(jobId);
    setFavorites([...updated]);
  };

  // 获取收藏的岗位详情
  const favoritedJobs = favorites
    .map(fav => {
      const job = jobs.find(j => j.id === fav.jobId);
      return job ? { ...fav, job } : null;
    })
    .filter(Boolean) as (LocalFavorite & { job: Job })[];

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
            <h2 className="text-sm font-black text-zinc-800">岗位候选库</h2>
            <p className="text-[10px] text-zinc-400">你收藏的岗位都在这里</p>
          </div>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {favoritedJobs.length} 个
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {favoritedJobs.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl select-none filter opacity-30">⭐</span>
            <h4 className="text-sm font-extrabold text-zinc-400 mt-4">还没有收藏任何岗位</h4>
            <p className="text-[10px] text-zinc-400 mt-1">去职业地图逛逛，收藏感兴趣的岗位吧</p>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              去探索 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {favoritedJobs.map((fav, idx) => (
              <motion.div
                key={fav.jobId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4">
                  <Link to={`/job/${fav.jobId}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{fav.job.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-zinc-900">{fav.job.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold">{fav.job.education_required}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.jobId)}
                    className="p-1.5 hover:bg-rose-50 text-zinc-300 hover:text-rose-500 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Compare CTA */}
        {favoritedJobs.length >= 2 && (
          <Link
            to="/compare"
            className="mt-5 block bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <div>
                <h4 className="text-sm font-black">对比你收藏的岗位</h4>
                <p className="text-[10px] text-white/60">薪资、成长、稳定、风险多维对比</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
