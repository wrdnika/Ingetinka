<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Judul Event</label>
      <input
        v-model="form.summary"
        type="text"
        placeholder="Apa yang akan dilakukan?"
        class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
        required
      />
    </div>

    <div class="flex items-center gap-2 mb-2">
      <input 
        v-model="form.isAllDay" 
        type="checkbox" 
        id="allDay"
        class="w-4 h-4 rounded border-white/10 bg-gray-900 text-cyan-500 focus:ring-cyan-500/20"
      />
      <label for="allDay" class="text-xs text-white/60 cursor-pointer">Sepanjang Hari</label>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Mulai</label>
        <input
          v-model="form.startDate"
          type="date"
          class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
          required
        />
        <input
          v-if="!form.isAllDay"
          v-model="form.startTime"
          type="time"
          class="w-full mt-2 p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
          :required="!form.isAllDay"
        />
      </div>
      <div>
        <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Selesai</label>
        <input
          v-model="form.endDate"
          type="date"
          class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
          required
        />
        <input
          v-if="!form.isAllDay"
          v-model="form.endTime"
          type="time"
          class="w-full mt-2 p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
          :required="!form.isAllDay"
        />
      </div>
    </div>

    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Deskripsi / Catatan</label>
      <textarea
        v-model="form.description"
        placeholder="Tambahkan detail..."
        class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
        rows="3"
      ></textarea>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        v-if="initialData?.id"
        type="button"
        @click="$emit('delete', initialData.id)"
        class="flex-1 p-3 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest btn-notch hover:bg-red-500/10 transition-colors"
      >
        Hapus
      </button>
      <button
        type="submit"
        class="flex-[2] p-3 bg-cyan-400 text-gray-900 text-[10px] font-bold uppercase tracking-widest btn-notch hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        {{ loading ? 'Menyimpan...' : (initialData?.id ? 'Simpan Perubahan' : 'Buat Event') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  loading: Boolean
});

const emit = defineEmits(['save', 'delete']);

const form = ref({
  summary: '',
  description: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '10:00',
  isAllDay: false
});

const initForm = () => {
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    const data = props.initialData;
    form.value.summary = data.summary || '';
    form.value.description = data.description || '';
    
    if (data.start?.date) {
      form.value.startDate = data.start.date;
      form.value.isAllDay = true;
      // End date for all-day is exclusive in Google API, subtract 1 day for UI
      const d = new Date(data.end.date);
      d.setDate(d.getDate() - 1);
      form.value.endDate = d.toISOString().split('T')[0];
    } else if (data.start?.dateTime) {
      const start = new Date(data.start.dateTime);
      const end = new Date(data.end.dateTime);
      form.value.startDate = start.toISOString().split('T')[0];
      form.value.startTime = start.toTimeString().slice(0, 5);
      form.value.endDate = end.toISOString().split('T')[0];
      form.value.endTime = end.toTimeString().slice(0, 5);
      form.value.isAllDay = false;
    }
  } else {
    // Default for new event
    const now = new Date();
    form.value.startDate = now.toISOString().split('T')[0];
    form.value.endDate = now.toISOString().split('T')[0];
  }
};

onMounted(initForm);

watch(() => props.initialData, initForm, { deep: true });

// Auto-adjust end date if start date is moved beyond it
watch(() => form.value.startDate, (newVal) => {
  if (form.value.endDate < newVal) {
    form.value.endDate = newVal;
  }
});

const handleSubmit = () => {
  const eventData = {
    summary: form.value.summary,
    description: form.value.description,
  };

  if (form.value.isAllDay) {
    eventData.start = { date: form.value.startDate };
    // End date must be the next day for exclusive Google API
    const end = new Date(form.value.endDate);
    end.setDate(end.getDate() + 1);
    eventData.end = { date: end.toISOString().split('T')[0] };
  } else {
    const startDateTime = new Date(`${form.value.startDate}T${form.value.startTime}:00`);
    const endDateTime = new Date(`${form.value.endDate}T${form.value.endTime}:00`);
    eventData.start = { dateTime: startDateTime.toISOString() };
    eventData.end = { dateTime: endDateTime.toISOString() };
  }

  emit('save', eventData);
};
</script>
