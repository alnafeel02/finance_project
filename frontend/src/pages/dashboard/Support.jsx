import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown,
  ExternalLink,
  Plus,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../../components/PageTransition';

const Support = () => {
  const { user } = useAuth();
  
  // Ticket State
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isRaising, setIsRaising] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get('/support/tickets/my-tickets');
      setTickets(res.data.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    try {
      setIsRaising(true);
      await api.post('/support/tickets', {
        title: ticketTitle,
        description: ticketTitle, // Using title as description for now for simplicity in UI
        priority: ticketPriority
      });
      
      // Notify admins
      await api.post('/notifications', {
        user: 'admin_broadcast',
        title: 'New Support Ticket',
        message: `${user.name} has raised a new support ticket: ${ticketTitle}`,
        type: 'warning',
        link: '/admin'
      });

      setTicketTitle('');
      fetchTickets();
      alert('Ticket raised successfully!');
    } catch (err) {
      console.error('Error raising ticket:', err);
      alert('Failed to raise ticket.');
    } finally {
      setIsRaising(false);
    }
  };

  const faqs = [
    { q: 'How do I prepay my loan?', a: 'You can prepay your loan by visiting the "My Loans" section, selecting your active loan, and clicking on the "Make Payment" button. We accept various payment methods including credit cards and bank transfers.' },
    { q: 'What is the late fee policy?', a: 'A late fee of $15 is charged if payment is not received within 3 days of the due date. Continued non-payment may report to credit bureaus.' },
    { q: 'Can I change my repayment date?', a: 'Yes, you can request a change of repayment date once per loan term. Please contact support or raise a ticket with your preferred new date.' },
    { q: 'How to update my linked bank account?', a: 'Go to Settings > Payment Methods to add or remove bank accounts. For security, we may require a small verification deposit.' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-50 text-green-600';
      case 'In-Progress': return 'bg-blue-50 text-blue-600';
      default: return 'bg-yellow-50 text-yellow-600';
    }
  };



  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.header-section', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
    .from('.content-column', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.3');
  });

  // Separate effect for tickets when they load
  useGSAP(() => {
    if (!loadingTickets && tickets.length > 0) {
      gsap.from('.ticket-item', {
        x: -10,
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power1.out'
      });
    }
  }, [loadingTickets, tickets.length]);

  return (
    <PageTransition>
      <div ref={containerRef} className="max-w-5xl mx-auto space-y-8">
      <div className="header-section bg-primary-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl shadow-primary-200">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">How can we help you today, {user?.name.split(' ')[0]}?</h1>
          <p className="text-primary-100 text-lg">Track your tickets or find quick answers.</p>
        </div>
        <HelpCircle size={200} className="absolute -bottom-20 -right-20 text-white opacity-10 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="content-column lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-auto min-h-[600px]">
             {/* Removed Tab Header */}
             <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-xl text-gray-900">Support Tickets</h3>
                <p className="text-gray-500 text-sm mt-1">View and manage your support requests.</p>
             </div>

            <div className="flex-grow p-8 space-y-8">
              <form onSubmit={handleRaiseTicket} className="p-6 bg-primary-50/50 border border-primary-100 rounded-2xl space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <Plus className="text-primary-600" size={18} />
                   <h4 className="text-sm font-bold text-primary-900 uppercase tracking-tight italic">Raise New Ticket</h4>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Describe your issue..."
                      className="flex-grow px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-sm text-black"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      required
                    />
                    <select 
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-sm text-black"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isRaising}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRaising ? <Loader2 className="animate-spin" size={16} /> : 'Submit Ticket'}
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Recent Tickets ({tickets.length})</h4>
                {loadingTickets ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary-600" /></div>
                ) : tickets.length === 0 ? (
                   <p className="text-center text-gray-400 py-8 italic">No tickets raised yet.</p>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket._id} className="ticket-item p-5 bg-white border border-gray-100 rounded-2xl hover:border-primary-100 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl text-gray-400 group-hover:text-primary-600 transition-colors">
                          <MessageSquare size={20} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 text-sm">{ticket.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                            <span className="text-[10px] text-gray-400 font-mono">ID: {ticket._id.slice(-6)}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`text-[10px] font-bold ${ticket.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>
                              {ticket.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="content-column space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 italic">Quick Help (FAQ)</h3>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-left text-sm font-bold text-gray-700 hover:text-primary-600 transition-all group"
                  >
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronDown size={16} className="text-primary-600" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-600" />
                    )}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-3 pt-0 text-xs text-gray-500 animate-in fade-in slide-in-from-top-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-gray-50 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-100 transition-all flex items-center justify-center gap-2">
              View Knowledge Base <ExternalLink size={16} />
            </button>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white text-center">
            <h3 className="font-bold mb-2">Emergency?</h3>
            <p className="text-xs text-gray-400 mb-6">Call our 24/7 dedicated fraud & security hotline.</p>
            <p className="text-2xl font-black text-primary-500 mb-6 font-mono">1-800-FIN-SAFE</p>
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
              <CheckCircle2 size={12} className="text-green-500" /> Verified Line
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Support;
