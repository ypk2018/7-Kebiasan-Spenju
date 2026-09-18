import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HabitModalProps {
  modalConfig: {
    isOpen: boolean;
    type: string;
    title: string;
    label: string;
    inputType: string;
  };
  onClose: () => void;
  onSubmitHabit: (type: string, tgl: string, detail1: string, detail2?: string) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  modalConfig,
  onClose,
  onSubmitHabit
}) => {
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [detail1, setDetail1] = useState('');
  const [sholatList, setSholatList] = useState<string[]>([]);
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);

  if (!modalConfig.isOpen) return null;

  const handleCheckboxChange = (sholatName: string) => {
    if (sholatList.includes(sholatName)) {
      setSholatList(sholatList.filter((s) => s !== sholatName));
    } else {
      setSholatList([...sholatList, sholatName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (modalConfig.inputType === 'ibadah') {
      const sholatStr = sholatList.join(', ');
      onSubmitHabit('ibadah', tgl, sholatStr, keterangan);
    } else {
      onSubmitHabit(modalConfig.type, tgl, detail1);
    }

    setTimeout(() => {
      setLoading(false);
      setDetail1('');
      setSholatList([]);
      setKeterangan('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h4 className="text-lg font-bold text-gray-800">{modalConfig.title}</h4>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Tanggal Pelaksanaan</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
              value={tgl}
              onChange={(e) => setTgl(e.target.value)}
              required
            />
          </div>

          {modalConfig.inputType === 'ibadah' ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Ibadah Selesai:</label>
                <div className="space-y-2">
                  {['Subuh', 'Dzuhur', 'Ashar', 'Magrib', 'Isya'].map((sholat) => (
                    <label
                      key={sholat}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={sholatList.includes(sholat)}
                        onChange={() => handleCheckboxChange(sholat)}
                        className="w-4 h-4 text-[#00A896] rounded focus:ring-[#00A896]"
                      />
                      <span className="font-semibold text-gray-700 text-sm">Sholat {sholat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Keterangan / Alasan (Opsional):</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                  placeholder="Contoh: Sedang Halangan / Sakit"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">{modalConfig.label}</label>
              <input
                type={modalConfig.inputType}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00A896] outline-none"
                placeholder={`Masukkan ${modalConfig.label.toLowerCase()}`}
                value={detail1}
                onChange={(e) => setDetail1(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00A896] hover:bg-[#02C39A] text-white font-semibold rounded-xl shadow-md transition-all mt-4"
          >
            {loading ? 'Menyimpan...' : 'Simpan Jurnal'}
          </button>
        </form>
      </div>
    </div>
  );
};
