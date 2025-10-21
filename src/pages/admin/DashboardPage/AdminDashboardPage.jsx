import { useEffect, useContext, useState } from 'react';
import { FaTachometerAlt, FaSpinner } from "react-icons/fa";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import DashboardStats from '../../../components/admin/dashboard/DashboardStat';
import DashboardCharts from '../../../components/admin/dashboard/DashboardCharts';
import DashboardContext from '../../../contexts/admin/DashboardContext';
import DashboardSkeleton from './DashboardSkeleton';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const {
    dailyRevenue,
    userCountByRole,
    loading,
    getDailyRevenue,
    getUserCountByRole,
  } = useContext(DashboardContext);

  const [userCounts, setUserCounts] = useState({ user: 0, teacher: 0, admin: 0 });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    getDailyRevenue({ page: 0, size: 100 });
    getUserCountByRole();
  }, [getDailyRevenue, getUserCountByRole]);

  useEffect(() => {
    let total = 0;
    if (Array.isArray(dailyRevenue)) {
      total = dailyRevenue.reduce((sum, item) => sum + (item.revenue || 0), 0);
    }
    setTotalRevenue(total);
  }, [dailyRevenue]);

  useEffect(() => {
    if (Array.isArray(userCountByRole)) {
      const counts = { user: 0, teacher: 0, admin: 0 };
      userCountByRole.forEach(item => {
        if (item.role === "USER") counts.user = item.countNumber;
        if (item.role === "TEACHER") counts.teacher = item.countNumber;
        if (item.role === "ADMIN") counts.admin = item.countNumber;
      });
      setUserCounts(counts);
    }
  }, [userCountByRole]);

  const rolePieData = {
    labels: ['Người dùng', 'Mentor', 'Quản trị viên'],
    datasets: [
      {
        data: [userCounts.user, userCounts.teacher, userCounts.admin],
        backgroundColor: ['#34d399', '#60a5fa', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  const postBarData = {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
    datasets: [
      {
        label: 'Bài viết diễn đàn',
        data: [12, 19, 8, 15, 10, 17],
        backgroundColor: '#6366f1',
      },
    ],
  };

  const paymentLineData = {
    labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
    datasets: [
      {
        label: 'Thanh toán',
        data: [200, 400, 350, 500, 420, 600],
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245,158,66,0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bookingDoughnutData = {
    labels: ['Hoàn thành', 'Đang chờ', 'Đã hủy'],
    datasets: [
      {
        data: [30, 12, 5],
        backgroundColor: ['#10b981', '#fbbf24', '#ef4444'],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-300 shadow mr-3">
              <FaTachometerAlt className="text-white text-2xl" />
            </span>
            Bảng điều khiển
          </h1>
          <p className="text-gray-600 mt-2">Tổng quan & thống kê</p>
        </div>
      </div>

      {loading ? (
         <DashboardSkeleton />
      ) : (
        <>
          <DashboardStats
            totalRevenue={totalRevenue}
            totalUsers={userCounts.user}
            totalMentors={userCounts.teacher}
            totalAdmins={userCounts.admin}
          />
          <DashboardCharts
            rolePieData={rolePieData}
            postBarData={postBarData}
            paymentLineData={paymentLineData}
            bookingDoughnutData={bookingDoughnutData}
          />
        </>
      )}
    </div>
  );
}