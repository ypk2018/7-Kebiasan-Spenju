import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with sensible default seed data
let students = [
  { nama: "Ahmad Zaki", username: "zaki", password: "123", kelas: "1-A", cita_cita: "Dokter" },
  { nama: "Siti Aisyah", username: "aisyah", password: "123", kelas: "1-A", cita_cita: "Guru" },
  { nama: "Budi Santoso", username: "budi", password: "123", kelas: "1-B", cita_cita: "Pilot" },
  { nama: "Dewi Lestari", username: "dewi", password: "123", kelas: "1-B", cita_cita: "Ilmuwan" }
];

let habitsData: Record<string, Record<string, Array<{ tgl: string; detail1: string; detail2?: string }>>> = {
  "zaki": {
    "bangun": [{ tgl: new Date().toISOString().split('T')[0], detail1: "05:00" }],
    "ibadah": [{ tgl: new Date().toISOString().split('T')[0], detail1: "Subuh, Dzuhur, Ashar", detail2: "" }]
  }
};

let trackingLogs: Array<{ time: string; nama: string; type: string; ip: string; lat: string; lng: string; date: string }> = [
  {
    time: new Date().toLocaleTimeString(),
    nama: "Ahmad Zaki",
    type: "Bangun Pagi",
    ip: "192.168.1.10",
    lat: "-6.2088",
    lng: "106.8456",
    date: new Date().toISOString().split('T')[0]
  }
];

let schoolSettings = {
  pemerintah: "PEMERINTAH KOTA JAKARTA PUSAT",
  nama_sekolah: "SD NEGERI 01 MENTENG",
  alamat: "Jl. Cikini Raya No. 42, Jakarta Pusat",
  logo_daerah: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_Kementerian_Pendidikan_dan_Kebudayaan.svg",
  logo_sekolah: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Coat_of_arms_of_Jakarta.svg",
  nama_guru: "Dra. Hj. Nurul Hidayah, M.Pd.",
  nip_guru: "197501012000032001",
  nama_kepsek: "Drs. H. Suwandi, M.Si.",
  nip_kepsek: "196812121990031005",
  tempat_ttd: "Jakarta"
};

// API Endpoints
app.get("/api/initial-data", (req, res) => {
  res.json({
    students: students.map(s => ({ nama: s.nama, username: s.username, kelas: s.kelas })),
    settings: schoolSettings
  });
});

app.post("/api/login-siswa", (req, res) => {
  const { username, password } = req.body;
  const student = students.find(s => s.username === username && s.password === password);
  if (student) {
    res.json({
      success: true,
      user: { nama: student.nama, username: student.username, kelas: student.kelas, cita_cita: student.cita_cita },
      habits: habitsData[username] || {}
    });
  } else {
    res.json({ success: false, message: "Username atau Kata Sandi Salah!" });
  }
});

app.post("/api/login-admin", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ success: true });
  } else if (username === "guru" && password === "guru123") {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Username atau Password Guru Salah!" });
  }
});

app.post("/api/save-habit", (req, res) => {
  const { username, type, tgl, detail1, detail2, lat, lng, ip } = req.body;
  if (!habitsData[username]) habitsData[username] = {};
  if (!habitsData[username][type]) habitsData[username][type] = [];

  // Remove existing entry for same date if any, or prepend
  habitsData[username][type] = habitsData[username][type].filter(e => e.tgl !== tgl);
  habitsData[username][type].unshift({ tgl, detail1, detail2 });

  const student = students.find(s => s.username === username);
  const studentName = student ? student.nama : username;

  trackingLogs.unshift({
    time: new Date().toLocaleTimeString(),
    nama: studentName,
    type: type.toUpperCase(),
    ip: ip || "127.0.0.1",
    lat: lat || "-",
    lng: lng || "-",
    date: tgl
  });

  res.json({ success: true, habits: habitsData[username] });
});

app.post("/api/update-profile", (req, res) => {
  const { username, kelas, cita_cita } = req.body;
  const student = students.find(s => s.username === username);
  if (student) {
    student.kelas = kelas;
    student.cita_cita = cita_cita;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Siswa tidak ditemukan" });
  }
});

app.get("/api/admin/students", (req, res) => {
  res.json(students);
});

app.post("/api/admin/add-student", (req, res) => {
  const { nama, username, password, kelas } = req.body;
  if (students.some(s => s.username === username)) {
    return res.json({ success: false, message: "Username sudah digunakan!" });
  }
  students.push({ nama, username, password: password || "123", kelas, cita_cita: "" });
  res.json({ success: true });
});

app.post("/api/admin/delete-student", (req, res) => {
  const { username } = req.body;
  students = students.filter(s => s.username !== username);
  delete habitsData[username];
  res.json({ success: true });
});

app.get("/api/admin/settings", (req, res) => {
  res.json(schoolSettings);
});

app.post("/api/admin/settings", (req, res) => {
  schoolSettings = { ...schoolSettings, ...req.body };
  res.json({ success: true });
});

app.get("/api/admin/tracker", (req, res) => {
  const date = req.query.date as string;
  if (!date) {
    return res.json(trackingLogs);
  }
  const filtered = trackingLogs.filter(l => l.date === date);
  res.json(filtered);
});

app.get("/api/admin/report", (req, res) => {
  const username = req.query.username as string;
  const student = students.find(s => s.username === username);
  if (!student) {
    return res.json({ error: true, message: "Siswa tidak ditemukan" });
  }
  res.json({
    user: { nama: student.nama, username: student.username, kelas: student.kelas, cita_cita: student.cita_cita },
    habits: habitsData[username] || {}
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
