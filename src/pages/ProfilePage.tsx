import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft, GraduationCap, School, BookOpen, MapPin,
  DollarSign, SlidersHorizontal, CheckCircle2, Sparkles,
  Building, Wallet, Heart, Briefcase
} from "lucide-react";
import { getCities, loadProfileLocal, saveProfileLocal, type City, type LocalProfile } from "../lib/db";

const EDUCATION_LEVELS = ["专科", "本科", "硕士", "博士"];
const GRADUATION_YEARS = ["2026", "2027", "2028", "已毕业"];

// 城市列表从数据层获取
const CITY_OPTIONS_DEFAULT = [
  { id: "shanghai", name: "上海", emoji: "🌆" },
  { id: "beijing", name: "北京", emoji: "🏯" },
  { id: "shenzhen", name: "深圳", emoji: "🏙️" },
  { id: "hangzhou", name: "杭州", emoji: "🏞️" },
  { id: "guangzhou", name: "广州", emoji: "🌴" },
  { id: "chengdu", name: "成都", emoji: "🐼" },
  { id: "suzhou", name: "苏州", emoji: "🏡" },
  { id: "nanjing", name: "南京", emoji: "⛰️" },
  { id: "xiamen", name: "厦门", emoji: "🌊" },
  { id: "changsha", name: "长沙", emoji: "🌶️" },
  { id: "chongqing", name: "重庆", emoji: "🌉" },
  { id: "xian", name: "西安", emoji: "🕌" },
];

interface ProfileData {
  school: string;
  major: string;
  educationLevel: string;
  graduationYear: string;
  preferredCities: string[];
  minSalary: number;
  budget: string;
  freedomWeight: number;
  connectionWeight: number;
  wealthWeight: number;
  peaceWeight: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [cityOptions, setCityOptions] = useState(CITY_OPTIONS_DEFAULT);

  // 从 localStorage 加载已有档案
  const savedProfile = loadProfileLocal();
  const [profile, setProfile] = useState<LocalProfile>(savedProfile || {
    school: "",
    major: "",
    educationLevel: "",
    graduationYear: "",
    preferredCities: [],
    minSalary: 8,
    budget: "",
    freedomWeight: 50,
    connectionWeight: 50,
    wealthWeight: 50,
    peaceWeight: 50,
  });

  useEffect(() => {
    async function loadCities() {
      const cities = await getCities();
      if (cities.length > 0) {
        const emojiMap: Record<string, string> = {
          shanghai: "🌆", beijing: "🏯", shenzhen: "🏙️", hangzhou: "🏞️",
          guangzhou: "🌴", chengdu: "🐼", suzhou: "🏡", nanjing: "⛰️",
          xiamen: "🌊", changsha: "🌶️", chongqing: "🌉", xian: "🕌",
          qingdao: "🌊", dali: "🏔️", hongkong: "🌃", anxi: "🍵", yiwu: "🛍️",
        };
        setCityOptions(cities.map(c => ({
          id: c.id,
          name: c.name,
          emoji: emojiMap[c.id] || "🏙️",
        })));
      }
    }
    loadCities();
  }, []);

