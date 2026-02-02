import { useState, useEffect } from 'react';
import { 
  HandCoins, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../../utils/finance';
import api from '../../utils/api';

const RepaymentTracking = () => {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const res = await api.get('/admin/repayments');
        setRepayments(res.data.data);
      } catch (err) {
        console.error('Error fetching repayments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepayments();
  }, []);

  const handleExport = () => {
    const headers = ['Ref', 'User', 'Loan Type', 'Amount', 'Date', 'Status', 'Mode'];
    const rows = processedRepayments.map(r => [r.id, r.user, r.loanType, r.amount, r.date, r.status, r.mode].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repayment-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const todayCollections = repayments
    .filter(r => {
      if (!r.date) return false;
      const d = new Date(r.date);
      const today = new Date();
      return d.toDateString() === today.toDateString() && r.status === 'Success';
    })
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const processedRepayments = repayments.map(tx => ({
    id: tx._id?.toString().slice(-8).toUpperCase() || 'TX-NA',
    user: tx.user?.name || 'Unknown',
    loanType: tx.loanType || 'N/A',
    loanId: tx.loanId?.toString().slice(-6).toUpperCase() || 'N/A',
    amount: tx.amount || 0,
    date: tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A',
    status: tx.status || 'Pending',
    mode: tx.mode || 'N/A'
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Ledger & Repayments</h1>
          <p className="text-gray-500 text-sm">Tracking capital inflow and payment statuses.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-2 bg-white text-gray-600 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Download size={18} /> Export Journal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-200/50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mb-1">Today's Collections</p>
          <p className="text-2xl font-black text-emerald-600">{formatCurrency(todayCollections)}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black mt-2">
            <TrendingUp size={12} /> Real-time Data
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-200/50">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mb-1">Total Records</p>
          <p className="text-2xl font-black text-primary-600">{repayments.length}</p>
          <div className="flex items-center gap-1 text-[10px] text-primary-600 font-black mt-2 uppercase tracking-tighter italic">
            Ledger Entries
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Reference</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Payer Detail</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Loan Detail</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Date</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-center">Inflow</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processedRepayments.length > 0 ? processedRepayments.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-all group">
                <td className="p-6 text-xs font-mono text-gray-400 group-hover:text-primary-600 transition-colors">{tx.id}</td>
                <td className="p-6">
                  <p className="text-sm font-bold text-gray-900">{tx.user}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{tx.mode}</p>
                </td>
                <td className="p-6">
                  <p className="text-xs font-black text-gray-900">{tx.loanType}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tx.loanId}</p>
                </td>
                <td className="p-6 text-xs text-gray-400">{tx.date}</td>
                <td className="p-6 text-center text-sm font-black text-gray-900">{formatCurrency(tx.amount)}</td>
                <td className="p-6 text-right">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${
                    tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 
                    tx.status === 'Processing' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400 italic text-sm">No repayment transactions found in the ledger.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepaymentTracking;
