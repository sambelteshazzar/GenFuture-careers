import { supabase } from './supabase';
import { logActivity } from './bookmarks';

export const getApplications = async (userId, status = null) => {
  let query = supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createApplication = async (userId, universityId, universityName, courseName = null, deadline = null) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      university_id: universityId,
      university_name: universityName,
      course_name: courseName,
      status: 'planning',
      deadline: deadline,
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity(userId, 'applied', 'university', universityId, universityName, { course: courseName });

  return data;
};

export const updateApplicationStatus = async (applicationId, status, notes = null) => {
  const updates = { status };
  if (notes !== null) {
    updates.notes = notes;
  }

  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateApplication = async (applicationId, updates) => {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteApplication = async (applicationId) => {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId);

  if (error) throw error;
};

export const getApplicationStats = async (userId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('status')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total: data.length,
    planning: 0,
    applying: 0,
    submitted: 0,
    accepted: 0,
    rejected: 0,
    waitlisted: 0,
  };

  data.forEach(app => {
    if (stats[app.status] !== undefined) {
      stats[app.status]++;
    }
  });

  return stats;
};
