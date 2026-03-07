<template>
  <div
    class="px-4 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-150 group"
    :class="{ 'opacity-50': task.completed }"
  >
    <!-- Main Row -->
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <button
        @click="toggleComplete"
        class="flex-shrink-0 mt-0.5"
      >
        <div
          class="w-4 h-4 border transition-all duration-200 flex items-center justify-center"
          :class="task.completed
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-white/20 hover:border-white/50'"
        >
          <Check v-if="task.completed" class="w-2.5 h-2.5 text-cyan-400" />
        </div>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <span
            :class="{
              'line-through text-white/25': task.completed,
              'text-white/90': !task.completed,
            }"
            class="text-sm font-light leading-snug break-words"
          >
            {{ task.text }}
          </span>

          <!-- Badges right -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span
              :class="priorityColorClass(task.priority)"
              class="text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest"
            >
              {{ $t('todo.form.priority' + task.priority) }}
            </span>
          </div>
        </div>

        <!-- Sub info row -->
        <div class="flex items-center gap-3 mt-1.5 flex-wrap">
          <span class="text-[10px] text-white/30 flex items-center gap-1">
            <Calendar class="w-2.5 h-2.5" />
            {{ formatDeadline(task.deadline) }}
          </span>
          <span
            v-if="task.categories"
            class="text-[10px] font-medium px-1.5 py-0.5 text-white/60"
            :style="task.categories.color ? { borderLeft: `2px solid ${task.categories.color}`, paddingLeft: '6px' } : {}"
          >
            {{ task.categories.name }}
          </span>
          <span v-if="task.notes" class="text-[10px] text-white/25 truncate max-w-xs">{{ task.notes }}</span>
        </div>
      </div>

      <!-- Actions (visible on hover) -->
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <button
          @click="editTask"
          class="text-white/30 hover:text-cyan-400 transition-colors"
        >
          <Edit2 class="w-3.5 h-3.5" />
        </button>
        <button
          @click="removeTask"
          class="text-white/30 hover:text-red-400 transition-colors"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <teleport to="body">
      <div
        v-if="editing"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-gray-900 border border-white/10 p-6 w-full max-w-md">
          <!-- Modal header line -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 class="text-xs font-bold text-white uppercase tracking-widest">{{ $t('todo.editTitle') }}</h2>
            <button @click="editing = false" class="text-white/30 hover:text-white transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3">
            <input
              v-model="editText"
              class="w-full p-3 bg-transparent border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
              :placeholder="$t('todo.form.placeholder')"
            />
            <input
              type="date"
              v-model="editDeadline"
              class="w-full p-3 bg-transparent border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
            <select
              v-model="editPriority"
              class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
            >
              <option value="High" class="bg-gray-900">{{ $t('todo.form.priorityHigh') }}</option>
              <option value="Medium" class="bg-gray-900">{{ $t('todo.form.priorityMedium') }}</option>
              <option value="Low" class="bg-gray-900">{{ $t('todo.form.priorityLow') }}</option>
            </select>
            <select
              v-model="editCategoryId"
              class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
            >
              <option value="" disabled>{{ $t('todo.form.categories') }}</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <textarea
              v-model="editNotes"
              class="w-full p-3 bg-transparent border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              rows="3"
              :placeholder="$t('todo.form.notes')"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
            <button
              @click="editing = false"
              class="px-4 py-2 text-xs text-white/50 border border-white/10 hover:text-white hover:border-white/30 transition-colors uppercase tracking-widest"
            >
              {{ $t('todo.cancel') }}
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 text-xs text-gray-900 bg-cyan-400 hover:bg-cyan-300 transition-colors font-bold uppercase tracking-widest"
            >
              {{ $t('todo.save') }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Check, Edit2, Trash2, Calendar, X } from "lucide-vue-next";
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const props = defineProps(["task", "categories"]);
const emit = defineEmits(["toggle", "remove", "update"]);

const editing = ref(false);
const editText = ref(props.task.text);
const editDeadline = ref(props.task.deadline);
const editPriority = ref(props.task.priority);
const editCategoryId = ref(props.task.categories?.id || props.task.category_id || "");
const editNotes = ref(props.task.notes);

const toggleComplete = () => emit("toggle", props.task.id);
const removeTask = () => emit("remove", props.task.id);

const editTask = () => {
  editText.value = props.task.text;
  editDeadline.value = props.task.deadline;
  editPriority.value = props.task.priority;
  editCategoryId.value = props.task.categories?.id || props.task.category_id || "";
  editNotes.value = props.task.notes;
  editing.value = true;
};

const saveEdit = () => {
  emit("update", {
    ...props.task,
    text: editText.value,
    deadline: editDeadline.value,
    priority: editPriority.value,
    category_id: editCategoryId.value,
    notes: editNotes.value,
  });
  editing.value = false;
};

const priorityColorClass = (priority) => {
  return priority === "High"
    ? "border border-red-500/40 text-red-400"
    : priority === "Medium"
    ? "border border-yellow-500/40 text-yellow-400"
    : "border border-green-500/40 text-green-400";
};

const formatDeadline = (deadline) => {
  return new Date(deadline).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
