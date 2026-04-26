/* ===========================
   LeafScan — main.js
   Semua logika interaksi web ada di sini
   =========================== */

// ===== AMBIL ELEMEN HTML =====
// Kita "pegang" elemen-elemen penting supaya bisa dimanipulasi lewat JS
const dropZone     = document.getElementById('dropZone');
const fileInput    = document.getElementById('file-input');
const previewSection = document.getElementById('previewSection');
const actionRow    = document.getElementById('actionRow');
const previewImg   = document.getElementById('previewImg');
const imgLabel     = document.getElementById('imgLabel');
const statusBadge  = document.getElementById('statusBadge');
const statusText   = document.getElementById('statusText');
const resultContent = document.getElementById('resultContent');
const scanBtn      = document.getElementById('scanBtn');

// Variabel untuk menyimpan file yang dipilih user
let currentFile = null;

// ===== DRAG & DROP =====
// Ketika user drag file ke atas zona upload
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault(); // Cegah browser buka file langsung
  dropZone.classList.add('dragover'); // Tambah efek visual
});

// Ketika drag keluar dari zona
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

// Ketika file di-drop
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0]; // Ambil file pertama saja
  if (file && file.type.startsWith('image/')) {
    handleFile(file); // Proses file-nya
  }
});

// Ketika klik zona upload → buka file picker
dropZone.addEventListener('click', () => fileInput.click());

// Ketika user pilih file lewat file picker
fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

// ===== FUNGSI: HANDLE FILE =====
// Dipanggil setiap kali user memilih atau men-drop foto
function handleFile(file) {
  currentFile = file;

  // Baca file sebagai URL supaya bisa ditampilkan di <img>
  const reader = new FileReader();
  reader.onload = (ev) => {
    previewImg.src = ev.target.result;   // Tampilkan preview foto
    imgLabel.textContent = file.name;    // Tampilkan nama file
    previewSection.classList.add('visible'); // Munculkan section preview
    actionRow.style.display = 'flex';   // Munculkan tombol aksi
    resultContent.innerHTML = '';        // Kosongkan hasil sebelumnya
    statusBadge.className = 'result-status analyzing';
    statusText.textContent = 'Foto siap — klik Mulai Analisis';
    scanBtn.disabled = false;
    dropZone.style.display = 'none';    // Sembunyikan drop zone
  };
  reader.readAsDataURL(file);
}

// ===== FUNGSI: MULAI ANALISIS =====
// Dipanggil ketika user klik tombol "Mulai Analisis"
async function startAnalysis() {
  if (!currentFile) return;

  // Ubah UI ke mode "loading"
  scanBtn.disabled = true;
  statusBadge.className = 'result-status analyzing';
  statusText.textContent = 'Menganalisis gambar...';

  // Tampilkan skeleton loading sementara menunggu hasil
  resultContent.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div class="skeleton" style="height:18px;width:60%;"></div>
      <div class="skeleton" style="height:12px;width:40%;"></div>
      <div class="skeleton" style="height:4px;width:100%;"></div>
      <div class="skeleton" style="height:60px;width:100%;"></div>
    </div>`;

  try {
    // Kirim foto ke Flask server lewat HTTP POST
    // FormData = cara mengirim file lewat fetch (seperti mengisi formulir)
    const formData = new FormData();
    formData.append('file', currentFile);

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData
    });

    const data = await response.json(); // Parse hasil JSON dari server

    if (data.status === 'success') {
      showResult(data.predictions); // Tampilkan hasil prediksi
    } else {
      showError(data.error);
    }

  } catch (error) {
    // Error ini muncul kalau server Flask belum dijalankan
    showError('Server belum nyala! Jalankan app.py dulu di terminal.');
  }
}

// ===== FUNGSI: TAMPILKAN HASIL =====
// Menerima array predictions dari Flask, lalu render ke UI
function showResult(predictions) {
  const top = predictions[0]; // Prediksi paling tinggi confidence-nya

  // Tentukan level confidence untuk warna bar
  const lvl = top.confidence >= 75 ? 'high'
            : top.confidence >= 50 ? 'med'
            : 'low';

  // Update status badge
  if (top.is_healthy) {
    statusBadge.className = 'result-status healthy';
    statusText.textContent = '✓ TANAMAN SEHAT';
  } else {
    statusBadge.className = 'result-status sick';
    statusText.textContent = '⚠ PENYAKIT TERDETEKSI';
  }

  // Buat HTML untuk kandidat lain (prediksi ke-2 & ke-3)
  const candidatesHTML = predictions.slice(1).map(p => `
    <div class="candidate-row">
      <span class="candidate-name">${p.disease}</span>
      <div class="mini-bar">
        <div class="mini-fill" data-w="${p.confidence}"></div>
      </div>
      <span class="candidate-pct">${p.confidence}%</span>
    </div>`).join('');

  // Tag label berdasarkan kondisi tanaman
  const tags = top.is_healthy
    ? `<span class="tag tag-green">Sehat</span>
       <span class="tag tag-green">Tidak Berbahaya</span>`
    : `<span class="tag tag-red">Perlu Perhatian</span>
       <span class="tag tag-yellow">Segera Tangani</span>`;

  // Render hasil ke dalam resultContent
  resultContent.innerHTML = `
    <div class="result-disease">
      <div class="disease-name">${top.disease}</div>
      <div class="disease-latin">${top.plant}</div>
      <div class="confidence-label">
        <span>Tingkat Keyakinan AI</span>
        <span class="confidence-pct ${lvl}">${top.confidence}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${lvl}" id="mainBar"></div>
      </div>
      <div class="disease-tags">${tags}</div>
    </div>
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:3px;padding:16px;">
      <div class="candidates-title">Kemungkinan Lain</div>
      ${candidatesHTML}
    </div>`;

  // Animasikan progress bar setelah elemen ada di DOM
  // requestAnimationFrame memastikan browser sudah render elemennya dulu
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const mainBar = document.getElementById('mainBar');
      if (mainBar) mainBar.style.width = top.confidence + '%';

      // Animasikan semua mini bar kandidat
      document.querySelectorAll('.mini-fill').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
    });
  });

  scanBtn.disabled = false;
  scanBtn.textContent = '↺ Analisis Ulang';
}

// ===== FUNGSI: TAMPILKAN ERROR =====
function showError(message) {
  statusBadge.className = 'result-status sick';
  statusText.textContent = '✗ ERROR';
  resultContent.innerHTML = `
    <div style="padding:16px;background:var(--surface2);border:1px solid #5a2020;border-radius:3px;">
      <p style="font-family:var(--font-mono);font-size:0.8rem;color:#e88;">
        ${message}
      </p>
      <p style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim);margin-top:8px;">
        Pastikan app.py sudah dijalankan di terminal.
      </p>
    </div>`;
  scanBtn.disabled = false;
}

// ===== FUNGSI: RESET APLIKASI =====
// Kembalikan semua ke kondisi awal
function resetApp() {
  currentFile = null;
  fileInput.value = '';
  previewImg.src = '';
  imgLabel.textContent = '—';
  previewSection.classList.remove('visible');
  actionRow.style.display = 'none';
  resultContent.innerHTML = '';
  statusBadge.className = 'result-status analyzing';
  statusText.textContent = 'Menunggu analisis...';
  scanBtn.textContent = '⬡ Mulai Analisis';
  scanBtn.disabled = false;
  dropZone.style.display = 'block';
}