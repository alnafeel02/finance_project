import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/finance';
import PageTransition from '../components/PageTransition';

const LoanProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data.filter(p => p.status === 'Active'));
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductColor = (idx) => {
    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600'];
    return colors[idx % colors.length];
  };

  const getFeatures = (name) => {
    // Return appropriate default features based on product name if not in DB
    switch (name) {
      case 'Personal Loan': return ['No collateral required', 'Minimal documentation', 'Quick disbursal', 'Flexible repayment'];
      case 'Business Loan': return ['Unsecured loans', 'Working capital solutions', 'Easy expansion capital', 'Tax benefits'];
      case 'Home Loan': return ['Low interest rates', 'Balance transfer option', 'Top-up loan facility', 'Expert legal assistance'];
      case 'Education Loan': return ['Cover tuition & living expenses', 'Grace period after graduation', 'Special rates for top universities', 'No collateral for up to $40k'];
      default: return ['Competitive rates', 'Quick approval', 'Easy documentation', 'Digital process'];
    }
  };

  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && products.length > 0) {
      const tl = gsap.timeline();
      
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to('.loan-product-card', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      }, '-=0.3');
    }
  }, [loading, products.length]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div ref={containerRef} className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="header-section text-center mb-16 opacity-0 translate-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Loan Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Competitive interest rates and flexible tenures designed to fit your unique financial needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, idx) => (
            <div key={product._id} className="loan-product-card flex flex-col bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 opacity-0 translate-y-8">
              <div className={`${getProductColor(idx)} p-8 text-white`}>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-sm opacity-80">Interest Rate</p>
                    <p className="font-bold">{product.interestRate}% APR</p>
                  </div>
                  <div className="border-l border-white/20 pl-6">
                    <p className="text-sm opacity-80">Max Tenure</p>
                    <p className="font-bold">{product.maxTenure} Yrs</p>
                  </div>
                  <div className="border-l border-white/20 pl-6">
                    <p className="text-sm opacity-80">Max Limit</p>
                    <p className="font-bold">{formatCurrency(product.limit)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex-grow">
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 mb-6">
                  <Info className="text-primary-600 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm font-medium text-gray-700">{product.description || 'Flexible loan options tailored for you.'}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {getFeatures(product.name).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="text-green-500" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  to={user ? "/dashboard/apply" : "/register"}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default LoanProducts;
