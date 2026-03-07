import { createRouter, createWebHistory } from 'vue-router';
import TodoView from '../views/TodoView.vue';
import SubscriptionView from '../views/SubscriptionView.vue';
import CalendarView from '../views/CalendarView.vue';

const routes = [
  {
    path: '/',
    name: 'Todo',
    component: TodoView,
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionView,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
