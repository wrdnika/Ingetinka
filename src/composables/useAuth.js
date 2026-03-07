import { ref, onMounted } from 'vue';
import { supabase } from '../services/supabase';

export function useAuth() {
  const session = ref(null);

  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };



  onMounted(() => {
    fetchSession();
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session;
    });
  });

  const getGoogleToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.provider_token;
  };

  return {
    session,
    handleLogin,
    handleLogout,
    getGoogleToken,

  };
}
