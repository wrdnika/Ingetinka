<template>
  <header class="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-white/10 bg-gray-900 relative z-20">
    <div class="flex items-center gap-4">
      <!-- Hamburger Menu for Mobile -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden text-white/40 hover:text-white transition-colors"
        aria-label="Toggle Menu"
      >
        <Menu class="w-5 h-5" />
      </button>

      <h2 class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] hidden sm:block">
        {{ $route.path === '/' ? $t('header.dashboard') : ($route.path === '/calendar' ? $t('sidebar.calendar') : $t('header.tracker')) }}
      </h2>
    </div>

    <div class="flex items-center gap-4">
      <CalendarStatus v-if="session" />
      
      <div v-if="session" class="relative">
        <button @click="toggleProfile" class="flex items-center gap-3 focus:outline-none group">
          <p class="hidden md:block text-xs font-medium text-white/40 group-hover:text-white/70 transition-colors tracking-wide">
            {{ session.user.user_metadata.full_name || 'User' }}
          </p>
          <!-- avatar with border line -->
          <div class="relative border border-white/20 group-hover:border-cyan-400/50 transition-all rounded-full p-0.5">
            <img :src="session.user.user_metadata.avatar_url" alt="Avatar" class="w-7 h-7 rounded-full object-cover" referrerpolicy="no-referrer" />
            <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-gray-900"></div>
          </div>
        </button>

        <!-- Dropdown -->
        <div
          v-if="isProfileOpen"
          @mouseleave="closeProfile"
          class="absolute right-0 mt-2 w-52 bg-gray-900 border border-white/10 shadow-xl z-50 overflow-hidden"
        >
          <div class="py-1">
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group uppercase tracking-widest">
              <Settings class="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>{{ $t('header.settings') }}</span>
            </button>
            <button @click="openAbout" class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group uppercase tracking-widest">
              <Info class="w-3.5 h-3.5" />
              <span>{{ $t('header.about') }}</span>
            </button>

            <div class="h-px bg-white/10 my-1"></div>

            <button @click="toggleLanguage" class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group uppercase tracking-widest">
              <Globe class="w-3.5 h-3.5" />
              <span class="flex-grow text-left">{{ $t('header.language') }}</span>
              <span class="font-bold text-[10px] px-1.5 py-0.5 border border-white/20 text-white/40">
                {{ locale === 'id' ? 'ID' : 'EN' }}
              </span>
            </button>

            <div class="h-px bg-white/10 my-1"></div>

            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors uppercase tracking-widest">
              <LogOut class="w-3.5 h-3.5" />
              {{ $t('header.signOut') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- About Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isAboutOpen" class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click.self="isAboutOpen = false">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-md bg-gray-900 border border-white/10 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="relative px-6 pt-6 pb-4 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                <Bell class="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 class="text-sm font-bold text-white tracking-wide">Ingetinka</h2>
                <p class="text-[10px] text-white/30 uppercase tracking-widest">v1.0.0</p>
              </div>
            </div>
            <button @click="isAboutOpen = false" class="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-5">
            <p class="text-xs text-white/60 leading-relaxed">
              <span class="text-white font-medium">Ingetinka</span> adalah aplikasi manajemen reminder & task yang dirancang untuk membantu kamu mengorganisir jadwal, tenggat waktu, dan langganan dalam satu tempat yang rapi.
            </p>

            <div>
              <p class="text-[10px] uppercase tracking-widest text-white/30 mb-2.5">Fitur Utama</p>
              <ul class="space-y-2">
                <li v-for="f in features" :key="f.label" class="flex items-start gap-2.5">
                  <component :is="f.icon" class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" :class="f.color" />
                  <span class="text-xs text-white/50">{{ f.label }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-3 border-t border-white/10">
              <p class="text-[10px] uppercase tracking-widest text-white/30 mb-2">Tech Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tech in techStack" :key="tech" class="text-[10px] px-2 py-0.5 border border-white/15 text-white/40 uppercase tracking-wider">{{ tech }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 bg-white/2 border-t border-white/10">
            <p class="text-[10px] text-white/20 text-center">Dibuat dengan ❤️ — Ingetinka &copy; {{ new Date().getFullYear() }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { Settings, Info, LogOut, Globe, Menu, Bell, X, CalendarDays, CreditCard, CheckSquare, BarChart2 } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CalendarStatus from '../calendar/CalendarStatus.vue';

const props = defineProps({
  session: Object,
  handleLogout: Function,
});

defineEmits(['toggle-sidebar']);

const { locale } = useI18n();
const isProfileOpen = ref(false);
const isAboutOpen = ref(false);

const openAbout = () => {
  isProfileOpen.value = false;
  isAboutOpen.value = true;
};

const features = [
  { icon: CheckSquare, color: 'text-cyan-400',   label: 'Manajemen task & reminder harian dengan prioritas' },
  { icon: CalendarDays, color: 'text-violet-400', label: 'Integrasi Google Calendar untuk sinkronisasi jadwal' },
  { icon: CreditCard,   color: 'text-emerald-400', label: 'Pelacak langganan & tagihan bulanan' },
  { icon: BarChart2,    color: 'text-amber-400',   label: 'Analitik finansial & visualisasi pengeluaran' },
];

const techStack = ['Vue 3', 'Supabase', 'Google API', 'Chart.js', 'i18n'];

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value;
};

const closeProfile = () => {
  isProfileOpen.value = false;
};

const toggleLanguage = () => {
  locale.value = locale.value === 'id' ? 'en' : 'id';
  localStorage.setItem('language', locale.value);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
