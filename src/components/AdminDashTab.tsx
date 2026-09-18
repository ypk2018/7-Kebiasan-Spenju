import React from 'react';
import { Student } from '../types';

interface AdminDashTabProps {
  students: Student[];
}

export const AdminDashTab: React.FC<AdminDashTabProps> = ({ students }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800">Dashboard Administrator</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h6 className="text-sm font-semibold text-gray-500 mb-2">Total Siswa Terdaftar</h6>
          <h2 className="text-4xl font-bold text-[#00A896]">{students.length}</h2>
        </div>
      </div>
    </div>
  );
};
