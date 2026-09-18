import React, { useState, useEffect } from 'react';
import { TrackingLog } from '../types';

export const AdminTrackerTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState<TrackingLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (date: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tracker?date=${date}`);
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold text-gray-800">Pantau Harian Laporan GPS & IP</h3>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Pilih Tanggal</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => fetchLogs(selectedDate)}
            className="py-2.5 px-6 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all"
          >
            Tarik Data
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Fitur ini membantu mengecek apakah satu HP digunakan untuk mengisi jurnal banyak siswa secara bersamaan.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
                <th className="py-3 px-4 rounded-l-xl">Waktu Submit</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kebiasaan</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 rounded-r-xl">Lokasi Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">Memuat data GPS...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">Belum ada yang mengisi jurnal pada tanggal ini.</td>
                </tr>
              ) : (
                logs.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{t.time}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{t.nama}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{t.type}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{t.ip}</td>
                    <td className="py-3 px-4">
                      {t.lat && t.lat !== '-' ? (
                        <a
                          href={`https://www.google.com/maps?q=${t.lat},${t.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold border border-sky-200 transition-colors inline-block"
                        >
                          Cek Lokasi
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Tidak ada GPS</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
