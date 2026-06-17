import { createClient, RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'

// Supabase 连接配置
// 注意：URL 不应包含 /rest/v1/ 后缀，@supabase/supabase-js 会自动处理
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bkdvjvqxttvavaufpbao.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ksbtkr-LB3iiEI0Xq0zeog_tYYxhGamy"

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// Realtime 订阅工具
// ============================================

/**
 * 订阅 trials 表的变化（新增/修改/删除副本时触发回调）
 * 用法：
 *   const channel = subscribeTrials((payload) => {
 *     console.log("副本数据变了！", payload);
 *     refreshTrials();
 *   });
 *   // 清理：
 *   channel.unsubscribe();
 */
export function subscribeTrials(
  onChange: (payload: { eventType: string; new: any; old: any }) => void
): RealtimeChannel {
  const channel = supabase
    .channel('trials-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'trials' },
      (payload: any) => {
        console.log('[Realtime] Trial changed:', payload.eventType, payload.new?.id);
        onChange(payload);
      }
    )
    .subscribe((status: string) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        console.log('[Realtime] Subscribed to trials table');
      }
      if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
        console.warn('[Realtime] Failed to subscribe to trials');
      }
    });

  return channel;
}

/**
 * 订阅 trial_results 表的变化（新试玩记录、排行榜更新时触发）
 */
export function subscribeResults(
  onChange: (payload: { eventType: string; new: any; old: any }) => void
): RealtimeChannel {
  const channel = supabase
    .channel('results-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'trial_results' },
      (payload: any) => {
        console.log('[Realtime] Result changed:', payload.eventType, payload.new?.id);
        onChange(payload);
      }
    )
    .subscribe((status: string) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        console.log('[Realtime] Subscribed to trial_results table');
      }
      if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
        console.warn('[Realtime] Failed to subscribe to trial_results');
      }
    });

  return channel;
}
