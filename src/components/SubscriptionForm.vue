<template>
  <form @submit.prevent="handleSubmit" class="space-y-3">
    <!-- Name Input -->
    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.serviceName') }}</label>
      <input
        v-model="form.name"
        type="text"
        list="service-suggestions"
        placeholder="e.g. Netflix, Spotify"
        class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
        required
        @change="handleNameChange"
      />
      <datalist id="service-suggestions">
        <option value="Netflix" />
        <option value="Spotify" />
        <option value="Youtube Premium" />
        <option value="Disney+ Hotstar" />
        <option value="Apple Music" />
        <option value="Google One" />
        <option value="ChatGPT Plus" />
        <option value="AWS" />
        <option value="DigitalOcean" />
        <option value="IndiHome" />
      </datalist>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- Price Input -->
      <div>
        <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.price') }}</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">Rp</span>
          <input
            v-model="form.price"
            type="number"
            placeholder="0"
            class="w-full pl-8 p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
            required
          />
        </div>
      </div>

      <!-- Cycle -->
      <div>
        <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.cycle') }}</label>
        <div class="relative">
          <select
            v-model="form.cycle"
            class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none pr-8"
          >
            <option value="monthly" class="bg-gray-900">{{ $t('common.monthly') }}</option>
            <option value="yearly" class="bg-gray-900">{{ $t('common.yearly') }}</option>
            <option value="weekly" class="bg-gray-900">{{ $t('common.weekly') }}</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Category Dropdown -->
    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.category') }}</label>
      <div class="relative">
        <select
          v-model="form.category_id"
          class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none pr-8"
          required
          @change="handleCategoryChange"
        >
          <option value="" disabled class="bg-gray-900">{{ $t('subscription.form.selectCategory') }}</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-gray-900">
            {{ cat.name }}
          </option>
          <option value="new" class="bg-gray-900 text-cyan-400 font-bold">{{ $t('subscription.form.addNewCategory') }}</option>
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 pointer-events-none" />
      </div>
    </div>

    <!-- First Payment Date -->
    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.firstPayment') }}</label>
      <input
        v-model="form.first_payment_date"
        type="date"
        class="w-full p-3 bg-gray-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
        required
      />
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">{{ $t('subscription.form.notes') }}</label>
      <textarea
        v-model="form.notes"
        placeholder="e.g. Shared with family"
        class="w-full p-3 bg-transparent border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
        rows="2"
      ></textarea>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="loading"
      class="w-full p-3 bg-cyan-400 text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-cyan-300 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
      <span v-else>{{ subscription ? $t('subscription.form.update') : $t('subscription.form.save') }}</span>
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { supabase } from '../supabase';
import { ChevronDown, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  session: Object,
  subscription: Object // Optional: if provided, we're in edit mode
});

const emit = defineEmits(['added', 'updated', 'close']);

const loading = ref(false);
const categories = ref([]);

const form = reactive({
  name: '',
  price: '',
  cycle: 'monthly',
  category_id: '',
  first_payment_date: new Date().toISOString().substr(0, 10),
  notes: '',
});

const resetForm = () => {
  form.name = '';
  form.price = '';
  form.cycle = 'monthly';
  form.category_id = '';
  form.first_payment_date = new Date().toISOString().substr(0, 10),
  form.notes = '';
};

// Watch for subscription prop changes (for editing)
watch(() => props.subscription, (newSub) => {
  if (newSub) {
    form.name = newSub.name || '';
    form.price = newSub.price || '';
    form.cycle = newSub.cycle || 'monthly';
    form.category_id = newSub.category_id || '';
    form.first_payment_date = newSub.first_payment_date || new Date().toISOString().substr(0, 10);
    form.notes = newSub.notes || '';
  } else {
    // Reset to defaults if subscription is null (e.g. closing/re-opening for add)
    resetForm();
  }
}, { immediate: true });

// Predefined service data for auto-fill
const serviceDefaults = {
  'Netflix': { price: 186000, category: 'Entertainment' },
  'Spotify': { price: 55000, category: 'Music' },
  'Youtube Premium': { price: 59000, category: 'Entertainment' },
  'Disney+ Hotstar': { price: 39000, category: 'Entertainment' },
  'Apple Music': { price: 49000, category: 'Music' },
  'Google One': { price: 26900, category: 'Cloud Storage' },
  'ChatGPT Plus': { price: 300000, category: 'productivity' }, // approx $20
};

const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', props.session.user.id) // Strict RLS safety
      .eq('type', 'subscription')
      .order('name');
    
    if (error) throw error;
    categories.value = data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const handleNameChange = () => {
  // Only auto-fill if we're not editing or if fields are empty
  if (props.subscription) return;

  const service = serviceDefaults[form.name];
  if (service) {
    if (!form.price) form.price = service.price;
    // Attempt to match category
    const cat = categories.value.find(c => c.name.toLowerCase() === service.category.toLowerCase());
    if (cat) {
      form.category_id = cat.id;
    }
  }
};

const handleCategoryChange = async (e) => {
  if (form.category_id === 'new') {
    const newName = prompt("Enter new category name:");
    if (newName) {
      loading.value = true;
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            user_id: props.session.user.id,
            name: newName,
            type: 'subscription'
          })
          .select()
          .single();
        
        if (error) throw error;
        
        await fetchCategories();
        form.category_id = data.id;
      } catch (error) {
        alert('Failed to create category: ' + error.message);
        form.category_id = props.subscription?.category_id || '';
      } finally {
        loading.value = false;
      }
    } else {
      form.category_id = props.subscription?.category_id || '';
    }
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = {
      user_id: props.session.user.id,
      name: form.name,
      price: Number(form.price), // Ensure it's a number
      currency: 'IDR',
      cycle: form.cycle,
      first_payment_date: form.first_payment_date,
      category_id: form.category_id || null,
      notes: form.notes
    };

    if (props.subscription) {
      // Update existing
      const { error } = await supabase
        .from('subscriptions')
        .update(payload)
        .eq('id', props.subscription.id);
      
      if (error) throw error;
      emit('updated');
    } else {
      // Insert new
      const { error } = await supabase
        .from('subscriptions')
        .insert(payload);
      
      if (error) throw error;
      emit('added');
    }
    
    resetForm();
  } catch (error) {
    console.error('Submission Error:', error);
    console.error('Payload:', {
       user_id: props.session?.user?.id,
       name: form.name,
       price: form.price,
       cycle: form.cycle,
       category: form.category_id
    });
    alert('Error saving subscription: ' + error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.session) {
    fetchCategories();
  }
});
</script>
