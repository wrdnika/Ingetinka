<template>
  <div class="h-full flex flex-col">
    <!-- Summary Header -->
    <div class="flex-shrink-0 flex justify-between border-b border-white/10 p-4 md:p-6">
      <div class="flex items-baseline gap-2">
        <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">{{ $t('subscription.total') }}</p>
        <span class="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {{ formatPrice(totalMonthlyExpense) }}
        </span>
        <span class="text-white/30 text-xs">/ {{ $t('subscription.month') }}</span>
      </div>
      <button
        @click="openAddModal"
        class="border border-cyan-400/40 text-cyan-400 btn-notch mr-4 mt-2 px-3 py-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400/5 hover:border-cyan-400/70 transition-all duration-200"
      >
        <Plus class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">{{ $t('subscription.add') }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-grow flex items-center justify-center">
      <div class="w-6 h-6 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="subscriptions.length === 0" class="flex-grow flex flex-col items-center justify-center text-center p-8">
      <div class="w-12 h-12 border border-white/10 flex items-center justify-center mb-4">
        <CreditCard class="w-5 h-5 text-white/20" />
      </div>
      <p class="text-white/30 text-xs uppercase tracking-widest">{{ $t('subscription.noActive') }}</p>
    </div>

    <!-- Subscription List -->
    <div v-else class="flex-grow overflow-y-auto custom-scrollbar">
      <!-- Column Headers -->
      <div class="grid grid-cols-12 px-4 py-2 border-b border-white/10 bg-gray-900/50">
        <div class="col-span-5 text-[9px] font-bold text-white/30 uppercase tracking-widest">Name</div>
        <div class="col-span-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Amount</div>
        <div class="col-span-3 text-[9px] font-bold text-white/30 uppercase tracking-widest hidden md:block">Next Date</div>
        <div class="col-span-1"></div>
      </div>

      <div
        v-for="sub in subscriptions"
        :key="sub.id"
        class="group grid grid-cols-12 items-center px-4 py-3.5 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-150"
      >
        <!-- Name + Category -->
        <div class="col-span-5 flex items-center gap-3 min-w-0">
          <SubscriptionLogo :name="sub.name" size="sm" />
          <div class="min-w-0">
            <p class="text-sm text-white/90 font-medium truncate">{{ sub.name }}</p>
            <span
              class="text-[9px] text-cyan-400/70 font-bold uppercase tracking-widest border-l border-cyan-400/30 pl-1.5"
            >
              {{ sub.categories?.name || 'Uncategorized' }}
            </span>
          </div>
        </div>

        <!-- Price  -->
        <div class="col-span-3">
          <p class="text-sm text-white/80 font-medium">{{ formatPrice(sub.price) }}</p>
          <p class="text-[10px] text-white/30 capitalize">{{ $t('common.' + sub.cycle) }}</p>
        </div>

        <!-- Next Date -->
        <div class="col-span-3 hidden md:flex items-center gap-1.5">
          <span class="text-xs text-white/30">{{ formatDate(sub.next_payment_date || sub.first_payment_date) }}</span>
        </div>

        <!-- Actions -->
        <div class="col-span-1 flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            @click.stop="handleEdit(sub)" 
            class="text-white/30 hover:text-cyan-400 transition-colors"
          >
            <Edit2 class="w-3.5 h-3.5" />
          </button>
          <button 
            @click.stop="handleDelete(sub)" 
            class="text-white/30 hover:text-red-400 transition-colors"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
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
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { CreditCard, Edit2, Trash2, Plus } from 'lucide-vue-next';
import SubscriptionLogo from './SubscriptionLogo.vue';
import Modal from '../common/Modal.vue';
import SubscriptionForm from './SubscriptionForm.vue';
import { findSubscriptionGoogleEventId, deleteSubscriptionGoogleEvent } from '../../services/googleCalendar';

const props = defineProps({
  session: Object
});

const subscriptions = ref([]);
const loading = ref(true);
const showFormModal = ref(false);
const editingSubscription = ref(null);

const fetchSubscriptions = async () => {
  if (!props.session) return;
  
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        categories (name, color)
      `)
      .eq('user_id', props.session.user.id)
      .eq('status', 'active')
      .order('price', { ascending: false });

    if (error) throw error;
    subscriptions.value = data || [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  } finally {
    loading.value = false;
  }
};

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
    // Sync to Google Calendar (DELETE)
    const token = props.session?.provider_token;
    const syncDelete = async () => {
      try {
        const gcalId = await findSubscriptionGoogleEventId(token, sub.id);
        if (gcalId) await deleteSubscriptionGoogleEvent(token, gcalId);
      } catch (err) {
        console.warn('Failed to delete Google Calendar subscription event:', err.message);
      }
    };
    syncDelete(); // Non-blocking

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', sub.id);
    
    if (error) throw error;
    fetchSubscriptions();
  } catch (error) {
    alert('Error deleting subscription: ' + error.message);
  }
};

const handleSuccess = () => {
  closeModal();
  fetchSubscriptions();
};

const closeModal = () => {
  showFormModal.value = false;
  editingSubscription.value = null;
};

const totalMonthlyExpense = computed(() => {
  return subscriptions.value.reduce((total, sub) => {
    let price = Number(sub.price);
    if (sub.cycle === 'yearly') price = price / 12;
    if (sub.cycle === 'weekly') price = price * 4;
    return total + price;
  }, 0);
});

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

onMounted(() => {
  fetchSubscriptions();
});

defineExpose({
  refresh: fetchSubscriptions
});
</script>

<style scoped>
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
