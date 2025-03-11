<template>
      <header>
        <nav class="navbar navbar-expand-lg navbar-dark navbar-custom shadow-lg">
          <div class="container d-flex justify-content-center">
            <a class="navbar-brand d-flex align-items-center" href="#">
              <img src="/Logo.png" alt="Logo PPBS" class="img-fluid me-2">
              <h1 class="d-none d-lg-block">School Borrowing and Returning</h1>
              <h1 class="d-lg-none">PPBS</h1>
            </a>
          </div>
        </nav>
      </header>

      <main class="mt-5 d-flex justify-content-center">
        <div class="container">
          <h2 class="text-center mb-3">Daftar Peminjaman Barang</h2>
          <router-link to="/" class="btn btn-back mb-4">
            <i class="fas fa-arrow-left me-2"></i>Kembali
          </router-link>
          <div class="search-container">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Cari Nama Peminjam..." 
              v-model="searchName"
              @input="searchProjects"
            >
          </div>
          
          <ul class="list-group mt-3" v-if="projects.length > 0">
            <li class="list-group-item" v-for="project in projects" :key="project.id">
              <div>
                <strong>Nama Peminjam:</strong> {{ project.nama }}<br>
                <strong>Kelas:</strong> {{ project.kelas }}<br>
                <strong>Nama Barang:</strong> {{ project.namabarang }}<br>
                <strong>Jumlah Barang:</strong> {{ project.jumlahbarang }}<br>
                <strong>Waktu Peminjaman:</strong> {{ project.tanggal }}<br>
              </div>
              <router-link 
                :to="{ name: 'ProjectKembali', params: { id: project.id } }"
                class="btn btn-secondary"
                :class="{ 'disabled': isItemReturned(project) }">
                Kembalikan
              </router-link>
            </li>
          </ul>

          <!-- Jika tidak ada hasil pencarian -->
          <p v-if="searchName && projects.length === 0" class="text-center mt-3">
            Tidak ada data yang cocok.
          </p>
        </div>
      </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'ProjectList',
  data() {
      return {
          projects: [], // Data peminjaman
          returnedIds: new Set(), // Menyimpan ID barang yang sudah dikembalikan
          searchName: '' // Input pencarian
      }
  },
  mounted() {
      this.loadReturnedItems();
  },
  methods: {
      async searchProjects() {
          if (!this.searchName) {
              this.projects = []; // Jika search kosong, list tetap kosong
              return;
          }

          try {
              const response = await axios.get(`http://localhost:3000/database`);
              this.projects = response.data.filter(project => project.nama === this.searchName);
          } catch (error) {
              console.error('Error:', error);
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Gagal mencari data',
                  timer: 1500
              });
          }
      },
      async loadReturnedItems() {
          try {
              const response = await axios.get('http://localhost:3000/notifikasi');
              this.returnedIds = new Set(response.data.map(item => item.id));
          } catch (error) {
              console.error('Error:', error);
          }
      },
      isItemReturned(project) {
          return this.returnedIds.has(project.id);
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
  background: white;
  border-radius: 10px;
  margin-bottom: 12px;
  transition: transform 0.3s ease-in-out;
}

.list-group-item:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: #ff4d4d;
  border: none;
  font-weight: 600;
  padding: 8px 15px;
  border-radius: 8px;
  transition: 0.3s;
}

.btn-secondary:hover {
  background: #cc0000;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-container input {
  width: 100%;
  padding: 12px;
  border-radius: 30px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.3s;
}

.search-container input:focus {
  border-color: #4364F7;
  box-shadow: 0 0 8px rgba(67, 100, 247, 0.2);
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