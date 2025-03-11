<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark navbar-custom shadow-lg">
        <div class="container d-flex justify-content-center">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <img src="@/assets/Logo.png" alt="Logo PPBS" class="img-fluid me-2">
            <h1 class="d-none d-lg-block">School Borrowing and Returning</h1>
            <h1 class="d-lg-none">PPBS</h1>
          </a>
        </div>
      </nav>
    </header>

    <main class="mt-4 d-flex justify-content-center">
      <div class="container">
        <h2 class="text-center mb-4">Daftar Barang untuk Dipinjam</h2>
        <router-link to="/" class="btn btn-back mb-4">
          <i class="fas fa-arrow-left me-2"></i>Kembali
        </router-link>

        <!-- Input Pencarian -->
        <input type="text" v-model="searchQuery" class="form-control mb-3" placeholder="Cari barang...">

        <!-- Daftar Barang -->
        <ul class="list-group">
          <li v-for="user in filteredUsers" :key="user.id" class="list-group-item">
            <p class="mb-0">
              <strong>{{ user.barang }}</strong><br>
              Stok: <span :class="{ 'text-danger': user.stok === 0 }">{{ user.stok }}</span>
            </p>
            <div>
              <!-- Tombol hanya muncul jika stok > 0 -->
              <router-link 
                v-if="user.stok > 0"
                :to="{ name: 'ProjectCreate', params: { id: user.id }}" 
                class="btn btn-success btn-sm me-2 text-white">
                <h5>Pinjam</h5>
              </router-link>
              <span v-else class="badge bg-danger">Stok Habis</span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      searchQuery: '',
      refreshInterval: null, // Untuk polling otomatis
    };
  },
  mounted() {
    this.load();
    this.startAutoRefresh(); // Mulai polling otomatis
  },
  beforeUnmount() {
    this.stopAutoRefresh(); // Hentikan polling saat komponen di-unmount
  },
  computed: {
    filteredUsers() {
      if (!this.users || !Array.isArray(this.users)) return [];
      return this.users.filter(user => 
        (user.barang?.toLowerCase() || '').includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    // Ambil data dari API
    async load() {
      try {
        const response = await axios.get('http://localhost:3000/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    // 🔄 **Polling otomatis setiap 5 detik**
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.load();
      }, 5000); // 5 detik
    },

    // 🛑 **Hentikan polling saat komponen di-unmount**
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

body { 
  font-family: 'Poppins', sans-serif; 
  background: #eef1f6; 
}

.navbar-custom { 
  background: linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC); 
  padding: 15px 0;
}

.navbar-brand img { 
  height: 50px; 
}

.navbar-brand h1 { 
  font-size: 1.5rem; 
  color: white; 
  margin: 0; 
  font-weight: 600; 
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 1.2rem;
}

.btn-back {
  background: #4364F7;
  color: white;
  border: none;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background: #0052D4;
  color: white;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(67, 100, 247, 0.2);
}

@media (max-width: 768px) {
  .navbar-brand h1 { 
    font-size: 1.2rem; 
  }
}

@media (max-width: 480px) {
  .navbar-brand h1 { 
    font-size: 1rem; 
  }
}
</style>