<template>
  <div class="h-full flex flex-col gap-3 md:gap-4 ">
    <!-- Main Content: Subscription List -->
    <div class="flex-grow overflow-hidden relative z-0">
      <SubscriptionList :session="session" />
    </div>
  </div>
</template>

<script setup>
import SubscriptionList from '../components/SubscriptionList.vue';

const props = defineProps({
  session: Object
});
</script>
