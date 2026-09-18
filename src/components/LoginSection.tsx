import React, { useState } from 'react';
import { Award, User, Lock, GraduationCap, ShieldCheck } from 'lucide-react';
import { Student } from '../types';

interface LoginSectionProps {
  students: Student[];
  onLoginSiswa: (username: string, pass: string) => void;
  onLoginAdmin: (user: string, pass: string) => void;
  loading: boolean;
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  students,
  onLoginSiswa,
  onLoginAdmin,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'admin'>('siswa');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [passSiswa, setPassSiswa] = useState('');
  const [userAdmin, setUserAdmin] = useState('');
  const [passAdmin, setPassAdmin] = useState('');

  const handleSiswaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    onLoginSiswa(selectedStudent, passSiswa);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAdmin(userAdmin, passAdmin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A896] to-[#02C39A] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A896]/10 text-[#00A896] mb-3 shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Jurnal 7 Kebiasaan</h2>
          <p className="text-sm text-gray-500 mt-1">Anak Indonesia Hebat - Gerakan Profil Pelajar Pancasila</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-full mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('siswa')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab === 'siswa' ? 'bg-[#00A896] text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Siswa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin' ? 'bg-[#00A896] text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Guru / Admin
          </button>
        </div>

        {activeTab === 'siswa' ? (
          <form onSubmit={handleSiswaSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Pilih Nama Siswa</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-gray-50"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">-- Pilih Nama Siswa --</option>
                {students.map((s) => (
                  <option key={s.username} value={s.username}>
                    {s.nama} ({s.kelas || 'Kelas -'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kata Sandi (Default: 123)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-gray-50"
                  placeholder="Masukkan kata sandi"
                  value={passSiswa}
                  onChange={(e) => setPassSiswa(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-lg shadow-[#00A896]/30 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sebagai Siswa'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Username Guru / Admin</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-gray-50"
                  placeholder="Contoh: admin atau guru"
                  value={userAdmin}
                  onChange={(e) => setUserAdmin(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kata Sandi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A896] bg-gray-50"
                  placeholder="Masukkan password admin/guru"
                  value={passAdmin}
                  onChange={(e) => setPassAdmin(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-lg shadow-[#00A896]/30 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sebagai Guru'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
