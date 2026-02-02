import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, FileSearch, Loader2, Plus } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatCurrency } from '../../utils/finance';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/loans/my-loans');
        setApplications(res.data.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-600 border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Reviewing': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Reviewing': return <Loader2 size={16} className="animate-spin" />;
      default: return <Clock size={16} />;
    }
  };

  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && applications.length > 0) {
      gsap.from('.app-card', {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [loading, applications]);

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
          <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-500">Track your in-progress and past loan applications.</p>
        </div>
        <Link 
          to="/dashboard/apply" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Plus size={20} />
          New Application
        </Link>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? applications.map((app) => (
          <div key={app._id} className="app-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-grow flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <FileSearch className="text-gray-400 group-hover:text-primary-600 transition-colors" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{app.loanType} Loan</h3>
                    <span className="text-xs font-mono text-gray-400 uppercase">{app._id.slice(-6)}</span>
                  </div>
                  <p className="text-sm text-gray-500">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:text-right">
                <div className="lg:order-2">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold italic mb-1">Amount</p>
                  <p className="font-bold text-gray-900">{formatCurrency(app.amount)}</p>
                </div>
                <div className="lg:order-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold italic mb-1">Purpose</p>
                  <p className="font-medium text-gray-700 truncate max-w-[150px]">{app.purpose}</p>
                </div>
                <div className="lg:order-1 flex items-center justify-center lg:justify-end">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">No applications found.</p>
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  );
};

export default ApplicationStatus;
