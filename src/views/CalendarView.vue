<template>
  <div class="h-full flex flex-col">
    <!-- Header Page -->
    <div class="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 p-4 md:p-6 gap-4 animate-fade-in delay-100">
      <div class="flex items-baseline gap-2">
        <!-- <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1 hidden md:block">Google</p> -->
        <span class="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {{ $t('sidebar.calendar') }}
        </span>
      </div>

      <div class="flex items-center justify-between md:justify-end gap-3" v-if="token">
        <div class="flex items-center gap-2">
          <button @click="prevMonth" class="p-2 border border-white/10 btn-notch text-white/40 hover:text-white hover:border-white/30 transition-colors" title="Bulan Sebelumnya">
            <ChevronLeft class="w-4 h-4"/>
          </button>
          <div class="text-sm md:text-base font-bold text-white min-w-[120px] md:min-w-[140px] text-center capitalize tracking-wide" style="font-variant-numeric: tabular-nums;">
            {{ currentMonthName }} {{ currentDate.getFullYear() }}
          </div>
          <button @click="nextMonth" class="p-2 border border-white/10 btn-notch text-white/40 hover:text-white hover:border-white/30 transition-colors" title="Bulan Berikutnya">
            <ChevronRight class="w-4 h-4"/>
          </button>
        </div>
        <button @click="goToToday" class="px-2 py-1 border border-cyan-400/40 text-cyan-400 btn-notch hover:bg-cyan-400/10 hover:border-cyan-400/70 transition-colors">
          <span class="text-[10px] font-bold uppercase tracking-widest">Hari Ini</span>
        </button>
      </div>
    </div>

    <div v-if="error" class="flex-grow flex flex-col items-center justify-center animate-fade-in delay-200">
      <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle class="w-8 h-8 text-red-400" />
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Gagal Memuat Kalender</h3>
      <p class="text-white/50 text-center max-w-md mb-6">{{ error }}</p>
      <button @click="fetchEvents" class="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors font-medium">
        Coba Lagi
      </button>
    </div>

    <div v-else-if="!token && !loading" class="flex-grow flex flex-col items-center justify-center animate-fade-in delay-200">
      <div class="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
        <Calendar class="w-8 h-8 text-cyan-400" />
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Akses Kalender Diperlukan</h3>
      <p class="text-white/50 text-center max-w-md mb-6">Silakan login ulang dengan Google untuk memberikan izin akses kalender.</p>
      <button @click="handleLogin" class="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors font-medium cursor-pointer">
        Login dengan Google
      </button>
    </div>

    <!-- Google Calendar Grid View -->
    <div v-else class="flex-grow flex flex-col min-h-0 bg-transparent animate-fade-in delay-300 relative">
      <!-- Days header -->
      <div class="grid grid-cols-7 border-b border-white/10 bg-black/40 flex-shrink-0">
        <div v-for="dayName in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="dayName" class="py-2 md:py-3 text-center text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-widest">
          {{ dayName }}
        </div>
      </div>
      
      <!-- Grid cells -->
      <div class="flex-grow grid grid-cols-7 grid-rows-6 min-h-0">
        <div 
          v-for="(day, idx) in calendarGrid" 
          :key="idx"
          class="border-b border-r border-white/10 p-1 transition-colors hover:bg-white/5 flex flex-col relative group"
          :class="[
            idx % 7 === 6 ? 'border-r-0' : '',
            !day.isCurrentMonth ? 'bg-black/10' : ''
          ]"
        >
           <div class="flex justify-center mb-1 mt-0.5">
             <div 
               class="text-xs w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full font-semibold transition-all"
               :class="isToday(day.date) ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]' : (day.isCurrentMonth ? 'text-white/80' : 'text-white/30')"
             >
               {{ day.date.getDate() }}
             </div>
           </div>
           
           <div class="flex-grow overflow-y-auto custom-scrollbar space-y-[2px] md:space-y-1 relative z-10 min-h-0 px-0.5">
             <a 
               v-for="event in eventsByDate[formatDateObj(day.date)] || []" 
               :key="event.id"
               :href="event.htmlLink"
               target="_blank"
               class="block text-[9px] md:text-[11px] leading-tight px-1.5 py-1 rounded-md transition-all w-full text-left truncate cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:z-20 relative group/event"
               :class="getEventClass(event)"
               :title="(event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + ' - ' : '') + (event.summary || '(Tanpa Judul)')"
             >
               <span v-if="event.start.dateTime" class="font-semibold opacity-75 mr-1 tracking-tighter">
                 {{ formatTime(event.start.dateTime) }}
               </span>
               <span class="font-medium">{{ event.summary || '(Tanpa Judul)' }}</span>
             </a>
           </div>
        </div>
      </div>
      
      <!-- Loading overlay during fetch -->
      <div v-if="loading" class="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center transition-opacity duration-300">
        <div class="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <p class="text-cyan-400 font-medium animate-pulse tracking-widest text-sm uppercase">Menyinkronkan...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Calendar, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useAuth } from '../composables/useAuth';

