<template>
  <aside 
    class="sidebar fixed lg:relative h-full w-56 bg-gray-900 border-r border-white/10 transition-all duration-300 z-30 flex flex-col"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Branding -->
    <div class="h-12 px-4 border-b border-white/10 flex items-center gap-3">
      <img src="/INGETINKA-white.png" alt="Logo" class="w-18 object-contain opacity-90" />
      <!-- <h1 class="text-[11px] font-bold text-white uppercase tracking-[0.3em]">Ingetinka</h1> -->
    </div>
    
    <!-- Navigation -->
    <nav class="flex-grow overflow-y-auto custom-scrollbar space-y-1 py-2">
      <router-link
        to="/calendar"
        @click="$emit('close')"
        class="nav-link flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-white transition-all duration-200 group relative"
        active-class="nav-link-active"
      >
        <div class="w-px h-full absolute left-0 top-0 accent-bar"></div>
        <Calendar class="w-4 h-4 flex-shrink-0" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">{{ $t('sidebar.calendar') }}</span>
      </router-link>

      <router-link
      to="/"
      @click="$emit('close')"
      class="nav-link flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-white transition-all duration-200 group relative"
      active-class="nav-link-active"
      >
        <div class="w-px h-full absolute left-0 top-0 accent-bar"></div>
        <ListTodo class="w-4 h-4 flex-shrink-0" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">{{ $t('sidebar.taskList') }}</span>
      </router-link>

      <router-link
        to="/subscriptions"
        @click="$emit('close')"
        class="nav-link flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-white transition-all duration-200 group relative"
        active-class="nav-link-active"
      >
        <div class="w-px h-full absolute left-0 top-0 accent-bar"></div>
        <CreditCard class="w-4 h-4 flex-shrink-0" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em]">{{ $t('sidebar.subscriptions') }}</span>
      </router-link>
    </nav>

    <!-- Footer line -->
    <div class="px-5 py-4 border-t border-white/10">
      <p class="text-[10px] text-white/20 uppercase tracking-widest">by Ingetinka</p>
    </div>
  </aside>
</template>

<script setup>
import { ListTodo, CreditCard, Calendar } from 'lucide-vue-next';

defineProps({
  session: Object,
  isOpen: Boolean
});

defineEmits(['close']);
</script>

<style scoped>
.nav-link .accent-bar {
  background: transparent;
  transition: background 0.2s;
}

.nav-link-active {
  color: rgb(34 211 238) !important;
  background: rgba(34, 211, 238, 0.04);
}

.nav-link-active .accent-bar {
  background: rgb(34 211 238);
}

.nav-link:hover .accent-bar {
  background: rgba(255, 255, 255, 0.2);
}
</style>
