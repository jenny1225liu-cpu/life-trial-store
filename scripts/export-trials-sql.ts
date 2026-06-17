/**
 * 将 data.ts 中的副本数据导出为 Supabase 种子 SQL
 * 运行：npx tsx scripts/export-trials-sql.ts > supabase/migrations/003_seed_trials.sql
 */
import { CUSTOM_TRIALS } from "../src/data";

function escapeSql(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function toSqlText(str: string): string {
  return `'${escapeSql(str)}'`;
}

function toJsonb(obj: unknown): string {
  const json = JSON.stringify(obj);
  return `'${escapeSql(json)}'::jsonb`;
}

const values = CUSTOM_TRIALS.map((trial, index) => {
  return `(${toSqlText(trial.id)}, ${index + 1}, ${toSqlText(trial.title)}, ${toSqlText(trial.subtitle)}, ${toSqlText(trial.career)}, ${toSqlText(trial.city)}, ${toSqlText(trial.lifestyle)}, ${toSqlText(trial.vibe)}, ${toSqlText(trial.duration)}, ${toSqlText(trial.coverImage)}, ${trial.difficulty}, ${trial.freedom}, ${trial.connection}, ${trial.wealth}, ${trial.peace}, ${toJsonb(trial.scenarios)})`;
});

const sql = `-- ============================================
-- 人生试玩店 - 种子数据：${CUSTOM_TRIALS.length}个职业副本
-- 由 scripts/export-trials-sql.ts 自动生成
-- ============================================

INSERT INTO trials (id, sort_order, title, subtitle, career, city, lifestyle, vibe, duration, cover_image, difficulty, freedom, connection, wealth, peace, scenarios) VALUES

${values.join(",\n\n")}

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  career = EXCLUDED.career,
  city = EXCLUDED.city,
  lifestyle = EXCLUDED.lifestyle,
  vibe = EXCLUDED.vibe,
  duration = EXCLUDED.duration,
  cover_image = EXCLUDED.cover_image,
  difficulty = EXCLUDED.difficulty,
  freedom = EXCLUDED.freedom,
  connection = EXCLUDED.connection,
  wealth = EXCLUDED.wealth,
  peace = EXCLUDED.peace,
  scenarios = EXCLUDED.scenarios,
  sort_order = EXCLUDED.sort_order;
`;

console.log(sql);
