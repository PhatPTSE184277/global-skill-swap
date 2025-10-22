import React from 'react';

const AdminProductListSkeleton = () => (
  <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {['ID', 'Tên gói', 'Giá', 'Loại tiền', ''].map((col, i) => (
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
                  <div className="h-4 w-12 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-16 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
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

export default AdminProductListSkeleton;