import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// State, city and area are saved in their own columns. state is the English
// state name and city a district from the same list as the form
// (src/data/districts), which the database checks.
function location(data) {
  return {
    state: data.state,
    city: data.city,
    area: data.area || null,
  };
}

/**
 * Register business interest in Supabase or fallback mock
 */
export async function submitBusinessRegistration(data) {
  if (!isSupabaseConfigured) {
    console.warn('[Kovera] Supabase credentials not configured. Running in mock demonstration mode.', data);
    // Simulate slight network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, mock: true };
  }

  const { error } = await supabase
    .from('business_registrations')
    .insert([
      {
        business_name: data.businessName,
        contact_name: data.contactName,
        phone_number: data.phone,
        shop_type: data.shopType,
        ...location(data),
      },
    ]);

  if (error) {
    console.error('[Kovera] Failed to submit business registration:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Register worker interest in Supabase or fallback mock
 */
export async function submitWorkerRegistration(data) {
  if (!isSupabaseConfigured) {
    console.warn('[Kovera] Supabase credentials not configured. Running in mock demonstration mode.', data);
    // Simulate slight network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, mock: true };
  }

  const { error } = await supabase
    .from('worker_registrations')
    .insert([
      {
        full_name: data.fullName,
        phone_number: data.phone,
        ...location(data),
      },
    ]);

  if (error) {
    console.error('[Kovera] Failed to submit worker registration:', error);
    throw error;
  }

  return { success: true };
}
