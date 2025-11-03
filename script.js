document.addEventListener("DOMContentLoaded", () => {
  // ====== ANIMASI ANGKA ======
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  animateValue("jumlahSiswa", 0, 850, 2000);
  animateValue("jumlahLulusan", 0, 2300, 2000);

  // ====== BUKU TAMU ======
  const form = document.getElementById("guestForm");
  const guestMessages = document.getElementById("guestMessages");
  let messages = JSON.parse(localStorage.getItem("guestBook")) || [];

  function renderMessages() {
    guestMessages.innerHTML = "";
    messages.forEach((msg) => {
      const li = document.createElement("li");
      li.className = "border-bottom py-2";
      li.innerHTML = `<strong>${msg.name}</strong>: ${msg.text}`;
      guestMessages.appendChild(li);
    });
  }
  if (form && guestMessages) {
    renderMessages();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("guestName").value.trim();
      const text = document.getElementById("guestMessage").value.trim();
      if (name && text) {
        const newMessage = { name, text };
        messages.push(newMessage);
        localStorage.setItem("guestBook", JSON.stringify(messages));
        renderMessages();
        form.reset();
      }
    });
  }

  // ====== JAM REALTIME ======
  const jam = document.getElementById("jam");
  if (jam) {
    setInterval(() => {
      const d = new Date();
      jam.innerText = d.toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "medium",
      });
    }, 1000);
  }

  // ====== CHATBOT ======
  const openChat = document.getElementById("openChat");
  const closeChat = document.getElementById("closeChat");
  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");
  const chatLog = document.getElementById("chatLog");

  if (openChat && closeChat && chatBox && chatInput && chatLog) {
    openChat.addEventListener("click", () => {
      chatBox.classList.remove("d-none");
      openChat.classList.add("d-none");
    });

    closeChat.addEventListener("click", () => {
      chatBox.classList.add("d-none");
      openChat.classList.remove("d-none");
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && chatInput.value.trim() !== "") {
        const question = chatInput.value.toLowerCase();
        let answer = "Maaf, saya belum paham pertanyaan itu 😅";

        if (question.includes("ppdb"))
          answer = "📢 PPDB dibuka setiap bulan Mei–Juni.";
        else if (question.includes("jurusan"))
          answer =
            "Kami memiliki jurusan TKJ, TKR, Akuntansi, dan Perbankan Syariah.";
        else if (question.includes("alamat"))
          answer =
            "🏫 Alamat kami: SMK Komputama Jeruklegi, Cilacap, Jawa Tengah.";
        else if (question.includes("guru"))
          answer = "Guru kami berpengalaman dan profesional di bidangnya!";
        else if (question.includes("terima kasih")) answer = "Sama-sama! 😊";

        chatLog.innerHTML += `<div><b>Anda:</b> ${chatInput.value}</div>`;
        chatLog.innerHTML += `<div class='text-primary'><b>Bot:</b> ${answer}</div>`;
        chatInput.value = "";
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    });
  }

  // ====== DARK MODE ======
  const darkBtn = document.getElementById("darkModeBtn");
  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
      );
    });

    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
    }
  }

  // ====== AOS INIT ======
  AOS.init({ duration: 1000, once: true });
});

