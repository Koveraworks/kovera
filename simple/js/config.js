/*
 * Waitlist storage (Supabase). Set both values to save sign-ups, or leave
 * both empty to run the forms in demo mode (nothing is saved).
 *
 * Use the project URL and the *publishable* key (sb_publishable_...), the same
 * pair as VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in the React build.
 * The publishable key is meant to be public; never put the secret key here.
 */
K.config = {
  supabaseUrl: '',
  supabaseAnonKey: '',
};