  const updateProfile = (key: keyof LocalProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleCity = (cityId: string) => {
    setProfile(prev => ({
      ...prev,
      preferredCities: prev.preferredCities.includes(cityId)
        ? prev.preferredCities.filter(c => c !== cityId)
        : [...prev.preferredCities, cityId].slice(0, 5)
    }));
  };

  const handleSave = () => {
    saveProfileLocal(profile);
    setSaved(true);
    setTimeout(() => navigate("/map"), 1200);
  };

  const steps = [
    // Step 0: 基础信息
    {
      title: "你的学业档案",
      subtitle: "让我们了解你的起点",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">学校</label>
            <input
              type="text"
              value={profile.school}
              onChange={e => updateProfile("school", e.target.value)}
              placeholder="你的学校名称"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">专业</label>
            <input
              type="text"
              value={profile.major}
              onChange={e => updateProfile("major", e.target.value)}
              placeholder="你的专业方向"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">学历</label>
            <div className="flex gap-2 flex-wrap">
              {EDUCATION_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => updateProfile("educationLevel", level)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    profile.educationLevel === level
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-stone-100 text-zinc-500 border border-stone-200 hover:bg-stone-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">毕业年份</label>
            <div className="flex gap-2 flex-wrap">
              {GRADUATION_YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => updateProfile("graduationYear", year)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    profile.graduationYear === year
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-stone-100 text-zinc-500 border border-stone-200 hover:bg-stone-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Step 1: 城市偏好
    {
      title: "你想去哪座城市？",
      subtitle: "选择1-5个你偏好的城市",
      content: (
        <div className="grid grid-cols-3 gap-2.5">
          {cityOptions.map(city => (
            <motion.button
              key={city.id}
              onClick={() => toggleCity(city.id)}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl text-center transition ${
                profile.preferredCities.includes(city.id)
                  ? "bg-indigo-600 text-white shadow-sm border-indigo-600"
                  : "bg-stone-50 text-zinc-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <span className="text-lg block">{city.emoji}</span>
              <span className="text-[11px] font-bold block mt-0.5">{city.name}</span>
            </motion.button>
          ))}
        </div>
      )
    },
    // Step 2: 薪资与预算
    {
      title: "你的收入预期",
      subtitle: "设定你的底线和预算",
      content: (
        <div className="space-y-5">
          <div className="relative">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-2">
              最低月薪期望：<span className="text-indigo-600">{profile.minSalary}k/月</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min={3}
                max={50}
                value={profile.minSalary}
                onChange={e => updateProfile("minSalary", Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <motion.div
                className="absolute -top-7 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-md"
                animate={{
                  left: `calc(${((profile.minSalary - 3) / 47) * 100}% - 12px)`
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {profile.minSalary}k
              </motion.div>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-400 font-bold mt-1">
              <span>3k</span>
              <span>50k</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">月生活预算（可选）</label>
            <input
              type="text"
              value={profile.budget}
              onChange={e => updateProfile("budget", e.target.value)}
              placeholder="如：3000-5000元/月"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-zinc-800 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>
        </div>
      )
    },
    // Step 3: 维度偏好
    {
      title: "你最看重什么？",
      subtitle: "调整四大维度的权重",
      content: (
        <div className="space-y-4">
          {[
            { key: "freedomWeight" as const, label: "自由度", emoji: "🦋", color: "accent-sky-600" },
            { key: "connectionWeight" as const, label: "人脉圈", emoji: "🤝", color: "accent-violet-600" },
            { key: "wealthWeight" as const, label: "财富力", emoji: "💰", color: "accent-amber-600" },
            { key: "peaceWeight" as const, label: "内心安", emoji: "🧘", color: "accent-emerald-600" },
          ].map(dim => (
            <div key={dim.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-zinc-600 flex items-center gap-1.5">
                  <span className="text-sm">{dim.emoji}</span>
                  {dim.label}
                </span>
                <motion.span
                  key={profile[dim.key]}
                  initial={{ scale: 1.3, color: "#4f46e5" }}
                  animate={{ scale: 1, color: "#4f46e5" }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-black text-indigo-600"
                >
                  {profile[dim.key]}
                </motion.span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={profile[dim.key]}
                onChange={e => updateProfile(dim.key, Number(e.target.value))}
                className={`w-full ${dim.color}`}
              />
            </div>
          ))}
          <p className="text-[10px] text-zinc-400 text-center mt-3 leading-relaxed">
            💡 这些权重将影响职业推荐和匹配度排序，<br/>试玩结果也会自动校准你的偏好
          </p>
        </div>
      )
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
            className="p-1.5 hover:bg-stone-100 text-zinc-700 rounded-full transition border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-black text-zinc-800">现实档案馆</h2>
            <p className="text-[10px] text-zinc-400">建立你的现实坐标</p>
          </div>
          {/* Step indicator with connecting lines */}
          <div className="flex items-center gap-0.5">
            {steps.map((_, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <motion.div
                    className="h-0.5 w-3 rounded-full"
                    initial={{ backgroundColor: "#e7e5e4" }}
                    animate={{ backgroundColor: idx <= step ? "#4f46e5" : "#e7e5e4" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{
                    width: idx === step ? 16 : 6,
                    backgroundColor: idx === step ? "#4f46e5" : idx < step ? "#a5b4fc" : "#e7e5e4",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-black text-zinc-900">{currentStep.title}</h3>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5 mb-5">{currentStep.subtitle}</p>
          {currentStep.content}
        </motion.div>
      </div>

      {/* Bottom Action */}
      <div className="px-5 py-4 bg-white border-t border-stone-100 sticky bottom-0">
        {saved ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-black">档案已保存！正在跳转...</span>
          </motion.div>
        ) : (
          <button
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleSave()}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? (
              <>下一步 <ArrowLeft className="w-3.5 h-3.5 rotate-180" /></>
            ) : (
              <>完成建档 <Sparkles className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
