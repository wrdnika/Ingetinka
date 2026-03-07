<template>
  <div v-if="show" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div class="bg-gray-900 border border-white/10 w-full max-w-lg shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 class="text-[10px] font-bold text-white uppercase tracking-widest">{{ title || 'Modal' }}</h2>
        <button @click="close" class="text-white/30 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <!-- Body -->
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>
