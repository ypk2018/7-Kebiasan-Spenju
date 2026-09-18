import React from 'react';
import { Sun, Heart, Bike, Utensils, BookOpen, Users, Moon, Info } from 'lucide-react';
import { Student, HabitsRecord } from '../types';

interface StudentHomeProps {
  currentUser: Student;
  currentHabits: HabitsRecord;
  onOpenModal: (type: string, title: string, label: string, inputType: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  currentUser,
  currentHabits,
  onOpenModal
}) => {
  const today = new Date().toISOString().split('T')[0];

  const habitsList = [
    { key: 'bangun', label: 'Bangun Pagi', icon: Sun, color: 'text-amber-500', modalType: 'bangun', title: 'Bangun Pagi', labelInput: 'Pukul Bangun', inputType: 'time' },
    { key: 'ibadah', label: 'Beribadah', icon: Heart, color: 'text-rose-500', modalType: 'ibadah', title: 'Beribadah', labelInput: 'Ibadah Selesai', inputType: 'ibadah' },
    { key: 'olahraga', label: 'Berolahraga', icon: Bike, color: 'text-emerald-500', modalType: 'olahraga', title: 'Berolahraga', labelInput: 'Jenis Olahraga', inputType: 'text' },
    { key: 'makan', label: 'Makan Sehat', icon: Utensils, color: 'text-orange-500', modalType: 'makan', title: 'Makan Sehat & Bergizi', labelInput: 'Menu Makanan', inputType: 'text' },
    { key: 'belajar', label: 'Gemar Belajar', icon: BookOpen, color: 'text-blue-500', modalType: 'belajar', title: 'Gemar Belajar', labelInput: 'Materi Pelajaran', inputType: 'text' },
    { key: 'masyarakat', label: 'Bermasyarakat', icon: Users, color: 'text-indigo-500', modalType: 'masyarakat', title: 'Bermasyarakat', labelInput: 'Kegiatan Sosial', inputType: 'text' },
    { key: 'tidur', label: 'Tidur Cepat', icon: Moon, color: 'text-purple-500', modalType: 'tidur', title: 'Tidur Cepat', labelInput: 'Jam Tidur', inputType: 'time' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#00A896] to-[#b0c4de] text-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-2">
          Semangat Pagi, <span className="underline decoration-white/40">{currentUser.nama}</span>!
        </h2>
        <p className="text-white/90 font-medium text-lg">
          Mari budayakan 7 kebiasaan positif setiap hari menuju Indonesia Emas 2045.
        </p>
      </div>

      {/* Info notice */}
      <div className="bg-sky-50 border border-sky-100 text-sky-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
        <Info className="w-5 h-5 text-sky-600 shrink-0" />
        <div className="text-sm">
          <strong>Penting:</strong> Status "SELESAI" hanya akan muncul jika Anda telah mengisi jurnal pada hari/tanggal saat ini.
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {habitsList.map((h) => {
          const IconComp = h.icon;
          const doneToday =
            currentHabits[h.key] &&
            currentHabits[h.key].some((entry) => entry.tgl === today);

          return (
            <div
              key={h.key}
              onClick={() => onOpenModal(h.modalType, h.title, h.labelInput, h.inputType)}
              className="bg-gradient-to-br from-[#e5e4e2] to-[#b0c4de] border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00A896] to-[#b0c4de] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform">
                <IconComp className="w-7 h-7 text-white" />
              </div>
              <h6 className="font-bold text-gray-800 text-sm mb-3">{h.label}</h6>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  doneToday ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {doneToday ? 'SELESAI' : 'BELUM SELESAI'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
