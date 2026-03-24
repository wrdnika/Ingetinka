<template>
  <Transition name="slide-down">
    <div v-if="session && isGoogleExpired" class="bg-red-500 text-white py-2 px-4 shadow-lg z-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-1 bg-white/20 rounded-md">
          <CalendarOff class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest">Koneksi Kalender Terputus</p>
          <p class="text-[10px] opacity-90 tracking-wide">Beberapa fitur mungkin tidak berfungsi hingga Anda menghubungkan ulang.</p>
        </div>
      </div>
      
      <button 
        @click="reconnectGoogle"
        class="flex items-center gap-2 px-4 py-1.5 bg-white text-red-600 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-sm"
      >
        <RefreshCw class="w-3 h-3" />
        Hubungkan Sekarang
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { CalendarOff, RefreshCw } from 'lucide-vue-next';
import { useAuth } from '../../composables/useAuth';

const { session, isGoogleExpired, reconnectGoogle } = useAuth();
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
