import { ref, onMounted, computed } from 'vue';
import { supabase } from '../services/supabase';

const session = ref(null);
const isGoogleExpired = ref(false);

export function useAuth() {

  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
  };

  const handleLogin = async () => {
    isGoogleExpired.value = false;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
        queryParams: {
          access_type: 'offline',
          // prompt: 'consent', // Use consent to ensure we get a refresh token in Supabase
        },
      },
    });
  };

  const reconnectGoogle = async () => {
    // Similar to handleLogin but can be used specifically for reconnection
    await handleLogin();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };



  const checkGoogleConnection = async () => {
    if (!session.value) return;
    
    const token = session.value.provider_token;
    if (!token) {
      isGoogleExpired.value = true;
      return;
    }

    try {
      // Lightweight check to see if token is valid
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary?fields=id', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          isGoogleExpired.value = true;
        }
      } else {
        isGoogleExpired.value = false;
      }
    } catch (err) {
      console.error('Error checking Google connection:', err);
    }
  };

  onMounted(async () => {
    await fetchSession();
    if (session.value) {
      await checkGoogleConnection();
    }
    supabase.auth.onAuthStateChange(async (_, _session) => {
      session.value = _session;
      if (_session) {
        await checkGoogleConnection();
      }
    });
  });

  const getGoogleToken = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.provider_token;
    if (!token) {
      isGoogleExpired.value = true;
    }
    return token;
  };

  const setGoogleExpired = (status = true) => {
    isGoogleExpired.value = status;
  };

  return {
    session,
    isGoogleExpired,
    handleLogin,
    handleLogout,
    getGoogleToken,
    reconnectGoogle,
    setGoogleExpired,
    checkGoogleConnection,
  };
}
