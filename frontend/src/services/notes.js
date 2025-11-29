import { supabase } from './supabase';

export const getNotes = async (userId, itemType = null, itemId = null) => {
  let query = supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (itemType) {
    query = query.eq('item_type', itemType);
  }

  if (itemId) {
    query = query.eq('item_id', itemId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createNote = async (userId, itemType, itemId, itemName, content) => {
  const { data, error } = await supabase
    .from('user_notes')
    .insert({
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
      item_name: itemName,
      content: content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateNote = async (noteId, content) => {
  const { data, error } = await supabase
    .from('user_notes')
    .update({ content })
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteNote = async (noteId) => {
  const { error } = await supabase
    .from('user_notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
};

export const getGoals = async (userId, completed = null) => {
  let query = supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true, nullsFirst: false });

  if (completed !== null) {
    query = query.eq('completed', completed);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createGoal = async (userId, title, description = null, targetDate = null) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      title: title,
      description: description,
      target_date: targetDate,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGoal = async (goalId, updates) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleGoalCompletion = async (goalId, completed) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({ completed })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGoal = async (goalId) => {
  const { error } = await supabase
    .from('user_goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
};
