import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  Eye, 
  Search, 
  Filter, 
  ArrowRight,
  User,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../../utils/finance';
import api from '../../utils/api';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import PageTransition from '../../components/PageTransition';

const ApplicationReview = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const containerRef = useRef(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useGSAP(() => {
    if (!loading && applications.length > 0) {
      const tl = gsap.timeline();
      
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to('.controls-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .to('.list-container', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .to('.app-row', {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out'
      }, '-=0.2')
      .to('.detail-panel', {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4');
    }
  }, [loading, applications.length]);

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/admin/loans/${id}/status`, { status: newStatus });
      await fetchApplications(); // Refresh list
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Application Queue</h1>
          <p className="text-gray-500 text-sm">Decision-level review of active loan requests.</p>
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {['All', 'Pending', 'Reviewing', 'Approved', 'Rejected'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${
                statusFilter === status ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* List area */}
        {/* List area */}
        <div className="xl:col-span-2 space-y-4">
          <div className="controls-section bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm opacity-0 translate-y-4">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="bg-transparent border-none text-black text-sm focus:outline-none flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="list-container bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 opacity-0 translate-y-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Reference</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Applicant</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Amount</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApplications.map((app) => (
                  <tr 
                    key={app._id} 
                    onClick={() => setSelectedApp(app)}
                    className={`app-row hover:bg-gray-50 cursor-pointer transition-all opacity-0 translate-y-4 ${selectedApp?._id === app._id ? 'bg-primary-50' : ''}`}
                  >
                    <td className="p-6">
                      <p className="text-xs font-black text-gray-900 tracking-widest uppercase">{app._id.slice(-6)}</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{app.loanType}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                          {app.user?.name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-600">{app.user?.name}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-black text-gray-900">{formatCurrency(app.amount)}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                        app.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="detail-panel xl:col-span-1 opacity-0 translate-x-8">
          {selectedApp ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-8 space-y-8 animate-in scale-in duration-300 shadow-2xl shadow-gray-200/50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">{selectedApp._id.slice(-6)}</h2>
                  <p className="text-sm text-primary-600 font-bold uppercase tracking-widest">{selectedApp.status}</p>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-gray-600 border border-gray-200"
                >
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-4">Financial Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Amount Requested</p>
                      <p className="text-sm font-black text-gray-900">{formatCurrency(selectedApp.amount)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Tenure</p>
                      <p className="text-sm font-black text-emerald-600">{selectedApp.tenure} Years</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2">Purpose</h3>
                  <p className="text-xs text-gray-500 leading-relaxed italic">"{selectedApp.purpose}"</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Verification Signals</h3>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-gray-400 italic">Identity Proof</span>
                    <span className={selectedApp.documents?.length > 0 ? 'text-emerald-600' : 'text-gray-400'}>
                      {selectedApp.documents?.length > 0 ? 'RECEIVED' : 'MISSING'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-gray-400 italic">Financial Review</span>
                    <span className="text-primary-600">IN PROGRESS</span>
                  </div>
                </div>

                {selectedApp.documents?.length > 0 && (
                  <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl">
                    <h3 className="text-[10px] font-black text-primary-600 uppercase tracking-widest italic mb-4">Uploaded Files</h3>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc, idx) => (
                        <a 
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-primary-100 hover:border-primary-300 transition-all group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText size={14} className="text-primary-600 shrink-0" />
                            <span className="text-[10px] font-bold text-gray-600 truncate">{doc.name}</span>
                          </div>
                          <Eye size={14} className="text-gray-400 group-hover:text-primary-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-8 border-t border-gray-100">
                <button 
                  onClick={() => handleStatusUpdate(selectedApp._id, 'Approved')}
                  disabled={isUpdating || selectedApp.status === 'Approved'}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Approve Application'}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(selectedApp._id, 'Reviewing')}
                    disabled={isUpdating}
                    className="py-3 bg-white text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all border border-gray-200 disabled:opacity-50"
                  >
                    Under Review
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected')}
                    disabled={isUpdating || selectedApp.status === 'Rejected'}
                    className="py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50"
                  >
                    Reject App
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8">
              <div className="bg-gray-50 p-4 rounded-full text-gray-300 mb-4 animate-pulse">
                <FileText size={48} />
              </div>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default ApplicationReview;
