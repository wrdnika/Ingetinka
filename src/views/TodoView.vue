<template>
  <div class="h-full flex flex-col">
    <div class="flex-grow overflow-hidden">
      <TodoList
        :tasks="filteredTasks"
        :categories="todoCategories"
        @toggle="toggleTask"
        @remove="removeTask"
        @update="updateTask"
        @search="handleSearch"
        @filter="handleFilter"
        @sort="handleSort"
        @open-modal="showModal = true"
      />
    </div>
    
    <Modal :show="showModal" :title="$t('todo.modalTitle')" @close="showModal = false">
      <TodoForm :categories="todoCategories" :add-category="addCategory" @add="addTask" />
    </Modal>
  </div>
</template>

<script setup>
import { toRef } from 'vue';
import { useTasks } from '../composables/useTasks';
import TodoList from '../components/todo/TodoList.vue';
import Modal from '../components/common/Modal.vue';
import TodoForm from '../components/todo/TodoForm.vue';

const props = defineProps({
  session: Object
});

const {
  filteredTasks,
  todoCategories,
  showModal,
  addTask,
  addCategory,
  toggleTask,
  removeTask,
  updateTask,
  handleSearch,
  handleFilter,
  handleSort,
} = useTasks(toRef(props, 'session'));
</script>
