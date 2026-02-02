import { useState, useEffect } from 'react';
import { 
  PieChart, 
  BarChart, 
  LineChart, 
  Download, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Loader2
} from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/finance';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = (name) => {
    const blob = new Blob([`Report Content for ${name}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/ /g, '-')}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  const reports = [
    { name: 'Monthly Financial Audit', period: 'Jan 2024', size: '2.4 MB', type: 'System Auth' },
    { name: 'Disbursement Journal', period: 'Dec 2023', size: '1.8 MB', type: 'Finance Dept' },
    { name: 'Risk Assessment Report', period: 'Q4 2023', size: '4.2 MB', type: 'Risk Engine' },
    { name: 'Default Analysis', period: 'H2 2023', size: '3.1 MB', type: 'Collections' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Intelligence HUB</h1>
          <p className="text-gray-500 text-sm">Strategic reports and data visualization engines.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-white text-gray-500 rounded-xl text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-all">
            <Calendar size={16} /> Schedule Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
            <PieChart size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900 italic uppercase tracking-tight">Portfolio Mix</h3>
          <div className="mt-4 space-y-1">
            {Object.entries(data?.portfolioMix || {}).map(([type, amount]) => (
              <p key={type} className="text-[10px] font-black uppercase text-gray-500">
                {type}: <span className="text-gray-900">{formatCurrency(amount)}</span>
              </p>
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-primary-600 hover:underline tracking-widest">
            Visualize Data <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <BarChart size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900 italic uppercase tracking-tight">Volume Stats</h3>
          <div className="mt-4 flex gap-4">
            {Object.entries(data?.volumeStats || {}).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-[10px] font-black text-gray-900">{count}</p>
                <p className="text-[8px] font-bold uppercase text-gray-400">{status}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 hover:underline tracking-widest">
            Visualize Data <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <LineChart size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900 italic uppercase tracking-tight">Financial Forecast</h3>
          <p className="text-xl font-black text-blue-600 mt-2">{formatCurrency(data?.projectedInterest || 0)}</p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Projected Interest Revenue</p>
          <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline tracking-widest">
            Visualize Data <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest italic mb-8">Generated Archives</h3>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase italic tracking-tight">{report.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{report.period} • {report.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-gray-400 tracking-widest italic">{report.size}</span>
                <button 
                  onClick={() => handleExport(report.name)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
