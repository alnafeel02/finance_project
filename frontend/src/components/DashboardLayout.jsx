import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FilePlus, 
  ClipboardList, 
  CreditCard, 
  Files, 
  UserCircle, 
  LifeBuoy, 
  LogOut,
  Bell,
  Menu,
  X,
  TrendingUp,
  Landmark
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Apply for Loan', path: '/dashboard/apply', icon: <FilePlus size={20} /> },
    { name: 'Application Status', path: '/dashboard/status', icon: <ClipboardList size={20} /> },
    { name: 'My Loans', path: '/dashboard/my-loans', icon: <Landmark size={20} /> },
    { name: 'Documents', path: '/dashboard/documents', icon: <Files size={20} /> },
    { name: 'Support', path: '/dashboard/support', icon: <LifeBuoy size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-full transition-all duration-300`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <Landmark size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900 leading-none">FinanceHub</span>
        </div>

        <nav className="flex-grow px-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-600 font-bold' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
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
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name || 'Guest'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.kycStatus === 'verified' ? 'Premium Member' : 'Standard Member'}</p>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
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
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-lg text-white">
                  <Landmark size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900">FinanceHub</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    location.pathname === item.path ? 'bg-primary-50 text-primary-600 font-bold' : 'text-gray-500'
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

export default DashboardLayout;
