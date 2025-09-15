import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminFooter from '../../components/admin/AdminFooter';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{`
        .admin-nav-item:hover .fa-shield-alt { color: #2563eb !important; }
        .admin-nav-item:hover .fa-users { color: #059669 !important; }
        .admin-nav-item:hover .fa-users-cog { color: #6366f1 !important; }
        .admin-nav-item:hover { background: #f1f5f9; }
        .admin-nav-item { cursor: pointer; }
        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        .admin-header-gradient { background: linear-gradient(90deg, #f59e42 0%, #fbbf24 50%, #f59e42 100%); }
        .admin-header-text-gradient { background: linear-gradient(90deg, #f59e42, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .admin-avatar { background: linear-gradient(135deg, #fbbf24 0%, #f59e42 100%); }
        .admin-dropdown { min-width: 220px; }
      `}</style>
      <div className="flex flex-1 bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 min-h-screen flex flex-col" style={{ marginLeft: 256 }}>
          <AdminHeader />
          <div className="flex-1 p-8 bg-gray-50" style={{ paddingTop: 64 }}>
            <Outlet />
          </div>
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}