// ====== KALENDER KEGIATAN SEKOLAH ======
document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // Kegiatan sekolah
  const events = {
    "2025-10-20": { name: "Rapat OSIS", type: "organisasi", desc: "Rapat OSIS di Aula Utama pukul 09.00" },
    "2025-10-25": { name: "Ujian Tengah Semester", type: "akademik", desc: "Dimulai pukul 07.30 di semua kelas" },
    "2025-11-01": { name: "Lomba Inovasi Siswa", type: "lomba", desc: "Ajang kreativitas dan teknologi antar jurusan" },
    "2025-12-15": { name: "Class Meeting", type: "hiburan", desc: "Perlombaan antar kelas sekaligus penutupan semester" },
    "2026-01-05": { name: "Penerimaan Rapor", type: "akademik", desc: "Pengambilan rapor di ruang wali kelas masing-masing" }
  };

  // Warna event berdasarkan jenisnya
  const eventColors = {
    akademik: "bg-primary text-white",
    organisasi: "bg-success text-white",
    lomba: "bg-warning text-dark",
    hiburan: "bg-danger text-white"
  };

  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    let html = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button id="prevMonth" class="btn btn-sm btn-outline-primary"><i class="bi bi-chevron-left"></i></button>
        <h5 class="mb-0">${firstDay.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h5>
        <button id="nextMonth" class="btn btn-sm btn-outline-primary"><i class="bi bi-chevron-right"></i></button>
      </div>
      <table class="table table-bordered text-center mb-0">
        <thead class="table-primary">
          <tr>
            <th>Min</th><th>Sen</th><th>Sel</th><th>Rab</th><th>Kam</th><th>Jum</th><th>Sab</th>
          </tr>
        </thead>
        <tbody><tr>
    `;

    for (let i = 0; i < startDay; i++) html += "<td></td>";

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = events[dateStr];
      const today = new Date();
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

      html += `
        <td class="calendar-day position-relative ${event ? eventColors[event.type] : ''} ${isToday ? 'border border-dark fw-bold' : ''}" 
            data-date="${dateStr}" 
            title="${event ? event.name : ''}">
          ${day}
          ${event ? `<i class="bi bi-dot position-absolute bottom-0 start-50 translate-middle-x"></i>` : ''}
        </td>
      `;

      if ((day + startDay) % 7 === 0 && day !== daysInMonth) html += "</tr><tr>";
    }

    html += "</tr></tbody></table>";
    calendar.innerHTML = html;

    // Navigasi bulan
    document.getElementById('prevMonth').addEventListener('click', () => {
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
      generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
      generateCalendar(currentMonth, currentYear);
    });

    // Klik tanggal
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.addEventListener('click', () => {
        const date = day.dataset.date;
        const event = events[date];
        if (event) {
          const modalBody = document.getElementById('eventModalBody');
          modalBody.innerHTML = `
            <h5>${event.name}</h5>
            <p class="mt-2">${event.desc}</p>
          `;
          const modal = new bootstrap.Modal(document.getElementById('eventModal'));
          modal.show();
        }
      });
    });
  }

  generateCalendar(currentMonth, currentYear);
});

// ====== Efek Suara Saat Modal Muncul ======
const modalEl = document.getElementById('eventModal');
if (modalEl) {
  modalEl.addEventListener('shown.bs.modal', () => {
    const sound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_f1d2439d28.mp3?filename=click-124467.mp3');
    sound.volume = 0.2; // kecil biar lembut
    sound.play();
  });
}

// ====== PENGUNJUNG ONLINE (LIVE COUNTER) ======
document.addEventListener("DOMContentLoaded", () => {
  const visitorCount = document.getElementById("visitorCount");
  const updateTime = document.getElementById("updateTime");

  function updateVisitors() {
    // Simulasi data pengunjung acak (misal antara 15 - 120)
    const count = Math.floor(Math.random() * 106) + 15;
    visitorCount.textContent = count.toLocaleString("id-ID");

    // Update waktu terakhir
    const now = new Date();
    updateTime.textContent = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  // Update pertama kali dan tiap 5 detik
  updateVisitors();
  setInterval(updateVisitors, 5000);
});


// ====== JAM DIGITAL ======
function updateClock() {
  const now = new Date();
  const waktu = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tanggal = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.getElementById("jamDigital").textContent = waktu;
  document.getElementById("tanggalSekarang").textContent = tanggal;
}
setInterval(updateClock, 1000);
updateClock();

// ====== CUACA CILACAP (PAKAI API OPEN-METE O GRATIS) ======
async function getWeather() {
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-7.73&longitude=109.00&current_weather=true&timezone=Asia%2FJakarta");
    const data = await res.json();
    const cuaca = data.current_weather;

    const suhu = cuaca.temperature;
    const kondisi = cuaca.weathercode;

    const kondisiCuaca = {
      0: "Cerah ☀️",
      1: "Cerah Berawan 🌤️",
      2: "Berawan ⛅",
      3: "Mendung ☁️",
      45: "Berkabut 🌫️",
      51: "Gerimis 🌦️",
      61: "Hujan 🌧️",
      71: "Hujan Salju ❄️",
    };

    document.getElementById("cuacaInfo").textContent = kondisiCuaca[kondisi] || "Tidak diketahui";
    document.getElementById("suhuSekarang").textContent = `${suhu}°C`;
    document.getElementById("statusCuaca").textContent = "Diperbarui otomatis setiap 10 menit";

    // Ganti warna background otomatis berdasarkan cuaca
    const section = document.getElementById("cuaca");
    if (kondisi <= 1) section.style.background = "linear-gradient(135deg, #a1c4fd, #c2e9fb)"; // cerah
    else if (kondisi <= 3) section.style.background = "linear-gradient(135deg, #d7d2cc, #304352)"; // mendung
    else if (kondisi >= 61) section.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)"; // hujan
  } catch (error) {
    document.getElementById("cuacaInfo").textContent = "Gagal memuat data cuaca 😢";
  }
}

getWeather();
setInterval(getWeather, 600000); // update tiap 10 menit

// Animasi tambahan untuk efek masuk (opsional)
document.addEventListener("DOMContentLoaded", () => {
  const guruCards = document.querySelectorAll(".guru-card");
  guruCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
});

// ====== BUKU TAMU INTERAKTIF ======
document.addEventListener("DOMContentLoaded", () => {
  const guestForm = document.getElementById("guestForm");
  const guestMessages = document.getElementById("guestMessages");

  // Muat pesan dari localStorage
  const savedMessages = JSON.parse(localStorage.getItem("guestbookMessages")) || [];
  savedMessages.forEach(msg => displayMessage(msg.name, msg.text, msg.time));

  guestForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const text = document.getElementById("guestMessage").value.trim();
    if (!name || !text) return;

    const time = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    // Simpan dan tampilkan pesan
    const newMsg = { name, text, time };
    savedMessages.push(newMsg);
    localStorage.setItem("guestbookMessages", JSON.stringify(savedMessages));

    displayMessage(name, text, time);

    guestForm.reset();
  });

  function displayMessage(name, text, time) {
    const div = document.createElement("div");
    div.classList.add("message-card");
    div.innerHTML = `
      <div class="message-name"><i class="bi bi-person-circle me-1"></i>${name}</div>
      <div class="message-text">"${text}"</div>
      <div class="message-time mt-1"><i class="bi bi-clock me-1"></i>${time}</div>
    `;
    guestMessages.prepend(div);
  }
});

// ====== BUKU TAMU INTERAKTIF + BALASAN ADMIN ======
document.addEventListener("DOMContentLoaded", () => {
  const guestForm = document.getElementById("guestForm");
  const guestMessages = document.getElementById("guestMessages");

  // Muat pesan dari localStorage
  const savedMessages = JSON.parse(localStorage.getItem("guestbookMessages")) || [];
  savedMessages.forEach(msg => displayMessage(msg.name, msg.text, msg.time, msg.isAdmin));

  guestForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const text = document.getElementById("guestMessage").value.trim();
    if (!name || !text) return;

    const time = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const newMsg = { name, text, time };
    savedMessages.push(newMsg);
    localStorage.setItem("guestbookMessages", JSON.stringify(savedMessages));

    displayMessage(name, text, time);

    guestForm.reset();

    // Balasan otomatis admin setelah 2 detik
    setTimeout(() => {
      const reply = generateReply(name);
      const adminMsg = { name: "Admin SMK Komputama", text: reply, time: new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      }), isAdmin: true };
      savedMessages.push(adminMsg);
      localStorage.setItem("guestbookMessages", JSON.stringify(savedMessages));
      displayMessage("Admin SMK Komputama", reply, adminMsg.time, true);
    }, 2000);
  });

  function displayMessage(name, text, time, isAdmin = false) {
    const div = document.createElement("div");
    div.classList.add("message-card");
    div.style.borderLeft = isAdmin ? "4px solid #ffc107" : "4px solid #0d6efd";
    div.innerHTML = `
      <div class="message-name">
        <i class="bi ${isAdmin ? 'bi-shield-check text-warning' : 'bi-person-circle text-primary'} me-1"></i>
        ${name}
      </div>
      <div class="message-text">"${text}"</div>
      <div class="message-time mt-1"><i class="bi bi-clock me-1"></i>${time}</div>
    `;
    guestMessages.prepend(div);
  }

  function generateReply(userName) {
    const replies = [
      `Terima kasih ${userName}! Salam sukses dan semangat selalu belajar di SMK Komputama 💪`,
      `Halo ${userName}, terima kasih sudah berkunjung! Kami bangga dengan dukunganmu 🙏`,
      `Hai ${userName}, semoga hari kamu menyenangkan! Tetap semangat mengejar cita-cita ya 🌟`,
      `Terima kasih ${userName}! Kami doakan sukses selalu dan terus berprestasi 🎓`,
      `Wah pesan yang baik, ${userName}! Salam hangat dari keluarga besar SMK Komputama ❤️`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
});

// ==== BUKU TAMU MODERN ====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestForm");
  const guestMessages = document.getElementById("guestMessages");

  // Efek animasi pesan baru
  const showMessage = (name, message) => {
    const msgBox = document.createElement("div");
    msgBox.className = "p-3 mb-3 border rounded shadow-sm bg-light animate__animated animate__fadeInUp";
    msgBox.innerHTML = `
      <strong class="text-primary"><i class="bi bi-person-circle me-2"></i>${name}</strong><br>
      <span>${message}</span>
    `;
    guestMessages.prepend(msgBox);
  };

  // Event saat form dikirim
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const message = document.getElementById("guestMessage").value.trim();

    if (name && message) {
      showMessage(name, message);
      form.reset();

      // Notifikasi kecil
      const alert = document.createElement("div");
      alert.className = "alert alert-success mt-3 animate__animated animate__fadeInDown";
      alert.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Terima kasih, pesan Anda telah dikirim!`;
      form.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    }
  });
});

  document.querySelectorAll('a.nav-link, .dropdown-item').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });


if (username === "siswa" && password === "12345") {
    localStorage.setItem("siswaLogin", JSON.stringify({ username }));
    window.location.href = "portal-siswa.html";
}




