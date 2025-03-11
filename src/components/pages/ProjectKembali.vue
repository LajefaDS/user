<template>
  <div>
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
    <!-- Form Pengembalian -->
    <main class="mt-5 d-flex justify-content-center">
      <div class="container form-container">
        <h2 class="text-center">Form Pengembalian Barang</h2>
        <router-link to="/" class="btn btn-back mb-2 mt-3">
          <i class="fas fa-arrow-left me-2"></i> Kembali
        </router-link>

        <form @submit.prevent="submitReturn">
          <div class="mb-3">
            <label class="form-label">Nama Peminjam</label>
            <input type="text" v-model="nama" class="form-control" readonly>
          </div>

          <div class="mb-3">
            <label class="form-label">Kelas</label>
            <input type="text" v-model="kelas" class="form-control" readonly>
          </div>

          <div class="mb-3">
            <label class="form-label">Nama Barang</label>
            <input type="text" v-model="namabarang" class="form-control" readonly>
          </div>

          <div class="mb-3">
            <label class="form-label">Jumlah Barang</label>
            <input type="number" v-model="jumlahbarang" class="form-control" readonly>
          </div>

          <div class="mb-3">
            <label class="form-label">Tanggal & Waktu Pengembalian</label>
            <input type="text" v-model="tanggalKembali" class="form-control" readonly>
          </div>

          <button type="submit" class="btn btn-success w-100" :disabled="isReturned">
            {{ isReturned ? "Barang Sudah Dikembalikan" : "Kembalikan Barang" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      id: '', // Simpan ID dari database
      nama: '',
      kelas: '',
      namabarang: '',
      jumlahbarang: '',
      tanggalKembali: this.getCurrentTime(),
      isReturned: false, // Menyimpan status apakah barang sudah dikembalikan
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const { id } = this.$route.params;
        const { data } = await axios.get(`http://localhost:3000/database/${id}`);

        this.id = data.id; // Simpan ID dari database
        this.nama = data.nama || "Tidak Diketahui";
        this.kelas = data.kelas || "Tidak Ada Data";
        this.namabarang = data.namabarang || "Tidak Diketahui";
        this.jumlahbarang = parseInt(data.jumlahbarang) || 0;
        this.isReturned = data.kembali || false; // Cek apakah sudah dikembalikan

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    getCurrentTime() {
      const now = new Date();
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
      };

      return now.toLocaleString('id-ID', options).replace(/\//g, '-');
    },

    async submitReturn() {
      try {
        const { id } = this.$route.params;

        // Kirim data pengembalian ke API notifikasi dengan ID yang sama
        await axios.post(`http://localhost:3000/notifikasi`, {
          id: this.id, // Menggunakan ID dari database
          nama: this.nama,
          kelas: this.kelas,
          namabarang: this.namabarang,
          jumlahbarang: this.jumlahbarang,
          tanggalKembali: this.tanggalKembali
        });

        // Update status "kembali" di database
        await axios.patch(`http://localhost:3000/database/${id}`, {
          kembali: true
        });

        this.isReturned = true; // Disable tombol setelah pengembalian sukses
        Swal.fire('Barang Dikembalikan!', 'Barang telah dikembalikan, tetapi masih ada di database.', 'success');
        this.$router.push('/akhir');

      } catch (error) {
        Swal.fire('Gagal!', error.message || 'Terjadi kesalahan.', 'error');
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

/* Form Container */
.form-container {
  max-width: 600px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Tombol Kembali */
.btn-back {
  background: #4364F7;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background: #0052D4;
}

/* Tombol Submit */
.btn-success {
  background: #28a745;
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: none;
  width: 100%;
}

.btn-success:hover {
  background: #218838;
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
</style>