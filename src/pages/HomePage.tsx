import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Gamepad2, Archive, Map, Briefcase, Star, BarChart3, FileText,
  ChevronRight, Sparkles, TrendingUp
} from "lucide-react";
import { getIndustries, getJobs } from "../lib/db";

const FEATURE_CARDS = [
  {
    to: "/trial",
    icon: Gamepad2,
    emoji: "🎮",
    title: "人生试玩店",
    subtitle: "先过一天，再做选择",
    desc: "沉浸式体验15种职业的一天，发现你的职业DNA",
    gradient: "from-violet-500 to-indigo-600",
    bgGradient: "from-violet-50 to-indigo-50",
  },
  {
    to: "/profile",
    icon: Archive,
    emoji: "📋",
    title: "现实档案馆",
    subtitle: "校准你的现实坐标",
    desc: "填入学校、专业、预算，建立你的现实档案",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    to: "/map",
    icon: Map,
    emoji: "🗺️",
    title: "职业地图",
    subtitle: "认识职业世界",
    desc: "按生活方式分类，探索行业与岗位的全景",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    to: "/compare",
    icon: BarChart3,
    emoji: "⚖️",
    title: "职业对比中心",
    subtitle: "做出明智选择",
    desc: "薪资、成长、稳定、风险多维对比",
    gradient: "from-sky-500 to-blue-600",
    bgGradient: "from-sky-50 to-blue-50",
  },
];

export default function HomePage() {
  const [stats, setStats] = useState({ jobs: 0, industries: 0, cities: 17 });

  useEffect(() => {
    async function loadStats() {
      const [indData, jobData] = await Promise.all([getIndustries(), getJobs()]);
      setStats(prev => ({ ...prev, jobs: jobData.length, industries: indData.length }));
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen pb-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-6 left-6 text-4xl animate-pulse">🎮</div>
          <div className="absolute top-20 right-10 text-3xl">☕</div>
          <div className="absolute bottom-10 left-12 text-2xl">💼</div>
          <div className="absolute bottom-16 right-6 text-3xl animate-bounce">🗺️</div>
        </div>
        <div className="relative px-5 pt-14 pb-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-black tracking-tight">
              人生试玩店
            </h1>
            <p className="text-sm text-white/70 mt-1 font-medium">
              先过一天，再做选择
            </p>
            <p className="text-xs text-white/50 mt-3 leading-relaxed max-w-[280px]">
              不确定适合什么职业？先来试玩一天。从虚拟体验到现实决策，帮你找到最匹配的职业方向。
            </p>
          </motion.div>

          {/* User Journey Steps */}
          <div className="mt-6 flex items-center gap-1 text-[9px] text-white/60 font-bold">
            <span className="bg-white/15 px-2 py-1 rounded-lg">试玩体验</span>
            <span>→</span>
            <span className="bg-white/15 px-2 py-1 rounded-lg">现实校准</span>
            <span>→</span>
            <span className="bg-white/15 px-2 py-1 rounded-lg">职业探索</span>
            <span>→</span>
            <span className="bg-white/15 px-2 py-1 rounded-lg">做出选择</span>
          </div>
        </div>
      </div>

      {/* Quick Play Card */}
      <Link to="/" className="block -mt-1 mx-4">
        <motion.div
          className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-4 flex items-center gap-4"
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center relative">
            <Gamepad2 className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-zinc-900">立即试玩</h3>
            <p className="text-[10px] text-zinc-400">体验 {stats.jobs || 15} 种职业的一天</p>
          </div>
          <ChevronRight className="w-5 h-5 text-indigo-400" />
        </motion.div>
      </Link>

      {/* Feature Cards */}
      <div className="px-4 -mt-2 space-y-3">
        {FEATURE_CARDS.map((card, idx) => (
          <motion.div
            key={card.to}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08 }}
          >
            <Link
              to={card.to}
              className={`block bg-gradient-to-r ${card.bgGradient} rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md transition-all active:scale-[0.98]`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                  <span className="text-lg">{card.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-zinc-900 text-sm">{card.title}</h3>
                    <span className="text-[9px] text-zinc-400 font-bold">{card.subtitle}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{card.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <h3 className="text-xs font-black text-zinc-700 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            平台数据
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-black text-indigo-600">{stats.jobs || 15}</p>
              <p className="text-[9px] text-zinc-400 font-bold">职业副本</p>
            </div>
            <div>
              <p className="text-lg font-black text-emerald-600">{stats.industries || 14}</p>
              <p className="text-[9px] text-zinc-400 font-bold">覆盖行业</p>
            </div>
            <div>
              <p className="text-lg font-black text-amber-600">{stats.cities}</p>
              <p className="text-[9px] text-zinc-400 font-bold">覆盖城市</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
