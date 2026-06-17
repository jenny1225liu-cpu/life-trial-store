# 人生试玩店 - 项目长期记忆

## 项目架构
- React 19 + Vite + Tailwind CSS 4 + Motion + Lucide Icons
- React Router DOM (HashRouter) 多页面导航
- Express server (dev) + Vercel Serverless (prod)
- Supabase (PostgreSQL + RLS + Realtime)
- Gemini REST API + OpenAI REST API (无SDK依赖，纯fetch)
- localStorage 作为离线 fallback

## 页面路由
- `/` → 首页 (HomePage)
- `/trial` → 人生试玩店 (App.tsx - 原有试玩流程)
- `/profile` → 现实档案馆 (ProfilePage)
- `/map` → 职业地图中心 (CareerMapPage)
- `/industry/:id` → 行业详情页 (IndustryPage)
- `/job/:id` → 岗位详情页 (JobPage)
- `/favorites` → 岗位候选库 (FavoritesPage)
- `/compare` → 职业对比中心 (ComparePage)
- `/report` → 职业决策报告 (ReportPage)
- AppLayout.tsx: 共享布局 + 底部导航栏

## 环境配置
- Supabase URL: https://bkdvjvqxttvavaufpbao.supabase.co
- AI_PROVIDER=gemini (从中国无法直连，需Vercel海外部署)
- .env.local 加载: dotenv.config({ path: ".env.local" })

## 数据库表
- trial_results, trial_choices, trial_stats, trials: 试玩相关
- leaderboard: 物化视图
- industries: 行业数据 (14个行业)
- jobs: 岗位数据 (15个核心岗位，关联试玩副本)
- cities: 城市数据 (17个城市)
- salary_data: 薪资数据 (岗位×城市×经验等级)
- market_analysis: 市场分析
- risk_assessment: 风险评估
- user_profiles: 用户档案 (现实档案馆)
- job_favorites: 岗位收藏 (候选库)
- compare_history: 对比历史
- career_reports: 职业决策报告

## 重要修复历史
- Supabase URL 从 jennylife → bkdyjvqxtvvavaufpbao → bkdvjvqxttvavaufpbao (正确)
- Gemini SDK require() 在ESM中不工作 → 改用纯REST API fetch
- Gemini API 从中国无法直连 → 添加 _forceFallback 参数
- fallback trialId 不匹配 → 统一为data.ts的15个ID

## 数据层架构
- `src/lib/supabase.ts` - 前端 Supabase 客户端 + TypeScript 类型
- `src/lib/db.ts` - 数据访问层：Supabase 优先 → 本地 mock 降级
- `isDbAvailable()` 缓存检测结果，空表视为不可用
- 收藏/档案：localStorage 为主要存储（后续 Supabase 双写）

## PRD 对应实现状态
- ✅ 人生试玩店 (含行业洞见、职业路径、维度对比)
- ✅ 现实档案馆 (4步引导：学业→城市→薪资→维度偏好)
- ✅ 职业地图中心 (按生活方式/按行业 双视图)
- ✅ 行业详情页 (趋势、技能、企业、关联岗位)
- ✅ 岗位详情页 (维度评分、薪资、技能、风险、关联试玩)
- ✅ 岗位候选库 (收藏/删除/对比入口) ← 接入 localStorage
- ✅ 职业对比中心 (2-3岗位多维对比+小结) ← 接入数据层
- ✅ 职业决策报告 (AI生成+行动建议) ← 接入真实 /api/generate-report API

## 岗位数据
- 前端 LOCAL_JOBS: 61 个岗位，覆盖 14 个行业
- 生活方式分类: 6 类（自由自在/金戈铁马/人情世故/岁月静好/创意无限/济世利他）
- SQL 迁移: 007_expand_jobs.sql 新增 46 岗位 + 薪资/风险/市场分析数据

## API 接口
- `POST /api/map-career` - 试玩映射（Gemini/OpenAI + fallback）
- `POST /api/generate-report` - 职业报告生成（profile+trialResults+favoriteJobs → AI报告）
- `POST /api/save-result` - 保存试玩结果到 Supabase
- `GET /api/results` - 获取试玩历史
- `GET /api/trials` - 获取副本列表
- `GET /api/health` - 健康检查

## UI 组件
- `src/components/Toast.tsx` - 全局 toast 通知（showToast + AnimatePresence）
- 底部导航 5 项：试玩/探索/收藏/对比/我的

## 数据库迁移
- 006_full_migration.sql = 一键迁移（DROP旧表+建表+种子+RLS）
- 需在 Supabase SQL Editor 中手动执行
- 执行后前端自动从 Supabase 拉取数据（无需改代码）
