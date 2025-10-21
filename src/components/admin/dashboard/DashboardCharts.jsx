import React from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';

const DashboardCharts = ({ 
  rolePieData, 
  postBarData, 
  paymentLineData, 
  bookingDoughnutData 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tỉ lệ vai trò</h2>
        <Pie data={rolePieData} />
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Bài viết diễn đàn (6 tháng)</h2>
        <Bar data={postBarData} />
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Thanh toán (6 tháng)</h2>
        <Line data={paymentLineData} />
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Trạng thái đặt lịch</h2>
        <Doughnut data={bookingDoughnutData} />
      </div>
    </div>
  );
};

export default DashboardCharts;