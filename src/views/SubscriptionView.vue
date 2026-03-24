<template>
  <div class="h-full flex flex-col">
    <!-- Tab Bar -->
    <div class="flex-shrink-0 flex items-center gap-1 px-4 pt-3 border-b border-white/10 bg-gray-900/50">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
        :class="activeTab === tab.id ? 'text-cyan-400' : 'text-white/30 hover:text-white/60'"
      >
        <component :is="tab.icon" class="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        {{ tab.label }}
        <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-t"></span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-grow overflow-hidden relative">
      <SubscriptionList v-if="activeTab === 'list'" :session="session" />
      <FinancialAnalytics v-else-if="activeTab === 'analytics'" :session="session" />
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import { CreditCard, BarChart2 } from 'lucide-vue-next';
import SubscriptionList from '../components/subscription/SubscriptionList.vue';
import FinancialAnalytics from '../components/subscription/FinancialAnalytics.vue';

const props = defineProps({
  session: Object
});

const tabs = [
  { id: 'list',      label: 'Langganan',  icon: markRaw(CreditCard) },
  { id: 'analytics', label: 'Analitik',   icon: markRaw(BarChart2) },
];

const activeTab = ref('list');
</script>
