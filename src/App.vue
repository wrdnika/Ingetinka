<template>
  <div class="fixed inset-0 bg-gray-900 pointer-events-none z-0"></div>

  <div v-if="!session" class="relative h-screen flex items-center justify-center z-10">
    <Login :handleLogin="handleLogin" />
  </div>

  <div v-else id="app-container" class="relative h-screen flex overflow-hidden z-10">
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/60 z-20 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <Sidebar 
      :session="session" 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <!-- Main Content Area -->
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
import { ref } from 'vue';
import { useAuth } from './composables/useAuth';
import Login from './components/Login.vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

const { session, handleLogin, handleLogout } = useAuth();
const isSidebarOpen = ref(false);
</script>
