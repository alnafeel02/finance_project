import { Shield, Target, Award, Users, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import teamImage from '../assets/images/team-meeting.jpg';
import PageTransition from '../components/PageTransition';

const AboutUs = () => {
  const stats = [
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Loans Disbursed', value: '$500M+' },
    { label: 'Years Experience', value: '15+' },
    { label: 'Partner Banks', value: '25+' },
  ];

  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-content > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .from('.mission-section', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.stat-item', {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4');
  }, { scope: containerRef });

  return (
    <PageTransition>
      <div ref={containerRef} className="pt-24 pb-16 bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 mb-20">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Empowering Your Financial Journey</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At FinanceHub, we believe everyone deserves access to fair and transparent financial solutions. Since 2008, we've been dedicated to simplifying lending.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mission-section grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission & Vision</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Our mission is to bridge the gap between financial ASPIRATIONS and REALITY by providing seamless, digital-first lending experiences.
              </p>
              <div className="flex gap-4">
                <div className="bg-primary-50 p-3 rounded-xl h-fit">
                  <Target className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Focus on Accessibility</h3>
                  <p>Making financial products reachable for every segment of society through innovation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary-50 p-3 rounded-xl h-fit">
                  <Shield className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Uncompromising Trust</h3>
                  <p>Building long-term relationships through total transparency and ethical practices.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary-100 rounded-3xl -rotate-2 z-0" />
            <img 
              src={teamImage} 
              className="relative z-10 rounded-3xl shadow-2xl"
              alt="Team Meeting"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 p-12 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-200">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item text-center">
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-primary-100 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Compliance */}
        <div className="bg-gray-900 text-white p-12 rounded-3xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="bg-primary-500/20 p-6 rounded-full">
              <Award size={64} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Trust & Compliance</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                FinanceHub is a fully licensed Non-Banking Financial Company (NBFC) regulated by the Central Financial Authority. We adhere to the highest standards of data security (ISO 27001) and fair lending practices.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" /> FDIC Insured
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" /> PCI DSS Compliant
                </span>
                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" /> ISO Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default AboutUs;
