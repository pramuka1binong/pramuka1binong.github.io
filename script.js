/* ===================================
   PRAMUKA SMKN 1 BINONG
   SCRIPT.JS
=================================== */

// MENAMPILKAN TAHUN OTOMATIS DI FOOTER
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// NAVBAR HP
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function tutupMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const sedangTerbuka = navLinks.classList.toggle("open");

  menuToggle.classList.toggle("is-open", sedangTerbuka);
  menuToggle.setAttribute("aria-expanded", String(sedangTerbuka));
  menuToggle.setAttribute(
    "aria-label",
    sedangTerbuka ? "Tutup menu" : "Buka menu",
  );

  document.body.classList.toggle("menu-open", sedangTerbuka);
});

// Tutup menu setelah pengunjung memilih bagian halaman.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", tutupMenu);
});

// Tutup menu jika layar berubah menjadi desktop.
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    tutupMenu();
  }
});

// SLIDESHOW HERO
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = document.getElementById("heroDots");
const heroPrev = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");

let heroIndex = 0;
let heroTimer;

heroSlides.forEach((slide, index) => {
  const dot = document.createElement("button");

  dot.className = "hero-dot";
  dot.setAttribute("aria-label", `Buka slide ${index + 1}`);

  dot.addEventListener("click", () => {
    tampilkanSlide(index);
    mulaiSlideshow();
  });

  heroDots.appendChild(dot);
});

const dots = [...heroDots.querySelectorAll(".hero-dot")];

function tampilkanSlide(index) {
  heroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === heroIndex);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === heroIndex);
    dot.setAttribute("aria-current", i === heroIndex ? "true" : "false");
  });
}

function mulaiSlideshow() {
  clearInterval(heroTimer);

  // Ganti foto setiap 5 detik.
  heroTimer = setInterval(() => {
    tampilkanSlide(heroIndex + 1);
  }, 5000);
}

heroPrev.addEventListener("click", () => {
  tampilkanSlide(heroIndex - 1);
  mulaiSlideshow();
});

heroNext.addEventListener("click", () => {
  tampilkanSlide(heroIndex + 1);
  mulaiSlideshow();
});

tampilkanSlide(0);
mulaiSlideshow();

// JEDA SLIDESHOW JIKA TAB TIDAK AKTIF.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(heroTimer);
  } else {
    mulaiSlideshow();
  }
});

// GALERI GESER KE KIRI DAN KANAN
const galleryTrack = document.getElementById("galleryTrack");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

let galleryIndex = 0;
let galleryTimer;

function hitungBatasGaleri() {
  return Math.max(
    0,
    galleryTrack.scrollWidth - galleryTrack.parentElement.clientWidth,
  );
}

function geserGaleri() {
  const kartu = galleryTrack.querySelector(".gallery-card");

  if (!kartu) return;

  const jarak = kartu.getBoundingClientRect().width + 22;
  const posisiMaksimum = hitungBatasGaleri();

  const posisi = Math.min(galleryIndex * jarak, posisiMaksimum);

  galleryTrack.style.transform = `translateX(-${posisi}px)`;
}

function galeriBerikutnya() {
  const kartu = galleryTrack.querySelector(".gallery-card");

  if (!kartu) return;

  const jarak = kartu.getBoundingClientRect().width + 22;
  const batas = hitungBatasGaleri();
  const posisiSaatIni = Math.min(galleryIndex * jarak, batas);

  // Kembali ke awal setelah mencapai kartu terakhir.
  galleryIndex = posisiSaatIni >= batas - 2 ? 0 : galleryIndex + 1;

  geserGaleri();
}

function galeriSebelumnya() {
  galleryIndex = Math.max(0, galleryIndex - 1);
  geserGaleri();
}

function mulaiGaleriOtomatis() {
  clearInterval(galleryTimer);

  // Geser galeri otomatis setiap 4 detik.
  galleryTimer = setInterval(galeriBerikutnya, 4000);
}

galleryNext.addEventListener("click", () => {
  galeriBerikutnya();
  mulaiGaleriOtomatis();
});

galleryPrev.addEventListener("click", () => {
  galeriSebelumnya();
  mulaiGaleriOtomatis();
});

// Hitung ulang posisi ketika ukuran layar berubah.
window.addEventListener("resize", () => {
  geserGaleri();
});

// Jeda galeri ketika pengunjung sedang mengarahkan kursor ke galeri.
galleryTrack.addEventListener("mouseenter", () => {
  clearInterval(galleryTimer);
});

galleryTrack.addEventListener("mouseleave", mulaiGaleriOtomatis);

// Jeda galeri ketika tab tidak terlihat.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(galleryTimer);
  } else {
    mulaiGaleriOtomatis();
  }
});

geserGaleri();
mulaiGaleriOtomatis();

// ANIMASI SAAT BAGIAN HALAMAN MUNCUL.
const elemenReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const pengamat = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  elemenReveal.forEach((elemen) => {
    pengamat.observe(elemen);
  });
} else {
  elemenReveal.forEach((elemen) => {
    elemen.classList.add("visible");
  });
}

