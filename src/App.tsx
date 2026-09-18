import React, { useState, useEffect } from 'react';
import { Student, HabitsRecord } from './types';
import { LoginSection } from './components/LoginSection';
import { Sidebar } from './components/Sidebar';
import { StudentHome } from './components/StudentHome';
import { StudentProfile } from './components/StudentProfile';
import { AdminDashTab } from './components/AdminDashTab';
import { AdminTrackerTab } from './components/AdminTrackerTab';
import { AdminStudentsTab } from './components/AdminStudentsTab';
import { AdminSettingsTab } from './components/AdminSettingsTab';
import { AdminReportsTab } from './components/AdminReportsTab';
import { HabitModal } from './components/HabitModals';
import { Menu } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [role, setRole] = useState<'siswa' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [currentHabits, setCurrentHabits] = useState<HabitsRecord>({});
  const [activeTab, setActiveTab] = useState('tab-home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientIP, setClientIP] = useState('-');
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    title: '',
    label: '',
    inputType: 'text'
  });

  // Fetch IP & Initial Data
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d) => setClientIP(d.ip))
      .catch(() => setClientIP('127.0.0.1'));

    fetch('/api/initial-data')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.students) {
          setStudents(data.students);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleLoginSiswa = async (username: string, pass: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login-siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setCurrentHabits(data.habits);
        setRole('siswa');
        setActiveTab('tab-home');
        showToast('Berhasil masuk sebagai siswa!');
      } else {
        showToast(data.message, 'danger');
      }
    } catch (e) {
      showToast('Koneksi ke server gagal', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAdmin = async (user: string, pass: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await res.json();
      if (data.success) {
        setRole('admin');
        setActiveTab('tab-admin-dash');
        showToast('Berhasil masuk sebagai guru!');
      } else {
        showToast(data.message, 'danger');
      }
    } catch (e) {
      showToast('Koneksi ke server gagal', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    setCurrentHabits({});
    setActiveTab('tab-home');
    showToast('Berhasil keluar');
  };

  const handleOpenModal = (type: string, title: string, label: string, inputType: string) => {
    setModalConfig({ isOpen: true, type, title, label, inputType });
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSaveHabit = (type: string, tgl: string, detail1: string, detail2 = '') => {
    if (!currentUser) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendHabitToServer(type, tgl, detail1, detail2, pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          sendHabitToServer(type, tgl, detail1, detail2, '', '');
        }
      );
    } else {
      sendHabitToServer(type, tgl, detail1, detail2, '', '');
    }
  };

  const sendHabitToServer = async (
    type: string,
    tgl: string,
    detail1: string,
    detail2: string,
    lat: any,
    lng: any
  ) => {
    try {
      const res = await fetch('/api/save-habit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser?.username,
          type,
          tgl,
          detail1,
          detail2,
          lat,
          lng,
          ip: clientIP
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentHabits(data.habits);
        showToast('Jurnal berhasil disimpan!');
      }
    } catch (e) {
      showToast('Gagal menyimpan jurnal', 'danger');
    }
  };

  const handleUpdateProfile = async (kelas: string, cita_cita: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          kelas,
          cita_cita
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser({ ...currentUser, kelas, cita_cita });
        showToast('Profil berhasil diperbarui!');
      }
    } catch (e) {
      showToast('Gagal memperbarui profil', 'danger');
    }
  };

  if (loading && !role) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00A896] border-t-transparent mb-4"></div>
        <h5 className="text-[#00A896] font-bold text-lg">Memuat Data...</h5>
        <p className="text-gray-500 text-sm mt-1">Menghubungkan ke Server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FBFB] text-[#2D3436] flex flex-col font-sans">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-white shadow-lg text-sm font-medium animate-fadeIn ${
              t.type === 'danger' ? 'bg-rose-600' : t.type === 'warning' ? 'bg-amber-600' : 'bg-emerald-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {!role ? (
        <LoginSection
          students={students}
          onLoginSiswa={handleLoginSiswa}
          onLoginAdmin={handleLoginAdmin}
          loading={loading}
        />
      ) : (
        <div className="flex w-full min-h-screen">
          <Sidebar
            role={role}
            activeTab={activeTab}
            onSwitchTab={setActiveTab}
            onOpenModal={handleOpenModal}
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 lg:ml-[280px] p-4 md:p-8 flex flex-col min-h-screen">
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center bg-gradient-to-br from-[#00A896] to-[#02C39A] text-white p-4 rounded-2xl mb-6 shadow-md no-print">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h6 className="font-bold m-0">Jurnal 7 Kebiasaan</h6>
              <div className="w-6" />
            </div>

            <div className="flex-1">
              {role === 'siswa' && activeTab === 'tab-home' && currentUser && (
                <StudentHome
                  currentUser={currentUser}
                  currentHabits={currentHabits}
                  onOpenModal={handleOpenModal}
                />
              )}
              {role === 'siswa' && activeTab === 'tab-profile' && currentUser && (
                <StudentProfile
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
              {role === 'admin' && activeTab === 'tab-admin-dash' && (
                <AdminDashTab students={students} />
              )}
              {role === 'admin' && activeTab === 'tab-admin-tracker' && (
                <AdminTrackerTab />
              )}
              {role === 'admin' && activeTab === 'tab-admin-students' && (
                <AdminStudentsTab showToast={showToast} />
              )}
              {role === 'admin' && activeTab === 'tab-admin-settings' && (
                <AdminSettingsTab showToast={showToast} />
              )}
              {role === 'admin' && activeTab === 'tab-admin-reports' && (
                <AdminReportsTab showToast={showToast} />
              )}
            </div>
          </main>
        </div>
      )}

      <HabitModal
        modalConfig={modalConfig}
        onClose={handleCloseModal}
        onSubmitHabit={handleSaveHabit}
      />
    </div>
  );
}
