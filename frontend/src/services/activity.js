import { supabase } from './supabase';

export const getActivityLog = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getActivityByType = async (userId, actionType, limit = 20) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', actionType)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getRecentlyViewed = async (userId, itemType = null, limit = 10) => {
  let query = supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', 'viewed')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (itemType) {
    query = query.eq('item_type', itemType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getActivityStats = async (userId) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('action_type')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total: data.length,
    viewed: 0,
    saved: 0,
    applied: 0,
    compared: 0,
    searched: 0,
  };

  data.forEach(activity => {
    if (stats[activity.action_type] !== undefined) {
      stats[activity.action_type]++;
    }
  });

  return stats;
};
