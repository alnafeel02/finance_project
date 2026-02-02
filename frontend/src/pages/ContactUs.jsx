import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.header-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.contact-method', {
      x: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.contact-form', {
      x: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.6');
  }, { scope: containerRef });

  return (
    <PageTransition>
      <div ref={containerRef} className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="header-content text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Have questions? Our team of financial experts is ready to help you find the right solution.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div className="contact-method bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl h-fit">
                <Phone className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600 text-sm mb-2">Mon-Fri from 9am to 6pm.</p>
                <p className="text-primary-600 font-bold">+1 (234) 567-890</p>
              </div>
            </div>

            <div className="contact-method bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl h-fit">
                <Mail className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600 text-sm mb-2">Our team will respond within 24h.</p>
                <p className="text-primary-600 font-bold">support@financehub.com</p>
              </div>
            </div>

            <div className="contact-method bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl h-fit">
                <MapPin className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-gray-600 text-sm mb-2">Come say hello at our NYC office.</p>
                <p className="text-gray-900 font-medium">123 Financial Plaza, NY 10005</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form lg:col-span-2 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageSquare className="text-primary-600" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all resize-none text-black"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              {error && <p className="text-red-500 text-xs font-bold md:col-span-2">{error}</p>}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitted || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${submitted ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100 disabled:opacity-50'}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : submitted ? (
                    'Message Sent Successfully!'
                  ) : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default ContactUs;
