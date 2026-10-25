// Data awal (State Management)
let projects = [
  { id: 1, title: 'Redesign Landing Page', category: 'UI/UX Design', budget: 3500000, isDone: true },
  { id: 2, title: 'Aplikasi Absensi Siswa', category: 'Mobile App', budget: 7000000, isDone: false }
];

// 1. Elemen DOM
const projectForm = document.getElementById('projectForm');
const inputTitle = document.getElementById('inputTitle');
const inputCategory = document.getElementById('inputCategory');
const inputBudget = document.getElementById('inputBudget');
const inputStatus = document.getElementById('inputStatus');

const searchInput = document.getElementById('searchInput');
const projectList = document.getElementById('projectList');

const statTotal = document.getElementById('statTotal');
const statDone = document.getElementById('statDone');
const statPending = document.getElementById('statPending');
const statBudget = document.getElementById('statBudget');

// ==========================================
// FITUR 1: Form Handling & Validasi
// ==========================================
projectForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Cegah reload halaman

  const titleVal = inputTitle.value.trim();
  const categoryVal = inputCategory.value;
  const budgetVal = parseFloat(inputBudget.value);
  const isDoneVal = inputStatus.checked;

  // Validasi: Judul tidak boleh kosong & Anggaran harus > 0
  if (!titleVal) {
    alert('Judul proyek tidak boleh kosong!');
    return;
  }
  if (isNaN(budgetVal) || budgetVal <= 0) {
    alert('Anggaran harus lebih besar dari 0!');
    return;
  }

  // Buat Objek Proyek Baru
  const newProject = {
    id: Date.now(), // ID Unik
    title: titleVal,
    category: categoryVal,
    budget: budgetVal,
    isDone: isDoneVal
  };

  // Masukkan ke array menggunakan Spread Operator
  projects = [newProject, ...projects];

  // Reset Form
  projectForm.reset();

  // Render Ulang Tampilan
  renderProjects();
});

// ==========================================
// FITUR 2: Live Search (Pencarian Real-Time)
// ==========================================
searchInput.addEventListener('input', function () {
  renderProjects();
});

// ==========================================
// FITUR 3: Toggle Status & Hapus Data
// ==========================================
function toggleStatus(id) {
  projects = projects.map(p => {
    if (p.id === id) {
      return { ...p, isDone: !p.isDone };
    }
    return p;
  });
  renderProjects();
}

function deleteProject(id) {
  if (confirm('Yakin ingin menghapus proyek ini?')) {
    projects = projects.filter(p => p.id !== id);
    renderProjects();
  }
}

// ==========================================
// RENDER UI & UPDATE STATISTIK
// ==========================================
function renderProjects() {
  const query = searchInput.value.toLowerCase();

  // Filter daftar proyek berdasarkan kecocokan nama (Fitur 2)
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  // Clear container
  projectList.innerHTML = '';

  if (filteredProjects.length === 0) {
    projectList.innerHTML = '<p class="text-gray-500 col-span-full text-center py-4">Tidak ada proyek yang ditemukan.</p>';
  } else {
    // Render Kartu Proyek
    filteredProjects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white p-5 rounded-xl shadow-md space-y-3 flex flex-col justify-between';

      const statusBadge = p.isDone
        ? '<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">Selesai</span>'
        : '<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">Dalam Pengerjaan</span>';

      const formattedBudget = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.budget);

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-gray-800 text-lg">${p.title}</h3>
            ${statusBadge}
          </div>
          <p class="text-sm text-gray-500 mb-1">Kategori: <strong>${p.category}</strong></p>
          <p class="text-sm text-blue-600 font-bold">${formattedBudget}</p>
        </div>
        
        <!-- Tombol Aksi (Fitur 3) -->
        <div class="flex gap-2 pt-3 border-t">
          <button onclick="toggleStatus(${p.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded transition">
            Ubah Status
          </button>
          <button onclick="deleteProject(${p.id})" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded transition">
            Hapus
          </button>
        </div>
      `;

      projectList.appendChild(card);
    });
  }

  // Update Angka pada Kartu Statistik
  updateStats();
}

function updateStats() {
  const total = projects.length;
  const done = projects.filter(p => p.isDone).length;
  const pending = total - done;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  statTotal.textContent = total;
  statDone.textContent = done;
  statPending.textContent = pending;
  statBudget.textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalBudget);
}

// Jalankan saat pertama kali dibuka
renderProjects();