<template>
  <div class="h-full flex flex-col overflow-y-auto custom-scrollbar">

    <!-- Header -->
    <div class="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 p-4 md:p-6 gap-2 animate-fade-in">
      <div>
        <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">Langganan</p>
        <span class="text-2xl md:text-3xl font-bold text-white tracking-tight">Financial Analytics</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">last updated</span>
        <span class="text-[10px] text-cyan-400 font-mono tracking-wider">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-grow flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>

    <div v-else class="flex-grow p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 content-start">

      <!-- ═══════════════════════════════════════ -->
      <!-- LEFT COLUMN: KPI Cards + Upcoming Bills -->
      <!-- ═══════════════════════════════════════ -->
      <div class="lg:col-span-1 flex flex-col gap-4">

        <!-- Monthly Expense KPI -->
        <div class="bg-white/[0.03] border border-white/10 p-5 animate-fade-in delay-100">
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3">Total Bulanan</p>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl md:text-3xl font-bold text-white tracking-tight">{{ formatPrice(totalMonthly) }}</span>
            <span class="text-white/30 text-xs">/ bulan</span>
          </div>
          <p class="mt-2 text-[11px] text-white/40">dari {{ subscriptions.length }} langganan aktif</p>
        </div>

        <!-- Yearly Expense KPI -->
        <div class="bg-white/[0.03] border border-white/10 p-5 animate-fade-in delay-150">
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3">Proyeksi Tahunan</p>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl md:text-3xl font-bold text-cyan-400 tracking-tight">{{ formatPrice(totalMonthly * 12) }}</span>
            <span class="text-white/30 text-xs">/ tahun</span>
          </div>
          <p class="mt-2 text-[11px] text-white/40">estimasi pengeluaran setahun ke depan</p>
        </div>

        <!-- Upcoming Bills -->
        <div class="bg-white/[0.03] border border-white/10 p-5 flex-grow animate-fade-in delay-200">
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">
            Tagihan 7 Hari ke Depan
          </p>
          <div v-if="upcomingBills.length === 0" class="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle class="w-8 h-8 text-green-400/40 mb-2" />
            <p class="text-white/30 text-xs uppercase tracking-widest">Tidak ada tagihan</p>
          </div>
          <ul v-else class="space-y-3">
            <li
              v-for="bill in upcomingBills"
              :key="bill.id"
              class="flex items-center justify-between gap-3 py-2.5 border-b border-white/[0.06] last:border-0"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: bill.categories?.color || '#22d3ee' }"
                ></div>
                <div class="min-w-0">
                  <p class="text-xs text-white/80 font-medium truncate">{{ bill.name }}</p>
                  <p class="text-[10px] text-white/30">{{ formatBillDate(bill.next_payment_date || bill.first_payment_date) }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-white/90">{{ formatPrice(bill.price) }}</p>
                <span
                  class="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                  :class="getDaysUntilClass(bill.next_payment_date || bill.first_payment_date)"
                >
                  {{ getDaysUntilLabel(bill.next_payment_date || bill.first_payment_date) }}
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <!-- ════════════════════════════════════ -->
      <!-- RIGHT COLUMN: Pie Chart + Categories -->
      <!-- ════════════════════════════════════ -->
      <div class="lg:col-span-2 flex flex-col gap-4">

        <!-- Pie Chart -->
        <div class="bg-white/[0.03] border border-white/10 p-5 animate-fade-in delay-200">
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Pengeluaran per Kategori</p>
          <div v-if="chartData.labels.length === 0" class="flex items-center justify-center h-40">
            <p class="text-white/20 text-xs uppercase tracking-widest">Belum ada data</p>
          </div>
          <div v-else class="flex flex-col md:flex-row items-center gap-6">
            <!-- Canvas -->
            <div class="relative w-52 h-52 flex-shrink-0">
              <canvas ref="pieCanvasRef" width="208" height="208"></canvas>
              <!-- Center label -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p class="text-[10px] text-white/30 uppercase tracking-widest">Bulanan</p>
                <p class="text-base font-bold text-white">{{ formatPrice(totalMonthly) }}</p>
              </div>
            </div>
            <!-- Legend -->
            <ul class="flex-grow space-y-2.5">
              <li
                v-for="(item, i) in categoryBreakdown"
                :key="i"
                class="flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-2.5 h-2.5 rounded-sm flex-shrink-0" :style="{ backgroundColor: item.color }"></div>
                  <span class="text-xs text-white/60 truncate">{{ item.label }}</span>
                </div>
                <div class="text-right flex-shrink-0">
                  <span class="text-xs font-bold text-white/80">{{ formatPrice(item.value) }}</span>
                  <span class="text-[10px] text-white/30 ml-1.5">{{ item.pct }}%</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Per-subscription breakdown table -->
        <div class="bg-white/[0.03] border border-white/10 p-5 flex-grow animate-fade-in delay-300">
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Detail Langganan</p>
          <div class="space-y-2">
            <div
              v-for="sub in subscriptionsSorted"
              :key="sub.id"
              class="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0"
            >
              <div
                class="w-1.5 h-8 rounded-full flex-shrink-0"
                :style="{ backgroundColor: sub.categories?.color || '#22d3ee' }"
              ></div>
              <div class="flex-grow min-w-0">
                <div class="flex items-baseline justify-between gap-2">
                  <p class="text-xs text-white/80 font-medium truncate">{{ sub.name }}</p>
                  <p class="text-xs font-bold text-white/90 flex-shrink-0">{{ formatPrice(toMonthly(sub)) }}</p>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[9px] text-white/30 uppercase tracking-widest">{{ sub.categories?.name || 'Uncategorized' }}</span>
                  <span class="text-[9px] text-white/20">•</span>
                  <span class="text-[9px] text-white/30 capitalize">{{ formatCycle(sub.cycle) }}</span>
                  <!-- Budget bar -->
                  <div class="flex-grow h-0.5 bg-white/5 rounded-full overflow-hidden ml-2">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :style="{ width: getBarWidth(sub) + '%', backgroundColor: sub.categories?.color || '#22d3ee', opacity: 0.7 }"
                    ></div>
                  </div>
                  <span class="text-[9px] text-white/20 flex-shrink-0">{{ getBarWidth(sub) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { CheckCircle } from 'lucide-vue-next';
import { supabase } from '../../services/supabase';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const props = defineProps({
  session: { type: Object, required: true }
});

// ── State ─────────────────────────────────────────────────────────────────────
const subscriptions = ref([]);
const loading = ref(true);
const pieCanvasRef = ref(null);
let chartInstance = null;

// Current time display
const currentTime = ref('');
let clockInterval = null;

const updateClock = () => {
  currentTime.value = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

// ── Supabase Query ─────────────────────────────────────────────────────────────
const fetchSubscriptions = async () => {
  if (!props.session) return;

  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id, name, price, cycle, next_payment_date, first_payment_date, status,
        categories (name, color)
      `)
      .eq('user_id', props.session.user.id)
      .eq('status', 'active')
      .order('price', { ascending: false });

    if (error) throw error;
    subscriptions.value = data || [];
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
  } finally {
    loading.value = false;
  }
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const toMonthly = (sub) => {
  let price = Number(sub.price);
  if (sub.cycle === 'yearly') return price / 12;
  if (sub.cycle === 'weekly') return price * 4;
  return price;
};

const formatPrice = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const formatBillDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatCycle = (cycle) => {
  const map = { monthly: 'Bulanan', yearly: 'Tahunan', weekly: 'Mingguan' };
  return map[cycle] || cycle;
};

const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
};

const getDaysUntilLabel = (dateStr) => {
  const days = getDaysUntil(dateStr);
  if (days === null) return '';
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Besok';
  return `${days} hari`;
};

const getDaysUntilClass = (dateStr) => {
  const days = getDaysUntil(dateStr);
  if (days === null) return '';
  if (days <= 1) return 'bg-red-500/20 text-red-400';
  if (days <= 3) return 'bg-orange-500/20 text-orange-400';
  return 'bg-white/5 text-white/40';
};

const getBarWidth = (sub) => {
  if (totalMonthly.value === 0) return 0;
  return Math.round((toMonthly(sub) / totalMonthly.value) * 100);
};

// ── Computed ───────────────────────────────────────────────────────────────────
const totalMonthly = computed(() =>
  subscriptions.value.reduce((acc, sub) => acc + toMonthly(sub), 0)
);

const subscriptionsSorted = computed(() =>
  [...subscriptions.value].sort((a, b) => toMonthly(b) - toMonthly(a))
);

const upcomingBills = computed(() => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const limit = new Date(today); limit.setDate(today.getDate() + 7);
  return subscriptions.value
    .filter(sub => {
      const dateStr = sub.next_payment_date || sub.first_payment_date;
      if (!dateStr) return false;
      const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
      return d >= today && d <= limit;
    })
    .sort((a, b) => {
      const da = new Date(a.next_payment_date || a.first_payment_date);
      const db = new Date(b.next_payment_date || b.first_payment_date);
      return da - db;
    });
});

// Category aggregation for chart
const CHART_COLORS = [
  '#22d3ee', '#a78bfa', '#f59e0b', '#34d399', '#f472b6',
  '#60a5fa', '#fb923c', '#a3e635', '#e879f9', '#94a3b8'
];

const categoryBreakdown = computed(() => {
  const map = {};
  subscriptions.value.forEach(sub => {
    const catName = sub.categories?.name || 'Uncategorized';
    const catColor = sub.categories?.color;
    if (!map[catName]) map[catName] = { label: catName, value: 0, color: catColor };
    map[catName].value += toMonthly(sub);
  });
  const entries = Object.values(map).sort((a, b) => b.value - a.value);
  // Assign colors if no category color
  entries.forEach((e, i) => {
    if (!e.color) e.color = CHART_COLORS[i % CHART_COLORS.length];
  });
  const total = entries.reduce((acc, e) => acc + e.value, 0);
  return entries.map(e => ({
    ...e,
    pct: total > 0 ? Math.round((e.value / total) * 100) : 0
  }));
});

const chartData = computed(() => ({
  labels: categoryBreakdown.value.map(e => e.label),
  datasets: [{
    data: categoryBreakdown.value.map(e => e.value),
    backgroundColor: categoryBreakdown.value.map(e => e.color + 'cc'),
    borderColor: categoryBreakdown.value.map(e => e.color),
    borderWidth: 1.5,
    hoverOffset: 8,
  }]
}));

// ── Chart.js lifecycle ─────────────────────────────────────────────────────────
const destroyChart = () => {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
};

const renderChart = async () => {
  await nextTick();
  if (!pieCanvasRef.value || chartData.value.labels.length === 0) return;

  destroyChart();

  chartInstance = new Chart(pieCanvasRef.value, {
    type: 'doughnut',
    data: chartData.value,
    options: {
      responsive: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              return ` ${ctx.label}: ${formatPrice(val)} (${categoryBreakdown.value[ctx.dataIndex]?.pct}%)`;
            }
          },
          backgroundColor: 'rgba(15,23,42,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.7)',
          padding: 10,
        }
      },
      animation: { duration: 600, easing: 'easeInOutQuart' }
    }
  });
};

watch(chartData, () => renderChart(), { deep: true });

// ── Mount / Unmount ──────────────────────────────────────────────────────────
onMounted(async () => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
  await fetchSubscriptions();
  await renderChart();
});

onBeforeUnmount(() => {
  destroyChart();
  clearInterval(clockInterval);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;
}
.delay-100 { animation-delay: 100ms; }
.delay-150 { animation-delay: 150ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
</style>
