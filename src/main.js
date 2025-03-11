import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { createRouter, createWebHistory } from 'vue-router';
import ProjectAwal from './components/pages/ProjectAwal';
import ProjectAkhir from './components/pages/ProjectAkhir';
import ListBarang from './components/pages/ListBarang';
import '@fortawesome/fontawesome-free/css/all.css'
  
axios.defaults.baseURL = process.env.VUE_APP_API_URL
axios.interceptors.request.use(function (config) {
  config.headers['X-Binarybox-Api-Key'] = process.env.VUE_APP_API_KEY;
  return config;
});
  
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ProjectAwal },
    { path: '/akhir', component: ProjectAkhir },
    { path: '/list', component: ListBarang },
    {
      path: '/kembali/:id',
      name: 'ProjectKembali',
      component: () => import('./components/pages/ProjectKembali.vue')
    },
    {
      path: '/create/:id',
      name: 'ProjectCreate',
      component: () => import('./components/pages/ProjectCreate.vue')
    },
  ],
});
  
createApp(App).use(router).mount('#app');