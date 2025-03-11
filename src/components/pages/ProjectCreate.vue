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

    <main class="mt-5 d-flex justify-content-center">
      <div class="container">
        <div class="card card-custom p-4">
          <h2 class="text-center mb-4">Form Peminjaman Barang</h2>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Nama</label>
              <input type="text" v-model="form.nama" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Kelas</label>
              <input type="text" v-model="form.kelas" class="form-control" required>
            </div>

            <h4 class="mt-4">List Barang</h4>
            <div v-if="selectedBarang" class="mb-3 p-3 border rounded bg-light">
              <p><strong>Nama Barang:</strong> {{ selectedBarang.barang }}</p>
              <p><strong>Stok:</strong> {{ selectedBarang.stok }}</p>
              <div class="counter">
                <button type="button" @click="ubahJumlah(-1)">-</button>
                <input type="text" v-model="selectedBarang.jumlah" readonly>
                <button type="button" @click="ubahJumlah(1)">+</button>
              </div>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg mt-3">Ajukan Peminjaman</button>
              <router-link to="/list" class="btn btn-secondary btn-lg mt-3">Kembali</router-link>
            </div>
          </form>
        </div>
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
      form: {
        nama: '',
        kelas: '',
        tanggal: '',
      },
      selectedBarang: null,
      pollingInterval: null
    };
  },
  created() {
    this.loadBarang();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    loadBarang() {
      const id = this.$route.params.id;
      axios.get(`http://localhost:3000/users/${id}`)
        .then(response => {
          this.selectedBarang = { ...response.data, jumlah: 1 };
        })
        .catch(err => console.error('Error fetching barang:', err));
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        if (this.selectedBarang) {
          axios.get(`http://localhost:3000/users/${this.selectedBarang.id}`)
            .then(response => {
              this.selectedBarang.stok = response.data.stok;
            })
            .catch(err => console.error('Error updating stok:', err));
        }
      }, 3000); // Polling setiap 3 detik
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    },
    ubahJumlah(delta) {
      if (!this.selectedBarang) return;
      let jumlahBaru = this.selectedBarang.jumlah + delta;
      if (jumlahBaru >= 1 && jumlahBaru <= this.selectedBarang.stok) {
        this.selectedBarang.jumlah = jumlahBaru;
      }
    },
    submitForm() {
    if (!this.selectedBarang || this.selectedBarang.jumlah <= 0) {
      Swal.fire('Error', 'Jumlah barang harus lebih dari 0', 'error');
      return;
    }

    // Ambil waktu sekarang dalam format Indonesia
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    });

    const formattedDate = formatter.format(now).replace(/\//g, '-'); // Ubah format menjadi dd-MM-yyyy, HH:mm:ss

    this.form.tanggal = formattedDate;

    const peminjaman = {
      nama: this.form.nama,
      kelas: this.form.kelas,
      namabarang: this.selectedBarang.barang,
      jumlahbarang: this.selectedBarang.jumlah,
      tanggal: this.form.tanggal // Waktu yang sudah diformat
    };

    axios.post('http://localhost:3000/database', peminjaman)
      .then(() => {
        return axios.patch(`http://localhost:3000/users/${this.selectedBarang.id}`, {
          stok: this.selectedBarang.stok - this.selectedBarang.jumlah
        });
      })
      .then(() => {
        Swal.fire('Success', 'Peminjaman berhasil diajukan!', 'success');
        this.$router.push('/list');
      })
      .catch(err => {
        console.error('Error processing peminjaman:', err);
        Swal.fire('Error', 'Terjadi kesalahan saat menyimpan', 'error');
      });
  }
  }
};
</script>

<style scoped>
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

.card-custom {
  border-radius: 20px;
  padding: 30px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.counter {
  display: flex;
  justify-content: center;
  align-items: center;
}

.counter button {
  border: none;
  background: #0052D4;
  color: white;
  font-size: 1.2rem;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.counter input {
  width: 50px;
  text-align: center;
  border: none;
  font-size: 1.2rem;
  margin: 0 10px;
  background: transparent;
}
</style>