const { getGoogleToken, handleLogin } = useAuth();

const events = ref([]);
const loading = ref(true);
const error = ref(null);
const token = ref(null);
const currentDate = ref(new Date());
let fetchId = 0;

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('id-ID', { month: 'long' });
});

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const calendarGrid = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month); 
  
  const days = [];
  
  // Prev month
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Next month
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return days;
});

const formatDateObj = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const eventsByDate = computed(() => {
  const map = {};
  events.value.forEach(event => {
    let start, end;
    
    if (event.start.date) {
      // All-day event
      start = new Date(event.start.date);
      // For all-day events, the end date is exclusive in Google Calendar API
      // So we subtract 1 day to get the actual last day of the event
      end = new Date(event.end.date);
      end.setDate(end.getDate() - 1);
    } else if (event.start.dateTime) {
      // Timed event
      start = new Date(event.start.dateTime);
      end = new Date(event.end.dateTime);
    } else {
      return;
    }

    // Iterate through each day in the range
    let current = new Date(start);
    // Set current to start of day for comparison
    current.setHours(0, 0, 0, 0);
    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (current <= last) {
      const dateStr = formatDateObj(current);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(event);
      
      // Move to next day
      current.setDate(current.getDate() + 1);
    }
  });
  return map;
});

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const formatTime = (dateTimeStr) => {
  return new Date(dateTimeStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('.', ':');
};

const getEventClass = (event) => {
  // If it's a holiday
  if (event.type === 'holiday') {
    const isPublicHoliday = event.description?.toLowerCase().includes('public holiday') || 
                            event.summary?.toLowerCase().includes('libur') || 
                            !event.summary?.toLowerCase().includes('cuti');
    
    if (isPublicHoliday) {
      return 'bg-red-600/60 text-white border border-red-500 hover:bg-red-500/80 shadow-sm';
    }
    // For Cuti Bersama
    return 'bg-orange-500/60 text-white border border-orange-500 hover:bg-orange-500/80 shadow-sm';
  }

  // If it's an all-day event (only has date)
  if (event.start.date) {
    return 'bg-cyan-600/60 text-white border border-cyan-500 hover:bg-cyan-500/80 shadow-sm';
  }
  // If it has time, make it look more subtle with a dot or left border effect
  return 'bg-white/5 border-l-2 border-l-cyan-500 text-cyan-50 hover:bg-white/10';
};

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};
const goToToday = () => {
  currentDate.value = new Date();
};

const fetchEvents = async () => {
  loading.value = true;
  error.value = null;
  const currentFetchId = ++fetchId;
  
  try {
    token.value = await getGoogleToken();
    if (!token.value) {
      loading.value = false;
      return;
    }

    const grid = calendarGrid.value;
    const timeMin = grid[0].date.toISOString();
    
    const lastDate = new Date(grid[grid.length - 1].date);
    lastDate.setHours(23, 59, 59, 999);
    const timeMax = lastDate.toISOString();

    // Fetch from primary and Indonesian holidays
    const calendarIds = ['primary', 'id.indonesian#holiday@group.v.calendar.google.com'];
    
    const fetchPromises = calendarIds.map(async (calendarId) => {
      try {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=2500&singleEvents=true&orderBy=startTime`, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            token.value = null;
            throw new Error('Sesi kedaluwarsa, silakan login ulang.');
          }
          // If a specific calendar fails (not primary), we can just log and ignore
          if (calendarId !== 'primary') {
            console.warn(`Gagal mengambil data dari kalender: ${calendarId}`);
            return [];
          }
          throw new Error(`Gagal mengambil data dari Google Calendar (${calendarId})`);
        }

        const data = await response.json();
        return (data.items || []).map(item => ({
          ...item,
          type: calendarId === 'primary' ? 'personal' : 'holiday'
        }));
      } catch (err) {
        if (calendarId === 'primary') throw err;
        console.warn(`Error fetching calendar ${calendarId}:`, err);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    if (currentFetchId !== fetchId) return;

    events.value = results.flat();
  } catch (err) {
    if (currentFetchId !== fetchId) return;
    console.error(err);
    error.value = err.message || 'Terjadi kesalahan saat memuat kalender.';
  } finally {
    if (currentFetchId === fetchId) {
      loading.value = false;
    }
  }
};

watch(currentDate, () => {
  fetchEvents();
});

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
