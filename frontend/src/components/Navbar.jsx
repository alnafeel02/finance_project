import { useState, useEffect } from 'react';
import { Menu, X, Landmark, Phone, ArrowRight, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Loan Products', path: '/products' },
    { name: 'EMI Calculator', path: '/calculator' },
    { name: 'Eligibility', path: '/eligibility' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${shouldBeTransparent ? 'bg-transparent py-4' : 'bg-white shadow-md py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Landmark className={`h-8 w-8 ${shouldBeTransparent ? 'text-white' : 'text-primary-600'}`} />
            <span className={`text-xl font-bold ${shouldBeTransparent ? 'text-white' : 'text-gray-900'}`}>FinanceHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  location.pathname === link.path 
                    ? 'text-primary-600' 
                    : shouldBeTransparent ? 'text-gray-200' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 border-l border-gray-200/20 pl-6">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    shouldBeTransparent 
                    ? 'bg-white text-primary-600 hover:bg-gray-100' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <UserIcon size={16} /> My Portal
                </Link>
                <button 
                  onClick={logout}
                  className={`p-2 rounded-full transition-all ${
                    shouldBeTransparent ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={`text-sm font-medium ${shouldBeTransparent ? 'text-gray-200' : 'text-gray-600'} hover:text-primary-500`}>Login</Link>
                <Link 
                  to="/register" 
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    shouldBeTransparent 
                    ? 'bg-white text-primary-600 hover:bg-gray-100' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${shouldBeTransparent ? 'text-white' : 'text-gray-900'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full w-full left-0 py-4 px-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 font-medium hover:text-primary-600"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {user ? (
               <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 bg-primary-600 text-white rounded-lg font-semibold"
                >
                  My Portal
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="text-center py-2 text-red-600 font-semibold border border-red-100 rounded-lg"
                >
                  Logout
                </button>
               </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2 text-primary-600 font-semibold">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-2 bg-primary-600 text-white rounded-lg font-semibold">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
