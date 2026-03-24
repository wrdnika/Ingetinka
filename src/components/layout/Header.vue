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
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group uppercase tracking-widest">
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
</template>

<script setup>
import { ref } from 'vue';
import { Settings, Info, LogOut, Globe, Menu } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import CalendarStatus from '../calendar/CalendarStatus.vue';

const props = defineProps({
  session: Object,
  handleLogout: Function,
});

defineEmits(['toggle-sidebar']);

const { locale } = useI18n();
const isProfileOpen = ref(false);

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