// NAVBAR AKTIF SESUAI BAGIAN YANG DIBUKA.
const bagianHalaman = document.querySelectorAll("main section[id]");
const tautanNavbar = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const pengamatBagian = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tautanNavbar.forEach((link) => {
            const aktif = link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", aktif);
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
    },
  );

  bagianHalaman.forEach((bagian) => {
    pengamatBagian.observe(bagian);
  });
}

// DATA PRESTASI BAZOKA
const prestasiBazoka = [
  "Juara Jawara LKBB Seluruh Tingkatan",
  "Juara Umum LKBB Tingkat Penegak",
  "Juara Utama 1 LKBB Tingkat Penegak",
  "Juara Danton Terbaik Utama 2",
  "Juara PBB Dasar Terbaik 1",
  "Juara Variasi Formasi Terbaik 3",
  "Juara Umum Materi Putri Ke-2",
  "Juara Utama 3 Materi Sandi Putra",
  "Juara Harapan Utama 1 Sandi Putra",
  "Juara Harapan Utama 1 Morse Putra",
  "Juara Utama 2 Video Kreasi Seni",
  "Juara Harapan Utama 2 Materi Sandi Putri",
  "Juara Harapan Utama 3 Materi Kepramukaan Putra",
  "Juara Harapan Utama 3 Materi Pengetahuan Umum Putri",
  "Juara Harapan Utama 1 Materi Putra",
  "Juara Utama 1 Morse Putri",
];

// DATA PRESTASI ARS UNIVERSITY
const prestasiARS = [
  "Juara Harapan 1 Akademik Putri",
  "Juara Harapan 3 Pengetahuan Kepramukaan Putri",
  "Juara Utama 2 Sandi Putri",
  "Juara Utama 2 Sandi Putra",
  "Juara Harapan 3 Pengetahuan dan Seni Budaya Putra",
  "Juara Utama 3 Morse Putra",
  "Juara Harapan 2 P3K Putra",
  "Juara Utama 2 Leadership Putra",
  "Juara Utama 3 Pengetahuan Akademik Putra",
  "Juara Harapan 2 Danton Terbaik",
  "Juara Utama 2 PBB Dasar Terbaik",
  "Juara Utama 3 Variasi dan Formasi Terbaik",
  "Juara Utama 2 LKBB Galaksi Scout",
  "Juara Utama 2 Materi Putra (Nilai Keseluruhan Materi)",
  "Juara Terfavorit 2 Sosial Media",
];

// FUNGSI MEMBUKA POPUP
function bukaPrestasi(jenis) {
  const modal = document.getElementById("prestasiModal");
  const judul = document.getElementById("prestasiJudul");
  const deskripsi = document.getElementById("prestasiDeskripsi");
  const daftar = document.getElementById("prestasiDaftar");

  let data = [];

  if (jenis === "bazoka") {
    judul.textContent = "Prestasi BAZOKA";
    deskripsi.textContent = "Daftar pencapaian Pramuka Gandi Sakti di BAZOKA.";
    data = prestasiBazoka;
  } else if (jenis === "ars") {
    judul.textContent = "Prestasi ARS University";
    deskripsi.textContent =
      "Daftar pencapaian Pramuka Gandi Sakti di ARS University.";
    data = prestasiARS;
  }

  daftar.innerHTML = data
    .map(
      (nama, index) => `
        <div class="prestasi-item">
            <span class="prestasi-nomor">${index + 1}</span>
            <div>
                <strong>${nama}</strong>
                <span>Prestasi Pramuka Gandi Sakti</span>
            </div>
        </div>
    `,
    )
    .join("");

  modal.classList.add("aktif");
  document.body.style.overflow = "hidden";
}

// FUNGSI MENUTUP POPUP
function tutupPrestasi() {
  document.getElementById("prestasiModal").classList.remove("aktif");
  document.body.style.overflow = "";
}

// TUTUP JIKA AREA GELAP DIKLIK
document
  .getElementById("prestasiModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      tutupPrestasi();
    }
  });

// TUTUP DENGAN TOMBOL ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    tutupPrestasi();
  }
});

javascript;
function toggleAnggota(bidang) {
  const daftar = document.getElementById("anggota-" + bidang);
  const tombol = daftar.previousElementSibling;

  if (!daftar || !tombol) return;

  const sedangTerbuka = !daftar.hidden;

  daftar.hidden = sedangTerbuka;
  tombol.textContent = sedangTerbuka ? "Lihat Anggota" : "Sembunyikan Anggota";
}
javascript;
// DATA PRESTASI GEMA PRAMUKA KWARAN BINONG 2026
const prestasiGema = [
  "Juara 1 Orasi Puteri",
  "Juara 3 Orasi Puteri",
  "Juara 1 Orasi Putera",
  "Juara 1 Debat Puteri",
  "Juara 3 Debat Puteri",
  "Juara 1 Debat Putera",
  "Penghargaan Tim Paduan Suara",
];
