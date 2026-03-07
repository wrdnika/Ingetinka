<template>
  <div class="h-full flex flex-col gap-3 md:gap-4 p-3 md:p-4">
    <!-- Header with Action Button -->
    <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
      <h1 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{{ $t('subscription.title') }}</h1>
      <button
        @click="openAddModal"
        class="border border-cyan-400/40 text-cyan-400 btn-notch px-3 py-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400/5 hover:border-cyan-400/70 transition-all duration-200"
      >
        <Plus class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">{{ $t('subscription.add') }}</span>
      </button>
    </div>

    <!-- Main Content: Subscription List -->
    <div class="flex-grow overflow-hidden relative z-0">
      <SubscriptionList 
        ref="subListRef" 
        :session="session" 
        @edit="handleEdit" 
        @delete="handleDelete" 
      />
    </div>

    <!-- Form Modal (Add/Edit) -->
    <Modal 
      :show="showFormModal" 
      :title="editingSubscription ? $t('subscription.edit') : $t('subscription.add')"
      @close="closeModal"
    >
      <SubscriptionForm 
        :session="session" 
        :subscription="editingSubscription"
        @added="handleSuccess" 
        @updated="handleSuccess"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import { supabase } from '../supabase';
import SubscriptionList from '../components/SubscriptionList.vue';
import SubscriptionForm from '../components/SubscriptionForm.vue';
import Modal from '../components/Modal.vue';

const props = defineProps({
  session: Object
});

const showFormModal = ref(false);
const editingSubscription = ref(null);
const subListRef = ref(null);

const openAddModal = () => {
  editingSubscription.value = null;
  showFormModal.value = true;
};

const handleEdit = (sub) => {
  editingSubscription.value = sub;
  showFormModal.value = true;
};

const handleDelete = async (sub) => {
  if (!confirm(`Are you sure you want to delete ${sub.name}?`)) return;

  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', sub.id);
    
    if (error) throw error;
    
    // Refresh list
    if (subListRef.value) {
      subListRef.value.refresh();
    }
  } catch (error) {
    alert('Error deleting subscription: ' + error.message);
  }
};

const handleSuccess = () => {
  closeModal();
  // Refresh list
  if (subListRef.value) {
    subListRef.value.refresh();
  }
};

const closeModal = () => {
  showFormModal.value = false;
  editingSubscription.value = null;
};
</script>
