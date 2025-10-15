import React, { useContext, useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AdminMentorListSkereton from './AdminMentorListSkereton';
import AdminMentorList from '../../../components/admin/mentor/AdminMentorList';
import MentorContext from '../../../contexts/admin/MentorContext';
import Pagination from '../../../components/admin/Pagination';
import AdminSelect from '../../../components/admin/AdminSelect';
import AdminSearchInput from '../../../components/admin/AdminSearchInput';
import ConfirmModal from '../../../components/admin/ConfirmModal';

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
];

const AdminMentorPage = () => {
  const { mentors, loading, fetchMentors, approveMentors, rejectMentors, totalPages } = useContext(MentorContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const size = 10;

  useEffect(() => {
    fetchMentors({ page, size });
  }, [fetchMentors, page, size]);

  const filteredMentors = mentors.filter(mentor => {
    const matchSearch = (mentor.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (mentor.email || '').toLowerCase().includes(search.toLowerCase());

    let matchStatus = true;
    if (status === 'pending') matchStatus = !mentor.isApproved && !mentor.isRejected;
    else if (status === 'approved') matchStatus = mentor.isApproved;
    else if (status === 'rejected') matchStatus = mentor.isRejected;

    return matchSearch && matchStatus;
  });

  const pendingMentors = filteredMentors.filter(m => !m.isApproved && !m.isRejected);
  const allPendingSelected = pendingMentors.length > 0 && pendingMentors.every(m => selectedIds.includes(m._id || m.id));

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingMentors.map(m => m._id || m.id));
    }
  };

  const handleApprove = async () => {
    if (selectedIds.length === 0) return;
    await approveMentors(selectedIds);
    setSelectedIds([]);
    setShowApproveModal(false);
  };

  const handleReject = async () => {
    if (selectedIds.length === 0) return;
    await rejectMentors(selectedIds);
    setSelectedIds([]);
    setShowRejectModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <ConfirmModal
        open={showApproveModal}
        title="Duyệt CV Mentor"
        message={`Bạn có chắc muốn duyệt ${selectedIds.length} CV đã chọn?`}
        onConfirm={handleApprove}
        onCancel={() => setShowApproveModal(false)}
      />
      <ConfirmModal
        open={showRejectModal}
        title="Từ chối CV Mentor"
        message={`Bạn có chắc muốn từ chối ${selectedIds.length} CV đã chọn?`}
        onConfirm={handleReject}
        onCancel={() => setShowRejectModal(false)}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-300 shadow mr-3">
              <FaChalkboardTeacher className="text-white text-2xl" />
            </span>
            Quản lý CV Mentor
          </h1>
          <p className="text-gray-600 mt-2">Duyệt và quản lý CV mentor</p>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-3">
          <button
            onClick={() => setShowApproveModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-150 cursor-pointer"
          >
            <FaCheckCircle className="text-white drop-shadow" /> Duyệt ({selectedIds.length})
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-150 cursor-pointer"
          >
            <FaTimesCircle className="text-white drop-shadow" /> Từ chối ({selectedIds.length})
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="w-full md:w-48">
          <AdminSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </div>
        <div className="relative w-full md:w-72">
          <AdminSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm mentor..."
          />
        </div>
      </div>

      <div className="admin-card rounded-xl p-6 bg-white shadow">
        {loading ? (
          <AdminMentorListSkereton />
        ) : (
          <>
            <AdminMentorList
              mentors={filteredMentors}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              allSelected={allPendingSelected}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMentorPage;