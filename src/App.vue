<template>
  <div class="fixed inset-0 bg-gray-900 pointer-events-none z-0"></div>

  <div v-if="!session" class="relative h-screen z-10">
    <div v-if="isPublicRoute" class="h-full overflow-y-auto">
      <router-view />
    </div>
    <div v-else class="h-full flex items-center justify-center px-4">
      <Login :handleLogin="handleLogin" />
    </div>
  </div>

  <div v-else id="app-container" class="relative h-screen flex overflow-hidden z-10">
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/60 z-20 lg:hidden"
    ></div>

    <Sidebar 
      :session="session" 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <div class="flex-grow flex flex-col min-w-0 relative">
      <Header 
        :session="session" 
        :handleLogout="handleLogout" 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />
      
      <main class="flex-grow overflow-y-auto custom-scrollbar">
        <div class="h-full">
          <router-view :session="session" />
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.grid-bg {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from './composables/useAuth';
import { useRoute } from 'vue-router';
import Login from './components/auth/Login.vue';
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';

const { session, handleLogin, handleLogout } = useAuth();
const route = useRoute();
const isSidebarOpen = ref(false);

const isPublicRoute = computed(() => {
  return ['/privacy', '/terms'].includes(route.path);
});
</script>
