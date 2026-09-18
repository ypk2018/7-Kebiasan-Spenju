import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { Trash2, UserPlus } from 'lucide-react';

interface AdminStudentsTabProps {
  showToast: (msg: string, type?: string) => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({ showToast }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [kelas, setKelas] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, username, password, kelas })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Siswa berhasil ditambahkan!');
        setModalOpen(false);
        setNama('');
        setUsername('');
        setPassword('123');
        setKelas('');
        fetchStudents();
      } else {
        showToast(data.message, 'danger');
      }
    } catch (e) {
      showToast('Gagal menambah siswa', 'danger');
    }
  };

  const handleDelete = async (uname: string) => {
    if (!confirm(`Hapus akun ${uname}?`)) return;
    try {
      const res = await fetch('/api/admin/delete-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Siswa berhasil dihapus', 'danger');
        fetchStudents();
      }
    } catch (e) {
      showToast('Gagal menghapus siswa', 'danger');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Kelola Siswa</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="py-2.5 px-5 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Tambah Siswa
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
              <th className="py-3 px-4 rounded-l-xl">No</th>
              <th className="py-3 px-4">Nama Lengkap</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Kelas</th>
              <th className="py-3 px-4 text-center rounded-r-xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">Memuat data...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">Belum ada data siswa.</td>
              </tr>
            ) : (
              students.map((s, idx) => (
                <tr key={s.username} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{s.nama}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{s.username}</td>
                  <td className="py-3 px-4">{s.kelas || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(s.username)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Siswa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Tambah Akun Siswa</h4>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Kelas</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                  placeholder="Contoh: 1-A"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
