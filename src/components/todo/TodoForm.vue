<template>
  <form @submit.prevent="addTask" class="space-y-3">
    <!-- Task Input -->
    <div>
      <input
        v-model="newTask"
        type="text"
        :placeholder="$t('todo.form.placeholder')"
        class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
        required
      />
    </div>

    <!-- Grid Row: Date + Priority -->
    <div class="grid grid-cols-2 gap-3">
      <input
        v-model="deadline"
        type="date"
        class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
        required
      />
      <div class="relative">
        <select
          v-model="priority"
          class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none pr-8"
        >
          <option value="High" class="bg-gray-900">{{ $t('todo.form.priorityHigh') }}</option>
          <option value="Medium" class="bg-gray-900">{{ $t('todo.form.priorityMedium') }}</option>
          <option value="Low" class="bg-gray-900">{{ $t('todo.form.priorityLow') }}</option>
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none" />
      </div>
    </div>

    <!-- Category Row -->
    <div class="flex gap-2">
      <div class="relative flex-grow">
        <select
          v-model="selectedCategoryId"
          class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none pr-8"
        >
          <option value="" disabled class="bg-gray-900">{{ $t('todo.form.categories') }}</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-gray-900">
            {{ cat.name }}
          </option>
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none" />
      </div>
      <button 
        type="button"
        @click="isCreatingCategory = !isCreatingCategory"
        class="p-3 border border-white/10 btn-notch text-white/40 hover:text-white hover:border-white/30 transition-colors"
        title="Add New Category"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Create Category Mini-Form -->
    <div v-if="isCreatingCategory" class="border border-white/10 p-3 space-y-2">
      <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest">New Category</p>
      <div class="flex gap-2">
        <input 
          v-model="newCategoryName"
          type="text"
          placeholder="Name"
          class="flex-grow p-2 bg-transparent border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
        <input 
          v-model="newCategoryColor"
          type="color"
          class="w-9 h-9 p-1 bg-transparent border border-white/10 cursor-pointer"
          title="Category Color"
        />
        <button 
          type="button"
          @click="handleCreateCategory"
          class="px-3 py-2 bg-cyan-400 text-gray-900 text-xs font-bold uppercase tracking-widest btn-notch hover:bg-cyan-300 transition-colors"
        >
          Save
        </button>
      </div>
    </div>

    <!-- Notes -->
    <textarea
      v-model="notes"
      :placeholder="$t('todo.form.notes')"
      class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
      rows="3"
    ></textarea>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full p-3 bg-cyan-400 text-gray-900 text-xs font-bold uppercase tracking-widest btn-notch hover:bg-cyan-300 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
    >
      <PlusIcon class="w-4 h-4" />
      {{ $t('todo.form.add') }}
    </button>

    <!-- Google Calendar Sync Indicator -->
    <div
      v-if="calendarSyncError"
      class="flex items-center gap-1.5 text-amber-400/80 text-[10px]"
    >
      <CalendarIcon class="w-3 h-3 shrink-0" />
      <span>Gagal sinkron ke Google Calendar — task tetap tersimpan.</span>
    </div>
    <div
      v-else
      class="flex items-center gap-1.5 text-white/30 text-[10px]"
    >
      <CalendarIcon class="w-3 h-3 shrink-0" />
      <span>Task akan disinkronkan ke Google Calendar</span>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { PlusIcon, ChevronDown, CalendarIcon } from "lucide-vue-next";

const props = defineProps({
  categories: Array,
  addCategory: Function,
  calendarSyncError: { type: String, default: null },
});

const newTask = ref("");
const deadline = ref("");
const priority = ref("Medium");
const selectedCategoryId = ref("");
const notes = ref("");
const isDropdownOpen = ref(false);
const isCreatingCategory = ref(false);
const newCategoryName = ref("");
const newCategoryColor = ref("#22d3ee");

const emit = defineEmits(["add"]);

const handleCreateCategory = async () => {
  if (newCategoryName.value.trim() && props.addCategory) {
    const newCat = await props.addCategory(newCategoryName.value, newCategoryColor.value);
    if (newCat) {
      selectedCategoryId.value = newCat.id;
      isCreatingCategory.value = false;
      newCategoryName.value = "";
      newCategoryColor.value = "#22d3ee";
    }
  }
};

const addTask = () => {
  if (newTask.value.trim() !== "" && deadline.value !== "") {
    emit("add", {
      text: newTask.value,
      deadline: deadline.value,
      priority: priority.value,
      category_id: selectedCategoryId.value || null,
      notes: notes.value,
    });
    newTask.value = "";
    deadline.value = "";
    priority.value = "Medium";
    selectedCategoryId.value = "";
    notes.value = "";
  }
};
</script>
