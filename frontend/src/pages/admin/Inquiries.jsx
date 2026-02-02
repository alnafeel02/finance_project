import { useState, useEffect, useRef } from 'react';
import { Mail, User, Clock, MessageSquare, Trash2, Loader2, Search, Info, X } from 'lucide-react';
import api from '../../utils/api';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import PageTransition from '../../components/PageTransition';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const containerRef = useRef(null);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/contact');
      setInquiries(res.data.data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useGSAP(() => {
    if (!loading && inquiries.length > 0) {
      const tl = gsap.timeline();
      
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to('.inquiry-table', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .to('.inquiry-row', {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out'
      }, '-=0.4');
    }
  }, [loading, inquiries.length]);

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="header-section flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-0 translate-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Inquiries</h1>
          <p className="text-gray-500">Manage and respond to messages from the Contact Us page.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="inquiry-table bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden opacity-0 translate-y-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 tracking-widest uppercase italic">From</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 tracking-widest uppercase italic">Subject</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 tracking-widest uppercase italic">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 tracking-widest uppercase italic text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInquiries.length > 0 ? filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id} className="inquiry-row hover:bg-primary-50/30 transition-all group opacity-0 translate-y-4">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs uppercase">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{inquiry.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{inquiry.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Clock size={14} />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm"
                    >
                      View Message
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium italic">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInquiry && (
        <div className="  fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className=" mt-[30%] bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-primary-600 p-3 rounded-2xl text-white">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ref: {selectedInquiry._id.slice(-6)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className=" mt-10  modal-body bg-white border border-gray-100 rounded-2xl shadow-inner  p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">From</p>
                  <p className="text-sm font-bold text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">Email</p>
                  <p className="text-sm font-bold text-primary-600">{selectedInquiry.email}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">Subject</p>
                  <p className="text-sm font-bold text-gray-900">{selectedInquiry.subject}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">Message Body</p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[150px]">
                  <p className="text-sm text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedInquiry.message}"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                  className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Mail size={18} /> Reply via Email
                </a>
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  );
};

export default Inquiries;
