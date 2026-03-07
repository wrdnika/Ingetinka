<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex-shrink-0 bg-gray-900 border-b border-white/10">
      <div class="flex items-center gap-2 p-3">
        <!-- Search -->
        <div class="relative flex-grow">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('todo.searchPlaceholder')"
            @input="applySearch"
            class="w-full pl-8 pr-3 py-2 bg-transparent border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>

        <!-- Add Task Button -->
        <button
          @click="openModal"
          class="flex items-center gap-2 px-3 py-2 border border-cyan-400/40 text-cyan-400 btn-notch hover:bg-cyan-400/8 hover:border-cyan-400/70 transition-all duration-200"
        >
          <Plus class="w-3.5 h-3.5" />
          <span class="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">{{ $t('todo.create') }}</span>
        </button>

        <!-- Filter Button -->
        <div class="relative">
          <button
            @click="showFilterOptions = !showFilterOptions"
            class="p-2 border border-white/10 btn-notch text-white/40 hover:text-white hover:border-white/30 transition-colors"
            data-testid="filter-button"
          >
            <Filter class="h-3.5 w-3.5" />
          </button>
          <div v-if="showFilterOptions" class="absolute right-0 mt-1 w-60 bg-gray-900 border border-white/10 shadow-2xl z-20 p-4 space-y-3">
            <div>
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">{{ $t('todo.status') }}</label>
              <select id="status-filter" v-model="filters.status" @change="applyFilters" class="w-full p-2 bg-transparent border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400/50">
                <option value="all" class="bg-gray-900">{{ $t('todo.filterAll') }}</option>
                <option value="active" class="bg-gray-900">{{ $t('todo.filterActive') }}</option>
                <option value="completed" class="bg-gray-900">{{ $t('todo.filterCompleted') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sort Button -->
        <div class="relative">
          <button
            @click="showSortOptions = !showSortOptions"
            class="p-2 border border-white/10 btn-notch text-white/40 hover:text-white hover:border-white/30 transition-colors"
            data-testid="sort-button"
          >
            <ArrowUpDown class="h-3.5 w-3.5" />
          </button>
          <div
            v-if="showSortOptions"
            class="absolute right-0 mt-1 w-44 bg-gray-900 border border-white/10 shadow-2xl z-20"
          >
            <a href="#" @click.prevent="applySort('deadline')" class="flex items-center px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 uppercase tracking-widest">{{ $t('todo.sortDeadline') }}</a>
            <div class="h-px bg-white/5"></div>
            <a href="#" @click.prevent="applySort('priority')" class="flex items-center px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 uppercase tracking-widest">{{ $t('todo.sortPriority') }}</a>
            <div class="h-px bg-white/5"></div>
            <a href="#" @click.prevent="applySort('createdDate')" class="flex items-center px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 uppercase tracking-widest">{{ $t('todo.sortCreated') }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
      <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center h-full text-center p-8">
        <div class="w-12 h-12 border border-white/10 flex items-center justify-center mb-4">
          <ListTodo class="w-5 h-5 text-white/20" />
        </div>
        <p class="text-white/30 text-xs uppercase tracking-widest mb-1">{{ $t('todo.noTasks') }}</p>
        <p class="text-white/20 text-xs">{{ $t('todo.noTasksSub') }}</p>
      </div>
      <TransitionGroup
        v-else
        name="list"
        tag="div"
      >
        <TodoItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :categories="categories"
          @toggle="toggleTask"
          @remove="removeTask"
          @update="updateTask"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ArrowUpDown, Filter, Search, ListTodo } from "lucide-vue-next";
import TodoItem from "./TodoItem.vue";

const props = defineProps(["tasks", "categories"]);
const emit = defineEmits([
  "toggle",
  "remove",
  "update",
  "search",
  "filter",
  "sort",
  "open-modal",
]);

const openModal = () => {
  emit("open-modal");
};

const searchQuery = ref("");
const applySearch = () => {
  emit("search", searchQuery.value);
};

const filters = reactive({
  status: "all",
  priority: "all",
  category: "",
  date: "",
});
const applyFilters = () => {
  emit("filter", { ...filters });
};

const sortBy = ref("deadline");
const showSortOptions = ref(false);
const showFilterOptions = ref(false);
const applySort = (criteria) => {
  sortBy.value = criteria;
  emit("sort", sortBy.value);
  showSortOptions.value = false; 
};

const updateTask = (updatedTask) => {
  emit("update", updatedTask);
};

const toggleTask = (id) => emit("toggle", id);
const removeTask = (id) => emit("remove", id);
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
}
</style>