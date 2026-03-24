<template>
  <div v-if="session" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300"
    :class="isGoogleExpired ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'">
    
    <div class="relative flex items-center justify-center">
      <Calendar class="w-3.5 h-3.5" />
      <div v-if="!isGoogleExpired" class="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
      <AlertCircle v-else class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gray-900 text-red-500 rounded-full" />
    </div>

    <div class="flex flex-col">
      <span class="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">
        {{ isGoogleExpired ? 'Kalender Terputus' : 'Kalender Aktif' }}
      </span>
      <button v-if="isGoogleExpired" @click="reconnectGoogle" class="text-[8px] font-bold uppercase tracking-[0.2em] text-white hover:text-red-300 transition-colors text-left underline">
        Hubungkan Ulang
      </button>
      <span v-else class="text-[8px] font-medium opacity-60 tracking-wider">Tersinkronisasi</span>
    </div>
  </div>
</template>

<script setup>
import { Calendar, AlertCircle } from 'lucide-vue-next';
import { useAuth } from '../../composables/useAuth';

const { session, isGoogleExpired, reconnectGoogle } = useAuth();
</script>
