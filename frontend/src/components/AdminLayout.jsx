import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  FileCheck, 
  Users, 
  Settings2, 
  HandCoins, 
  PieChart, 
  LogOut,
  Bell,
  Menu,
  X,
  ShieldAlert,
  Landmark,
  MessageSquare,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Application Review', path: '/admin/review', icon: <FileCheck size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Product Settings', path: '/admin/products', icon: <Settings2 size={20} /> },
    { name: 'Repayment Tracker', path: '/admin/repayments', icon: <HandCoins size={20} /> },
    { name: 'Reports', path: '/admin/reports', icon: <PieChart size={20} /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-full shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg shadow-primary-100">
            <Landmark size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 leading-none tracking-tight">ADMIN</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FinanceHub Panel</span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1 mt-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 font-bold border border-primary-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-primary-600 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
              Live System
            </div>
            <NotificationDropdown />
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role || 'System'}</p>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} 
                alt="Avatar" 
                className="h-9 w-9 rounded-full bg-gray-100 border border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden text-black">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-lg text-white shadow-lg">
                  <Landmark size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900">ADMIN</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow px-4 space-y-1 mt-4 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    location.pathname === item.path ? 'bg-primary-50 text-primary-600 font-bold' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
