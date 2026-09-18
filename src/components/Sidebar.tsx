import React from 'react';
import {
  Award,
  Home,
  User,
  Sun,
  Heart,
  Bike,
  Utensils,
  BookOpen,
  Users,
  Moon,
  BarChart2,
  Target,
  Users2,
  Settings,
  Printer,
  LogOut,
  Menu
} from 'lucide-react';

interface SidebarProps {
  role: 'siswa' | 'admin';
  activeTab: string;
  onSwitchTab: (tabId: string) => void;
  onOpenModal: (type: string, title: string, label: string, inputType: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onSwitchTab,
  onOpenModal,
  onLogout,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-gray-200 z-50 p-6 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-[#00A896] text-white p-2.5 rounded-xl shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider">JURNAL 7 KEBIASAAN</div>
            <h6 className="text-sm font-bold text-[#00A896]">
              {role === 'siswa' ? 'MENU SISWA' : 'MENU ADMIN'}
            </h6>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {role === 'siswa' ? (
            <>
              <button
                onClick={() => { onSwitchTab('tab-home'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-home'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <Home className="w-4 h-4" /> Beranda
              </button>
              <button
                onClick={() => { onSwitchTab('tab-profile'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-profile'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <User className="w-4 h-4" /> Profil Saya
              </button>

              <div className="text-[11px] font-bold uppercase text-gray-400 px-3 pt-4 pb-2 tracking-wider">
                Input Harian
              </div>

              <button
                onClick={() => { onOpenModal('bangun', 'Bangun Pagi', 'Pukul Bangun', 'time'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Sun className="w-4 h-4 text-amber-500" /> 1. Bangun Pagi
              </button>
              <button
                onClick={() => { onOpenModal('ibadah', 'Beribadah', 'Ibadah Selesai', 'ibadah'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Heart className="w-4 h-4 text-rose-500" /> 2. Beribadah
              </button>
              <button
                onClick={() => { onOpenModal('olahraga', 'Berolahraga', 'Jenis Olahraga', 'text'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Bike className="w-4 h-4 text-emerald-500" /> 3. Berolahraga
              </button>
              <button
                onClick={() => { onOpenModal('makan', 'Makan Sehat & Bergizi', 'Menu Makanan', 'text'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Utensils className="w-4 h-4 text-orange-500" /> 4. Makan Sehat
              </button>
              <button
                onClick={() => { onOpenModal('belajar', 'Gemar Belajar', 'Materi Pelajaran', 'text'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-500" /> 5. Gemar Belajar
              </button>
              <button
                onClick={() => { onOpenModal('masyarakat', 'Bermasyarakat', 'Kegiatan Sosial', 'text'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Users className="w-4 h-4 text-indigo-500" /> 6. Bermasyarakat
              </button>
              <button
                onClick={() => { onOpenModal('tidur', 'Tidur Cepat', 'Jam Tidur', 'time'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 hover:text-[#00A896] transition-all"
              >
                <Moon className="w-4 h-4 text-purple-500" /> 7. Tidur Cepat
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { onSwitchTab('tab-admin-dash'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-admin-dash'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => { onSwitchTab('tab-admin-tracker'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-admin-tracker'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <Target className="w-4 h-4" /> Pantau Harian (GPS)
              </button>
              <button
                onClick={() => { onSwitchTab('tab-admin-students'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-admin-students'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <Users2 className="w-4 h-4" /> Kelola Siswa
              </button>
              <button
                onClick={() => { onSwitchTab('tab-admin-settings'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-admin-settings'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <Settings className="w-4 h-4" /> Info Sekolah
              </button>
              <button
                onClick={() => { onSwitchTab('tab-admin-reports'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'tab-admin-reports'
                    ? 'bg-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#00A896]'
                }`}
              >
                <Printer className="w-4 h-4" /> Cetak Laporan
              </button>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>

        {/* Anti-tamper footer credit */}
        <div
          id="footer-credit"
          className="mt-4 text-center py-2.5 px-3 rounded-xl text-xs font-bold bg-[#2D3436] text-[#E5E4E2] shadow-inner tracking-wide"
          style={{ textShadow: '-1px -1px 1px rgba(255,255,255,0.2), 1px 1px 1px rgba(0,0,0,0.8)' }}
        >
          Design Oleh "Yefri Haryanto - www.yefriharyanto.id"
        </div>
      </aside>
    </>
  );
};
