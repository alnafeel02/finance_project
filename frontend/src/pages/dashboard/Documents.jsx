import { useState, useEffect, useRef } from 'react';
import { Files, Download, Upload, Shield, Eye, Trash2, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const Documents = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get('/loans/my-loans');
        setLoans(res.data.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Consolidate all documents from all loans
  const allDocs = loans.reduce((acc, loan) => {
    const loanDocs = (loan.documents || []).map(doc => ({
      ...doc,
      loanType: loan.loanType,
      loanId: loan._id
    }));
    return [...acc, ...loanDocs];
  }, []);

  useGSAP(() => {
    if (!loading && allDocs.length > 0) {
      gsap.from('.doc-card', {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)'
      });
    }
  }, [loading, allDocs.length]);

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
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500">Secure storage for all your financial and legal documents.</p>
        </div>
      </div>

      <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="relative z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <Shield size={48} className="text-primary-300" />
        </div>
        <div className="relative z-10 flex-grow text-center md:text-left">
          <h2 className="text-xl font-bold mb-2">Encrypted Vault</h2>
          <p className="text-primary-100 text-sm max-w-xl">
            Your documents are protected with AES-256 bank-level encryption. Only you and authorized verification officers can access these files.
          </p>
        </div>
        <Files size={160} className="absolute -bottom-10 -right-10 text-primary-800 opacity-20 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allDocs.length > 0 ? allDocs.map((doc, index) => (
          <div key={doc._id || index} className="doc-card bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-center text-primary-600 border border-gray-100">
              <FileText size={32} />
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[200px]">{doc.name}</h3>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-1">
                  <CheckCircle2 size={10} /> {doc.loanType}
                </span>
              </div>
              <p className="text-xs text-gray-400">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Eye size={14} /> View
                </a>
                <a 
                  href={doc.url} 
                  download
                  className="text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">No documents found.</p>
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  );
};

export default Documents;
