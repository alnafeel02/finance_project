import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Landmark,
  Loader2
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatCurrency } from '../../utils/finance';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const Overview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline();
      
      tl.from('.stat-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      })
      .from('.content-section', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3');
    }
  }, [loading]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/loans/my-loans');
        const loanData = res.data.data;
        setLoans(loanData);

        // Derive Transactions from loans and repayment history
        const txs = [];
        loanData.forEach(loan => {
          // Add loan creation as a transaction
          txs.push({
            id: `LN-${loan._id.slice(-4)}`,
            type: `${loan.loanType} Loan Requested`,
            amount: loan.amount,
            date: new Date(loan.createdAt).toLocaleDateString(),
            status: loan.status === 'Approved' ? 'Completed' : 'Pending'
          });

          // Add repayments
          (loan.repaymentHistory || []).forEach((rp, idx) => {
            txs.push({
              id: `RP-${loan._id.slice(-4)}-${idx}`,
              type: 'Repayment',
              amount: rp.amount,
              date: new Date(rp.date).toLocaleDateString(),
              status: rp.status
            });
          });
        });

        // Sort by date (desc) and take top 5
        setRecentTransactions(txs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));

        // Calculate Stats
        const outstanding = loanData
          .filter(l => l.status === 'Approved')
          .reduce((sum, l) => sum + (l.totalRepayment || 0), 0);
        
        const activeCount = loanData.filter(l => l.status === 'Approved').length;
        
        const monthlyEMI = loanData
          .filter(l => l.status === 'Approved')
          .reduce((sum, l) => sum + (l.emi || 0), 0);

        setStats([
          { name: 'Total Outstanding', value: outstanding, icon: <Wallet size={24} />, color: 'bg-primary-500', trend: '+2.5%', trendUp: true },
          { name: 'Active Loans', value: activeCount, icon: <Landmark size={24} />, color: 'bg-blue-500', trend: 'Healthy', trendUp: true },
          { name: 'Monthly EMI', value: monthlyEMI, icon: <Calendar size={24} />, color: 'bg-emerald-500', trend: 'Due soon', trendUp: false },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div ref={containerRef} className="space-y-8">
        {/* Welcome Header */}
        <div className="content-section">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500">Here's what's happening with your finances today.</p>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <Clock size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Loan Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="content-section bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Active Loan Summary</h3>
              <Link to="/dashboard/status" className="text-primary-600 text-sm font-bold hover:underline">View Details</Link>
            </div>
            
            <div className="space-y-6">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <div key={loan._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <Landmark className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{loan.loanType} Loan</p>
                        <p className="text-xs text-gray-500">Status: {loan.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(loan.amount)}</p>
                      <p className={`text-xs font-medium ${loan.status === 'Approved' ? 'text-green-600' : 'text-orange-600'}`}>
                        {loan.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active loans found.</p>
                  <Link to="/dashboard/apply" className="text-primary-600 font-bold hover:underline text-sm mt-2 inline-block">Apply for your first loan</Link>
                </div>
              )}
            </div>
          </div>

          <div className="content-section bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-semibold text-gray-500 text-sm italic">Type</th>
                    <th className="pb-4 font-semibold text-gray-500 text-sm italic">Status</th>
                    <th className="pb-4 font-semibold text-gray-500 text-sm italic">Date</th>
                    <th className="pb-4 font-semibold text-gray-500 text-sm italic text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900 text-sm">{tx.type}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500">{tx.date}</td>
                      <td className="py-4 text-sm font-bold text-gray-900 text-right">{formatCurrency(tx.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="content-section bg-primary-600 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg shadow-primary-200">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Need a higher limit?</h3>
              <p className="text-primary-100 text-sm mb-6">Upgrade your profile to get access to custom business loans up to $250k.</p>
              <Link to="/eligibility" className="bg-white text-primary-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary-50 transition-all inline-block">
                Check Availability
              </Link>
            </div>
            <Landmark className="absolute -bottom-8 -right-8 h-32 w-32 text-primary-500 opacity-20 rotate-12" />
          </div>

          <div className="content-section bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest text-center">EMI Reminder</h3>
            <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
              <AlertCircle className="text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-orange-800">Payment Due Soon</p>
                <p className="text-xs text-orange-600">Plan your finances to avoid late fees.</p>
              </div>
            </div>
            <Link to="/dashboard/my-loans" className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center">
              Pay Now
            </Link>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Overview;
