import React, { useState } from 'react';
import { Student } from '../types';

interface StudentProfileProps {
  currentUser: Student;
  onUpdateProfile: (kelas: string, cita_cita: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  currentUser,
  onUpdateProfile
}) => {
  const [kelas, setKelas] = useState(currentUser.kelas || '');
  const [citaCita, setCitaCita] = useState(currentUser.cita_cita || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onUpdateProfile(kelas, citaCita);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800">Data Diri Saya</h3>
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 font-medium"
                value={currentUser.nama}
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 font-medium"
                value={currentUser.username}
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kelas</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Contoh: 1-A"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Cita-cita</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                value={citaCita}
                onChange={(e) => setCitaCita(e.target.value)}
                placeholder="Contoh: Dokter"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 py-3 px-6 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};
