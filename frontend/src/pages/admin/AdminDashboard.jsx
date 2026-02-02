import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Clock,
  Loader2,
  Download
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatCurrency } from '../../utils/finance';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const containerRef = useRef(null);

  const handleExport = () => {
    const data = stats.map(s => `${s.name}: ${s.value}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-metrics-summary.txt';
    a.click();
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        const appsRes = await api.get('/admin/applications');

        setStats([
          { name: 'Total Disbursed', value: statsRes.data.data.totalDisbursed, icon: <Landmark size={24} />, color: 'bg-emerald-500', trend: '+12.5%', trendUp: true },
          { name: 'Active Borrowers', value: statsRes.data.data.activeBorrowers, icon: <Users size={24} />, color: 'bg-blue-500', trend: '+48 this week', trendUp: true },
          { name: 'Pending Apps', value: statsRes.data.data.pendingApps, icon: <Clock size={24} />, color: 'bg-orange-500', trend: 'Requires attention', trendUp: false },
          { name: 'Default Rate', value: statsRes.data.data.defaultRate, icon: <AlertTriangle size={24} />, color: 'bg-red-500', trend: '-0.4%', trendUp: true },
        ]);

        setRecentApps(appsRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  useGSAP(() => {
    if (!loading && stats.length > 0) {
      const tl = gsap.timeline();
      
      // Header Animation
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      // Stats Cards
      .to('.stat-card', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3')
      // Content Columns (Chart & Sidebar)
      .to('.content-column', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
      }, '-=0.3');
    }
  }, [loading, stats.length]);

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
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Metrics</h1>
            <p className="text-gray-500 mt-1">Real-time overview of the ecosystem.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <Download size={16} /> Export Data
            </button>
            <Link to="/admin/reports" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 flex items-center justify-center">
              Generate Report
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="stat-card bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:border-primary-100 transition-all opacity-0 translate-y-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <AlertTriangle size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">{stat.name}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
              </p>
              <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color} p-8 rounded-full text-white`}>
                 {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area Mock */}
          <div className="content-column lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-gray-200/50 opacity-0 translate-y-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" /> Revenue Growth
              </h3>
              <select className="bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            
            {/* Mock Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-2 px-4 relative">
              <div className="absolute inset-x-0 bottom-0 h-px bg-gray-100"></div>
              {[45, 60, 55, 75, 90, 85, 110, 100, 120, 140, 130, 160].map((h, i) => (
                <div key={i} className="flex-grow flex flex-col items-center group cursor-pointer">
                  <div 
                    className="w-full bg-emerald-600/20 group-hover:bg-emerald-500/40 border-t-2 border-emerald-500 rounded-t-sm transition-all duration-500"
                    style={{ height: `${h}px` }}
                  ></div>
                  <span className="text-[8px] font-bold text-gray-600 mt-2 rotate-45">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Gross Revenue</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(124500)}</p>
                <span className="text-[10px] text-emerald-500 font-bold">+5.2%</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Interest Income</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(85200)}</p>
                <span className="text-[10px] text-emerald-500 font-bold">+8.1%</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">Processing Fees</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(39300)}</p>
                <span className="text-[10px] text-orange-500 font-bold">-2.1%</span>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="content-column space-y-6 opacity-0 translate-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/50">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest italic mb-6">Critical Actions</h3>
              <div className="space-y-4">
                {recentApps.length > 0 ? recentApps.map((app) => (
                  <div key={app._id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-primary-600/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-gray-900 tracking-widest uppercase">{app._id.slice(-6)}</p>
                      <span className="text-[10px] text-primary-600 font-bold uppercase">{app.status}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-bold text-gray-700">{app.user?.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase italic">{app.loanType} Loan</p>
                      </div>
                      <p className="text-sm font-black text-gray-900">{formatCurrency(app.amount)}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/review')}
                      className="w-full mt-4 py-2 bg-white border border-gray-200 text-[10px] font-black uppercase text-gray-500 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
                    >
                      Start Audit
                    </button>
                  </div>
                )) : (
                  <p className="text-gray-400 text-xs italic text-center py-4">No pending applications</p>
                )}
              </div>
              <Link to="/admin/review" className="w-full mt-6 py-3 border border-gray-100 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center">
                View All Queue
              </Link>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-900/30 p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-bold text-white mb-1">Health Status: Optimal</h3>
                <p className="text-xs text-emerald-500 leading-relaxed font-medium">System is processing payments at 100% capacity. No downtime reported in last 72 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
