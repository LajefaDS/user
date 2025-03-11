<template>
  <div>
    <!-- Header -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark navbar-custom shadow-lg">
        <div class="container d-flex justify-content-center">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <img src="../../assets/Logo.png" alt="Logo PPBS" class="img-fluid me-2">
            <h1 class="d-none d-lg-block">School Borrowing and Returning</h1>
            <h1 class="d-lg-none">PPBS</h1>
          </a>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="mt-5 d-flex justify-content-center">
      <div class="container text-center">
        <div class="row g-4 justify-content-center">
          <div class="col-12 col-md-5">
            <div class="card card-custom" @click="goToPeminjaman">
              <i class="fas fa-hand-holding box-icon fa-3x mb-3 text-primary"></i>
              <h3 class="fw-bold">Peminjaman</h3>
              <p>Pinjam barang sekolah dengan mudah dan cepat.</p>
              <router-link class="btn btn-primary btn-lg w-100 py-2 fw-bold btn-custom" to="/list">Pinjam Sekarang</router-link>
            </div>
          </div>
          <div class="col-12 col-md-5">
            <div class="card card-custom" @click="goToPengembalian">
              <i class="fas fa-undo box-icon fa-3x mb-3 text-success"></i>
              <h3 class="fw-bold">Pengembalian</h3>
              <p>Kembalikan barang sekolah dengan aman dan nyaman.</p>
              <router-link class="btn btn-success btn-lg w-100 py-2 fw-bold btn-custom" to="/akhir">Kembalikan Sekarang</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ProjectAwal',
  methods: {
    goToPeminjaman() {
      this.$router.push('/list')
    },
    goToPengembalian() {
      this.$router.push('/akhir')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

body { 
  font-family: 'Poppins', sans-serif; 
  background: #eef1f6; 
}

.btn-custom { 
  transition: all 0.3s ease-in-out; 
  border-radius: 30px; 
  font-size: 1.2rem;
}

.btn-custom:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); 
}

.navbar-custom { 
  background: linear-gradient(90deg, #0052D4, #4364F7, #6FB1FC); 
  padding: 15px 0;
}

.navbar-brand img { 
  height: 50px; 
  transition: 0.3s ease-in-out; 
}

.navbar-brand h1 { 
  font-size: 1.5rem; 
  color: white; 
  margin: 0; 
  font-weight: 600; 
}

.card-custom {
  border: none;
  border-radius: 20px;
  padding: 30px;
  transition: 0.3s ease-in-out;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card-custom:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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