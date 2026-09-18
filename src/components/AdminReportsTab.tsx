import React, { useState, useEffect } from 'react';
import { Student, HabitsRecord, SchoolSettings } from '../types';

interface AdminReportsTabProps {
  showToast: (msg: string, type?: string) => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({ showToast }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState<{ user: Student; habits: HabitsRecord } | null>(null);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [printMode, setPrintMode] = useState<'bulanan' | 'umum'>('bulanan');
  const [showPrintSection, setShowPrintSection] = useState(false);

  useEffect(() => {
    fetch('/api/admin/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        if (data.length > 0) setSelectedStudent(data[0].username);
      });

    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  const handleFetchReport = async () => {
    if (!selectedStudent) {
      showToast('Pilih siswa terlebih dahulu!', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/report?username=${selectedStudent}`);
      const data = await res.json();
      if (data && data.user) {
        setReportData(data);
        setShowPrintSection(true);
        showToast('Data siap dicetak!');
      } else {
        showToast('Data kosong.', 'danger');
      }
    } catch (e) {
      showToast('Gagal menarik data laporan', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (mode: 'bulanan' | 'umum') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const monthNames = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const habitsList = [
    { key: 'bangun', name: 'Bangun Pagi', cols: ['Pukul/Jam'] },
    { key: 'ibadah', name: 'Beribadah', cols: ['Subuh', 'Dzuhur', 'Ashar', 'Magrib', 'Isya', 'Keterangan'] },
    { key: 'olahraga', name: 'Berolahraga', cols: ['Jenis Olahraga'] },
    { key: 'makan', name: 'Makan Sehat dan Bergizi', cols: ['Menu Makanan Sehat'] },
    { key: 'belajar', name: 'Gemar Belajar', cols: ['Materi Pelajaran'] },
    { key: 'masyarakat', name: 'Bermasyarakat', cols: ['Kegiatan Sosial'] },
    { key: 'tidur', name: 'Tidur Cepat', cols: ['Jam Tidur'] }
  ];

  const daysInMonth = new Date(year, month, 0).getDate();
  const schoolName = settings?.nama_sekolah || 'Jurnal_Hebat';
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(schoolName)}&scale=2&includetext=true`;

  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800 no-print">Cetak Laporan Siswa</h3>

      {/* Control panel */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 no-print">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Pilih Siswa</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.username} value={s.username}>
                  {s.nama} ({s.username})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Bulan Cetak</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthNames.slice(1).map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Tahun</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleFetchReport}
              disabled={loading}
              className="w-full py-2.5 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all"
            >
              {loading ? 'Memuat...' : 'Tarik Data'}
            </button>
          </div>
        </div>
      </div>

      {showPrintSection && reportData && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 no-print shadow-sm">
          <span>Pilih format laporan cetak:</span>
          <div className="flex gap-3">
            <button
              onClick={() => handlePrint('bulanan')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow transition-all"
            >
              Cetak Detail (Per Lembar)
            </button>
            <button
              onClick={() => handlePrint('umum')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow transition-all"
            >
              Cetak Rekap Umum
            </button>
          </div>
        </div>
      )}

      {/* Print-only container */}
      <div id="print-container" className="hidden print:block bg-white p-8 text-black text-sm">
        {/* Kop Surat */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
          <img src={settings?.logo_daerah || ''} className="w-16 h-16 object-contain" alt="Logo Kiri" />
          <div className="text-center flex-1 px-4">
            <h5 className="text-xs uppercase font-bold tracking-wide">{settings?.pemerintah}</h5>
            <h4 className="text-lg uppercase font-black">{settings?.nama_sekolah}</h4>
            <p className="text-xs">{settings?.alamat}</p>
          </div>
          <img src={settings?.logo_sekolah || ''} className="w-16 h-16 object-contain" alt="Logo Kanan" />
        </div>

        <div className="text-right mb-4">
          <img src={barcodeUrl} className="h-10 ml-auto object-contain" alt="Barcode" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <table className="text-xs border-none">
              <tbody>
                <tr>
                  <td className="font-bold py-0.5 pr-2">Nama</td>
                  <td>: {reportData?.user.nama}</td>
                </tr>
                <tr>
                  <td className="font-bold py-0.5 pr-2">Kelas</td>
                  <td>: {reportData?.user.kelas || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="text-xs border-none">
              <tbody>
                <tr>
                  <td className="font-bold py-0.5 pr-2">Bulan</td>
                  <td>: {monthNames[month]}</td>
                </tr>
                <tr>
                  <td className="font-bold py-0.5 pr-2">Tahun</td>
                  <td>: {year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {printMode === 'bulanan' ? (
          <div className="space-y-8">
            {habitsList.map((h, idx) => (
              <div key={h.key} className="page-break-after">
                <div className="text-center mb-3">
                  <h5 className="font-bold uppercase text-xs">BUKU JURNAL</h5>
                  <h6 className="font-bold text-sm">Tujuh Kebiasaan Anak Indonesia Hebat</h6>
                </div>
                <h6 className="font-bold text-center underline uppercase mb-3 text-xs">
                  {idx + 1}. Jurnal {h.name}
                </h6>
                <table className="w-full border-collapse border border-black text-center text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-1.5 w-12">Tanggal</th>
                      {h.cols.map((col, i) => (
                        <th key={i} className="border border-black p-1.5">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                      const targetDate = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const entries = reportData?.habits[h.key]
                        ? reportData.habits[h.key].filter((e) => e.tgl === targetDate)
                        : [];
                      const entry = entries.length > 0 ? entries[0] : null;

                      return (
                        <tr key={d}>
                          <td className="border border-black p-1">{d}</td>
                          {h.key === 'ibadah' ? (
                            <>
                              <td className="border border-black p-1">{entry?.detail1?.includes('Subuh') ? 'V' : ''}</td>
                              <td className="border border-black p-1">{entry?.detail1?.includes('Dzuhur') ? 'V' : ''}</td>
                              <td className="border border-black p-1">{entry?.detail1?.includes('Ashar') ? 'V' : ''}</td>
                              <td className="border border-black p-1">{entry?.detail1?.includes('Magrib') ? 'V' : ''}</td>
                              <td className="border border-black p-1">{entry?.detail1?.includes('Isya') ? 'V' : ''}</td>
                              <td className="border border-black p-1 text-left px-2">{entry?.detail2 || ''}</td>
                            </>
                          ) : (
                            <td className="border border-black p-1 text-left px-2">
                              {entry ? (entry.detail1 ? entry.detail1 : 'Dilaksanakan (V)') : ''}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Tanda Tangan */}
                <div className="grid grid-cols-2 gap-8 text-center text-xs mt-6 pt-4 page-break-inside-avoid">
                  <div>
                    <p>Mengetahui,<br />Kepala Sekolah</p>
                    <div className="h-12 my-2 flex items-center justify-center">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(settings?.nama_kepsek || '')}`} className="h-12 object-contain" alt="QR" />
                    </div>
                    <p className="font-bold underline">{settings?.nama_kepsek || '____________________'}</p>
                    <p>NIP. {settings?.nip_kepsek || '...................'}</p>
                  </div>
                  <div>
                    <p>{settings?.tempat_ttd || ''}, {todayStr}<br />Wali Kelas / Guru Kelas</p>
                    <div className="h-12 my-2 flex items-center justify-center">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(settings?.nama_guru || '')}`} className="h-12 object-contain" alt="QR" />
                    </div>
                    <p className="font-bold underline">{settings?.nama_guru || '____________________'}</p>
                    <p>NIP. {settings?.nip_guru || '...................'}</p>
                  </div>
                </div>
                <div className="text-center mt-6 text-xs">
                  <p>Mengetahui,</p>
                  <p className="mb-8">Orang Tua/Wali</p>
                  <p className="font-bold">...................................</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <h5 className="font-bold uppercase text-sm">REKAP PEMANTAUAN</h5>
              <h6 className="font-bold text-xs">Tujuh Kebiasaan Anak Indonesia Hebat</h6>
            </div>
            <table className="w-full border-collapse border border-black text-center text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 w-12">No</th>
                  <th className="border border-black p-2 text-left">Tujuh Kebiasaan Anak Indonesia Hebat</th>
                  <th className="border border-black p-2 w-32">Belum Terbiasa</th>
                  <th className="border border-black p-2 w-32">Sudah Terbiasa</th>
                </tr>
              </thead>
              <tbody>
                {habitsList.map((h, idx) => {
                  const isTerbiasa =
                    reportData?.habits[h.key] &&
                    reportData.habits[h.key].some((entry) =>
                      entry.tgl.startsWith(`${year}-${String(month).padStart(2, '0')}`)
                    );

                  return (
                    <tr key={h.key}>
                      <td className="border border-black p-2">{idx + 1}</td>
                      <td className="border border-black p-2 text-left font-semibold">{h.name}</td>
                      <td className="border border-black p-2">{!isTerbiasa ? 'V' : ''}</td>
                      <td className="border border-black p-2">{isTerbiasa ? 'V' : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 border border-black p-2 text-xs min-h-[70px]">
              <p className="font-bold mb-1">Kesimpulan / Tanggapan Orangtua:</p>
              <p className="text-gray-600 text-[10px]">Tanggapan tentang Tujuh Kebiasaan Anak Indonesia Hebat yang dilakukan peserta didik di rumah:</p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs mt-8 page-break-inside-avoid">
              <div>
                <p>Mengetahui,<br />Kepala Sekolah</p>
                <div className="h-12 my-2 flex items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(settings?.nama_kepsek || '')}`} className="h-12 object-contain" alt="QR" />
                </div>
                <p className="font-bold underline">{settings?.nama_kepsek || '____________________'}</p>
                <p>NIP. {settings?.nip_kepsek || '...................'}</p>
              </div>
              <div>
                <p>{settings?.tempat_ttd || ''}, {todayStr}<br />Wali Kelas / Guru Kelas</p>
                <div className="h-12 my-2 flex items-center justify-center">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(settings?.nama_guru || '')}`} className="h-12 object-contain" alt="QR" />
                </div>
                <p className="font-bold underline">{settings?.nama_guru || '____________________'}</p>
                <p>NIP. {settings?.nip_guru || '...................'}</p>
              </div>
            </div>
            <div className="text-center mt-8 text-xs">
              <p>Mengetahui,</p>
              <p className="mb-8">Orang Tua/Wali</p>
              <p className="font-bold">...................................</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
