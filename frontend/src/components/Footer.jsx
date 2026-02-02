import { Link } from 'react-router-dom';
import { Landmark, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Landmark className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">FinanceHub</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Leading financial services provider committed to helping you achieve your dreams with flexible loan options and expert advice.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Our Products</Link></li>
              <li><Link to="/calculator" className="hover:text-white transition-colors">EMI Calculator</Link></li>
              <li><Link to="/eligibility" className="hover:text-white transition-colors">Check Eligibility</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary-500 shrink-0" size={18} />
                <span>123 Financial Plaza, Wall Street, NY 10005</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary-500 shrink-0" size={18} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary-500 shrink-0" size={18} />
                <span>support@financehub.com</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/risk-disclosure" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
              <li><Link to="/complaints" className="hover:text-white transition-colors">Complaints Redressal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs">
          <p>© {new Date().getFullYear()} FinanceHub Global Services. All rights reserved.</p>
          <p className="mt-2 text-gray-500 italic">
            Disclaimer: Loans are subject to credit approval. Terms and conditions apply.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
