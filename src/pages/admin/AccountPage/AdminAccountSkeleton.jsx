export default function AdminAccountSkeleton() {
  return (
    <table className="data-table w-full">
      <thead>
        <tr className="border-b border-gray-200">
          {['Họ tên', 'Tên đăng nhập', 'Email', 'Năm sinh', 'Vai trò', 'Ngày tham gia'].map((col, i) => (
            <th key={i} className="text-left font-semibold text-gray-700 p-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(7)].map((_, i) => (
          <tr key={i} className="member-row border-b border-gray-100 hover:bg-gray-50 transition-colors animate-pulse">
            {[...Array(6)].map((_, j) => (
              <td key={j} className="p-4">
                <div className="h-4 w-full bg-gray-100 rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}