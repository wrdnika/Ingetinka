import { ref, computed, watchEffect } from 'vue';
import { supabase } from '../services/supabase';
import { createGoogleEvent, findGoogleEventId, updateGoogleEvent, deleteGoogleEvent } from '../services/googleCalendar';

export function useTasks(session) {
  const tasks = ref([]);
  const todoCategories = ref([]);
  const showModal = ref(false);
  const searchQuery = ref('');
  const calendarSyncError = ref(null); // null = no error, string = error message
  const filterCriteria = ref({
    status: 'all',
    priority: 'all',
    category: '',
    date: '',
  });
  const sortBy = ref('deadline');

  const fetchCategories = async () => {
    if (!session.value?.user) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'todo')
      .eq('user_id', session.value.user.id) // Explicitly filter by user
      .order('created_at');

    if (error) console.error('Error fetching categories:', error);
    else todoCategories.value = data || [];
  };

  const fetchTasks = async () => {
    if (!session.value?.user) {
      tasks.value = [];
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .select('*, categories(id, name, color)')
      .eq('user_id', session.value.user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching tasks:', error);
    else tasks.value = data;
  };

  watchEffect(() => {
    if (session.value?.user) {
      fetchCategories();
      fetchTasks();
    }
  });

  const addCategory = async (name, color) => {
    if (!name) return;

    const newCategory = {
      name,
      color,
      type: 'todo',
      user_id: session.value.user.id
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return null;
    } else {
      todoCategories.value.push(data);
      return data;
    }
  };

  const addTask = async ({ text, deadline, priority, category_id, notes }) => {
    console.log('Adding task:', { text, deadline, priority, category_id, notes }); // Debug log
    if (!session.value?.user) {
      console.error('No user session found');
      return;
    }

    const newTask = {
      user_id: session.value.user.id,
      text,
      completed: false,
      deadline,
      priority,
      reminder: true,
      category_id: category_id || null, // Relational column
      notes,
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([newTask])
      .select('*, categories(id, name, color)'); // Select joined data immediately

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    if (data && data.length > 0) {
      tasks.value.unshift(data[0]);
    }
    showModal.value = false;

    // Sync to Google Calendar (non-blocking: task is already saved to Supabase)
    calendarSyncError.value = null;
    const token = session.value?.provider_token;
    try {
      await createGoogleEvent(token, { text, deadline }, data[0].id);
    } catch (calendarErr) {
      console.warn('Google Calendar sync failed (task is still saved):', calendarErr.message);
      calendarSyncError.value = calendarErr.message;
    }
  };

  const toggleTask = async (id) => {
    const taskIndex = tasks.value.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    const newStatus = !tasks.value[taskIndex].completed;
    tasks.value[taskIndex].completed = newStatus;

    const { error } = await supabase
      .from('todos')
      .update({ completed: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error toggling task:', error);
      tasks.value[taskIndex].completed = !newStatus;
    }
  };

  const removeTask = async (id) => {
    const previousTasks = [...tasks.value];
    tasks.value = tasks.value.filter((t) => t.id !== id);

    // Sync to Google Calendar (DELETE)
    const token = session.value?.provider_token;
    const syncDelete = async () => {
      try {
        const gcalId = await findGoogleEventId(token, id);
        if (gcalId) await deleteGoogleEvent(token, gcalId);
      } catch (err) {
        console.warn('Failed to delete Google Calendar event:', err.message);
      }
    };
    syncDelete(); // Non-blocking

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error removing task:', error);
      tasks.value = previousTasks;
    }
  };

  const updateTask = async (updatedTask) => {
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      const oldTask = { ...tasks.value[index] };
      // Optimistic update - ensure we preserve the category object if ID didn't change, 
      // or find the new one from todoCategories if it did.
      let updatedCategory = oldTask.categories;
      if (updatedTask.category_id !== oldTask.category_id) {
        updatedCategory = todoCategories.value.find(c => c.id === updatedTask.category_id) || null;
      }

      tasks.value[index] = { ...updatedTask, categories: updatedCategory };

      const { error } = await supabase
        .from('todos')
        .update({
          text: updatedTask.text,
          deadline: updatedTask.deadline,
          priority: updatedTask.priority,
          category_id: updatedTask.category_id,
          notes: updatedTask.notes,
        })
        .eq('id', updatedTask.id);

      if (error) {
        console.error('Error updating task:', error);
        tasks.value[index] = oldTask;
      } else {
        // Sync to Google Calendar (UPDATE)
        const token = session.value?.provider_token;
        const syncUpdate = async () => {
          try {
            const gcalId = await findGoogleEventId(token, updatedTask.id);
            if (gcalId) {
              await updateGoogleEvent(token, gcalId, { text: updatedTask.text, deadline: updatedTask.deadline });
            } else {
              // If not found (maybe created before sync), try creating it
              await createGoogleEvent(token, { text: updatedTask.text, deadline: updatedTask.deadline }, updatedTask.id);
            }
          } catch (err) {
            console.warn('Failed to sync update to Google Calendar:', err.message);
          }
        };
        syncUpdate(); // Non-blocking
      }
    }
  };

  const handleSearch = (query) => {
    searchQuery.value = query;
  };

  const handleFilter = (filters) => {
    filterCriteria.value = filters;
  };

  const handleSort = (criteria) => {
    sortBy.value = criteria;
  };

  const filteredTasks = computed(() => {
    let filtered = [...tasks.value];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((task) =>
        task.text.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter((task) => {
      const statusMatch =
        filterCriteria.value.status === 'all'
          ? true
          : filterCriteria.value.status === 'completed'
            ? task.completed
            : !task.completed;
      const priorityMatch =
        filterCriteria.value.priority === 'all'
          ? true
          : task.priority === filterCriteria.value.priority;

      const categoryMatch = filterCriteria.value.category
        ? task.categories?.name?.toLowerCase().includes(filterCriteria.value.category.toLowerCase())
        : true;

      const dateMatch = filterCriteria.value.date
        ? task.deadline === filterCriteria.value.date
        : true;
      return statusMatch && priorityMatch && categoryMatch && dateMatch;
    });

    let sorted = [...filtered];
    if (sortBy.value === 'deadline') {
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy.value === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy.value === 'createdDate') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  });

  return {
    tasks,
    todoCategories,
    showModal,
    searchQuery,
    filterCriteria,
    sortBy,
    calendarSyncError,
    addTask,
    addCategory,
    toggleTask,
    removeTask,
    updateTask,
    handleSearch,
    handleFilter,
    handleSort,
    filteredTasks,
  };
}
