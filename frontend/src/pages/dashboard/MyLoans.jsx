import { Landmark, Calendar, PieChart, ArrowUpCircle, Info, Loader2, X } from 'lucide-react';
import { formatCurrency, generateAmortizationSchedule } from '../../utils/finance';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import api from '../../utils/api';
import { useEffect, useState } from 'react';
import PageTransition from '../../components/PageTransition';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const containerRef = useRef(null);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans/my-loans');
      setLoans(res.data.data);
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useGSAP(() => {
    if (!loading && loans.length > 0) {
      gsap.from('.loan-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }
  }, [loading, loans]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    try {
      setIsProcessing(true);
      await api.post(`/loans/${selectedLoan._id}/repay`, {
        amount: Number(paymentAmount),
        mode: 'Online'
      });
      
      alert('Payment successful!');
      setIsModalOpen(false);
      setPaymentAmount('');
      fetchLoans();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Active Loans</h1>
            <p className="text-gray-500">Detailed breakdown and schedules of your ongoing loans.</p>
          </div>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loans.length > 0 ? loans.map((loan) => (
          <div key={loan._id} className="loan-card bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-2xl text-primary-600">
                    <Landmark size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{loan.loanType} Loan</h3>
                    <p className="text-sm font-mono text-gray-400 uppercase">{loan._id.slice(-6)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                  loan.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {loan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase italic mb-1">Principal</p>
                  <p className="font-bold text-gray-900 text-lg">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase italic mb-1">Interest</p>
                  <p className="font-bold text-gray-900 text-lg">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase italic mb-1">Monthly EMI</p>
                  <p className="font-bold text-primary-600 text-lg">{formatCurrency(loan.emi)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase italic mb-1">Total Repay</p>
                  <p className="font-bold text-gray-900 text-lg">{formatCurrency(loan.totalRepayment)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">Repayment Period</span>
                  <span className="text-primary-600">{loan.tenure} Years</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-1000"
                    style={{ width: `${loan.status === 'Approved' ? '15' : '0'}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                  <span>Current Status: {loan.status}</span>
                  <span>{loan.purpose.slice(0, 30)}...</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Requested On</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(loan.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    const data = generateAmortizationSchedule(loan.amount, loan.interestRate, loan.tenure);
                    setScheduleData(data);
                    setSelectedLoan(loan);
                    setIsScheduleOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <PieChart size={16} /> Schedule
                </button>
                <button 
                  disabled={loan.status !== 'Approved'}
                  onClick={() => {
                    setSelectedLoan(loan);
                    setPaymentAmount(loan.emi.toString());
                    setIsModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                   Pay Now
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Landmark size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold">No loans found. Start by applying for one!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loan Repayment</h3>
              <p className="text-sm text-gray-500">Processing payment for your <span className="text-primary-600 font-bold">{selectedLoan?.loanType} Loan</span></p>
            </div>
            
            <form onSubmit={handlePayment} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Amount to Pay ($)</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                   <input 
                     required
                     type="number"
                     placeholder="0.00"
                     className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-black focus:bg-white focus:ring-2 focus:ring-primary-600 outline-none transition-all text-black"
                     value={paymentAmount}
                     onChange={(e) => setPaymentAmount(e.target.value)}
                   />
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-400 uppercase tracking-tighter">Your Monthly EMI:</span>
                  <span className="text-primary-600 italic">{formatCurrency(selectedLoan?.emi || 0)}</span>
                </div>
              </div>

              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-start gap-3">
                 <Info size={16} className="text-primary-600 mt-0.5" />
                 <p className="text-[10px] text-primary-800 leading-relaxed font-medium">
                   Funds will be secure and automatically updated in your loan ledger across all dashboards.
                 </p>
              </div>

              <div className="flex gap-4">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all uppercase tracking-widest"
                 >
                   Cancel
                 </button>
                 <button 
                    type="submit"
                    disabled={isProcessing}
                    className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                 >
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <ArrowUpCircle size={18} />}
                    Confirm Payment
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Amortization Schedule</h3>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">
                  {selectedLoan?.loanType} Loan - {selectedLoan?.tenure} Years @ {selectedLoan?.interestRate}%
                </p>
              </div>
              <button 
                onClick={() => setIsScheduleOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4 sm:p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 italic">
                    <th className="pb-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">Month</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">EMI</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">Principal</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">Interest</th>
                    <th className="pb-4 text-right text-[10px] font-black text-gray-400 tracking-widest uppercase">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {scheduleData.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50 transition-all font-mono">
                      <td className="py-4 text-xs font-bold text-gray-400">#{row.month}</td>
                      <td className="py-4 text-xs font-bold text-gray-900">{formatCurrency(row.emi)}</td>
                      <td className="py-4 text-xs font-bold text-emerald-600">-{formatCurrency(row.principal)}</td>
                      <td className="py-4 text-xs font-bold text-red-400">{formatCurrency(row.interest)}</td>
                      <td className="py-4 text-xs font-bold text-gray-900 text-right">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
               <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                 <Info size={14} className="text-primary-600" />
                 Reducing balance calculation applied
               </div>
               <button 
                 onClick={() => setIsScheduleOpen(false)}
                 className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-lg"
               >
                 Close Schedule
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
        <div className="bg-blue-50 p-2 rounded-xl">
          <Info size={24} className="text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Interest Breakdown Note</h4>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            All interest is calculated on a reducing balance basis. For a detailed amortization schedule including principal and interest split for each month, please download the schedule report.
          </p>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default MyLoans;
