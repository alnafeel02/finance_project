import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { calculateEMI, formatCurrency } from '../utils/finance';
import { Calculator as CalcIcon, RefreshCw, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import PageTransition from '../components/PageTransition';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);

  const emi = calculateEMI(loanAmount, interestRate, tenure);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.header-section', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.calc-input', {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.calc-result', {
      x: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.5');
  }, { scope: containerRef });

  return (
    <PageTransition>
      <div ref={containerRef} className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="header-section text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <CalcIcon className="text-primary-600" size={36} />
            EMI Calculator
          </h1>
          <p className="text-gray-600">Plan your financial future with our simple and accurate EMI calculator.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="calc-input bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                <span className="text-primary-600 font-bold">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-gray-700">Interest Rate (%)</label>
                <span className="text-primary-600 font-bold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-gray-700">Tenure (Years)</label>
                <span className="text-primary-600 font-bold">{tenure} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>

          {/* Results */}
          <div className="calc-result bg-primary-600 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-medium opacity-80 mb-2">Monthly EMI</h2>
              <p className="text-4xl font-bold mb-8">{formatCurrency(emi)}</p>
              
              <div className="space-y-4 pt-8 border-t border-primary-500/50">
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Principal Amount</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Total Interest</span>
                  <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Total Payment</span>
                  <span className="font-semibold">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            <Link 
              to="/register"
              className="mt-8 w-full py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
            >
              Apply Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default EMICalculator;
