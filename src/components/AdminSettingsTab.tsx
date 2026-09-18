import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../types';

interface AdminSettingsTabProps {
  showToast: (msg: string, type?: string) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<SchoolSettings>({
    pemerintah: '',
    nama_sekolah: '',
    alamat: '',
    logo_daerah: '',
    logo_sekolah: '',
    nama_guru: '',
    nip_guru: '',
    nama_kepsek: '',
    nip_kepsek: '',
    tempat_ttd: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Info sekolah & Logo berhasil disimpan!');
      }
    } catch (e) {
      showToast('Gagal menyimpan pengaturan', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800">Pengaturan Info Sekolah & Laporan</h3>
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h6 className="font-bold text-[#00A896]">Kop Surat & Logo</h6>
            <p className="text-xs text-gray-500">Gunakan link langsung ke gambar JPG/PNG untuk logo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Link Logo Daerah (Kiri)</label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="logo_daerah"
                  value={settings.logo_daerah || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Link Logo Sekolah (Kanan)</label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="logo_sekolah"
                  value={settings.logo_sekolah || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Pemerintah (Dinas Pendidikan)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="pemerintah"
                  value={settings.pemerintah || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="nama_sekolah"
                  value={settings.nama_sekolah || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="alamat"
                  value={settings.alamat || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h6 className="font-bold text-[#00A896]">Pengesahan (Tanda Tangan)</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Wali/Guru Kelas</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="nama_guru"
                  value={settings.nama_guru || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">NIP Guru</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="nip_guru"
                  value={settings.nip_guru || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="nama_kepsek"
                  value={settings.nama_kepsek || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="nip_kepsek"
                  value={settings.nip_kepsek || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Tempat Tanda Tangan</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
                  name="tempat_ttd"
                  value={settings.tempat_ttd || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all"
          >
            {loading ? 'Menyimpan...' : 'Simpan Data Pengaturan'}
          </button>
        </form>
      </div>
    </div>
  );
};
