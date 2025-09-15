import { useEffect, useState } from 'react';
import axiosClient from '../../apis/axiosClient';
import {
  FaUsers, FaUser, FaUserPlus, FaUserShield, FaTachometerAlt, FaSpinner
} from "react-icons/fa";
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    accounts: [],
    forumPosts: [],
    payments: [],
    bookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const [
        accountsRes,
        forumPostsRes,
        paymentsRes,
        bookingsRes,
      ] = await Promise.all([
        axiosClient.get('/admin/accounts'),
        axiosClient.get('/admin/forum/posts'),
        axiosClient.get('/admin/payments'),
        axiosClient.get('/admin/bookings'),
      ]);
      setStats({
        accounts: accountsRes.data.members || [],
        forumPosts: forumPostsRes.data.items || [],
        payments: paymentsRes.data.items || [],
        bookings: bookingsRes.data.items || [],
      });
    } catch (err) {
      toast.error('Error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const totalMembers = stats.accounts.length;
  const totalUsers = stats.accounts.filter(a => a.role === 'user').length;
  const totalMentors = stats.accounts.filter(a => a.role === 'mentor').length;
  const totalAdmins = stats.accounts.filter(a => a.role === 'admin').length;

  const rolePieData = {
    labels: ['Users', 'Mentors', 'Admins'],
    datasets: [
      {
        data: [totalUsers, totalMentors, totalAdmins],
        backgroundColor: ['#34d399', '#60a5fa', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  const postBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Forum Posts',
        data: [12, 19, 8, 15, 10, 17],
        backgroundColor: '#6366f1',
      },
    ],
  };

  const paymentLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Payments',
        data: [200, 400, 350, 500, 420, 600],
        borderColor: '#f59e42',
        backgroundColor: 'rgba(245,158,66,0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bookingDoughnutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [30, 12, 5],
        backgroundColor: ['#10b981', '#fbbf24', '#ef4444'],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-300 shadow mr-3">
              <FaTachometerAlt className="text-white text-2xl" />
            </span>
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Overview & statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FaUsers className="text-indigo-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Members</p>
            <p className="text-2xl font-bold text-indigo-600">{totalMembers}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Users</p>
            <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUserPlus className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Mentors</p>
            <p className="text-2xl font-bold text-blue-600">{totalMentors}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <FaUserShield className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Admins</p>
            <p className="text-2xl font-bold text-red-600">{totalAdmins}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
          <Pie data={rolePieData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Forum Posts (6 months)</h2>
          <Bar data={postBarData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Payments (6 months)</h2>
          <Line data={paymentLineData} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
          <Doughnut data={bookingDoughnutData} />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-500 mr-2" />
          <span className="text-gray-500 text-lg">Loading dashboard...</span>
        </div>
      )}
    </div>
  );
}