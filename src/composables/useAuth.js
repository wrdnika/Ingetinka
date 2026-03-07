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

  return {
    session,
    handleLogin,
    handleLogout,
  };
}
