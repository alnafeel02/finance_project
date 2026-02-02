import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  Ban, 
  Mail, 
  Phone,
  Landmark,
  Loader2
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useGSAP(() => {
    if (!loading && users.length > 0) {
      const tl = gsap.timeline();
      
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to('.users-table', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .to('.user-row', {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out'
      }, '-=0.4');
    }
  }, [loading, users.length]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/admin/users/${id}/status`, { kycStatus: newStatus });
      // Update local state for immediate feedback
      setUsers(prev => prev.map(u => u._id === id ? { ...u, kycStatus: newStatus } : u));
    } catch (err) {
      alert('Error updating user status');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return user.kycStatus === 'verified';
    if (filterStatus === 'pending') return user.kycStatus === 'pending';
    if (filterStatus === 'restricted') return user.kycStatus === 'rejected';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div ref={containerRef} className="space-y-8">
        <div className="header-section flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-0 translate-y-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">User Directory</h1>
            <p className="text-gray-500 text-sm">Monitor and manage access for all platform members.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filterStatus === 'all' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filterStatus === 'active' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filterStatus === 'pending' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('restricted')}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filterStatus === 'restricted' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Restricted
            </button>
          </div>
        </div>

        <div className="users-table bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 opacity-0 translate-y-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Member</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Contact</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">KYC Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="user-row hover:bg-gray-50 transition-all group opacity-0 translate-y-4">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 flex items-center gap-2"><Mail size={12} className="text-gray-400" /> {user.email}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-2"><Phone size={12} className="text-gray-400" /> {user.phone || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-600' : 
                      user.kycStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {user.kycStatus}
                    </span>
                    <div className="flex items-center gap-2">
                      <Landmark size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-600">Member</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {user.kycStatus !== 'verified' && (
                        <button 
                          onClick={() => handleStatusUpdate(user._id, 'verified')}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                          title="Verify Member"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      )}
                      {user.kycStatus !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusUpdate(user._id, 'rejected')}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                          title="Restrict Account"
                        >
                          <Ban size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleStatusUpdate(user._id, 'pending')}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                        title="Reset to Pending"
                      >
                         <RotateCcw size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserManagement;
