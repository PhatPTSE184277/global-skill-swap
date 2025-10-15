import React from 'react';

const AdminMentorListSkereton = () => (
  <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {['', 'ID', 'Mentor', 'Email', 'Ngày sinh', 'Trạng thái', ''].map((col, i) => (
                <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {[...Array(7)].map((_, i) => (
              <tr key={i} className={`border-b border-gray-100 animate-pulse ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-5">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-12 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminMentorListSkereton;