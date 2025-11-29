import { supabase } from './supabase';

export const getBookmarks = async (userId, itemType = null) => {
  let query = supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (itemType) {
    query = query.eq('item_type', itemType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const addBookmark = async (userId, itemType, itemId, itemName, notes = null) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
      item_name: itemName,
      notes: notes,
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity(userId, 'saved', itemType, itemId, itemName);

  return data;
};

export const removeBookmark = async (userId, itemType, itemId) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId);

  if (error) throw error;
};

export const isBookmarked = async (userId, itemType, itemId) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};

export const updateBookmarkNotes = async (bookmarkId, notes) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .update({ notes })
    .eq('id', bookmarkId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const logActivity = async (userId, actionType, itemType, itemId = null, itemName = null, metadata = {}) => {
  const { error } = await supabase
    .from('activity_log')
    .insert({
      user_id: userId,
      action_type: actionType,
      item_type: itemType,
      item_id: itemId,
      item_name: itemName,
      metadata: metadata,
    });

  if (error) console.error('Activity log error:', error);
};
