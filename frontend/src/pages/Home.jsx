import { useRef } from 'react';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/images/hero-finance.jpg';
import PageTransition from '../components/PageTransition';

const Home = () => {
  const { user } = useAuth();
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Hero Animation
    tl.to('.hero-text', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
    // Loan Products Section
    .to('.section-header', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2')
    .to('.loan-card', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.4')
    // Trusted Section
    .to('.trust-content', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2');

  }, { scope: containerRef });

  const loanTypes = [
    { name: 'Personal Loan', desc: 'Customized solutions for your personal needs.', icon: <Users className="w-8 h-8 text-primary-600" /> },
    { name: 'Business Loan', desc: 'Fuel your business growth with easy capital.', icon: <Zap className="w-8 h-8 text-primary-600" /> },
    { name: 'Home Loan', desc: 'Secure the foundation of your family dreams.', icon: <ShieldCheck className="w-8 h-8 text-primary-600" /> },
    { name: 'Education Loan', desc: 'Invest in your future with competitive rates.', icon: <BarChart3 className="w-8 h-8 text-primary-600" /> },
  ];

  return (
    <PageTransition>
      <div ref={containerRef} className="flex flex-col">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
            <img 
              src={heroImage} 
              alt="Finance Background" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-2xl">
              <h1 className="hero-text text-5xl md:text-7xl font-bold leading-tight mb-6 opacity-0 translate-y-8">
                Simplify Your <span className="text-primary-500">Financial</span> Future
              </h1>
              <p className="hero-text text-xl text-gray-300 mb-8 opacity-0 translate-y-8">
                Instant approvals, transparent terms, and competitive rates for all your funding needs. Get started today.
              </p>
              <div className="hero-text flex flex-wrap gap-4 opacity-0 translate-y-8">
                <Link to={user ? "/dashboard/apply" : "/register"} className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-all flex items-center group">
                  Apply Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/calculator" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-bold hover:bg-white/20 transition-all">
                  EMI Calculator
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Types Section */}
        <section className="py-24 bg-white text-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header text-center mb-16 opacity-0 translate-y-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Loan Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our diverse range of financial solutions tailored to help you achieve your goals.</p>
            </div>

            <div className="loan-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loanTypes.map((loan, idx) => (
                <div 
                  key={idx} 
                  className="loan-card p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group opacity-0 translate-y-8"
                >
                  <div className="mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-50 transition-colors">
                    {loan.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{loan.name}</h3>
                  <p className="text-gray-600 mb-6">{loan.desc}</p>
                  <Link to="/products" className="text-primary-600 font-bold flex items-center hover:underline">
                    Learn More <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section py-20 bg-primary-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="trust-content text-3xl font-bold mb-12 opacity-0 translate-y-8">Trusted by 10,000+ Customers Worldwide</h2>
            <div className="trust-content grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 opacity-0 translate-y-8">
              {/* These would be company logos in a real app */}
              <div className="flex items-center justify-center text-xl font-serif">FINVEST</div>
              <div className="flex items-center justify-center text-xl font-serif">SECURED</div>
              <div className="flex items-center justify-center text-xl font-serif">GROWTH</div>
              <div className="flex items-center justify-center text-xl font-serif">TRUST.CO</div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
