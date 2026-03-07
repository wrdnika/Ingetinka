<template>
  <button
    @click="openModal"
    class="flex items-center gap-2 px-3 py-2 border border-cyan-400/40 text-cyan-400 btn-notch hover:bg-cyan-400/8 hover:border-cyan-400/70 transition-all duration-200"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    <span class="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">{{ $t('todo.create') }}</span>
  </button>
</template>

<script setup>
const emit = defineEmits(['open-modal']);

const openModal = () => {
  emit('open-modal');
};
</script>
