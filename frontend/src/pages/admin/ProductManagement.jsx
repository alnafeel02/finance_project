import { useState, useEffect, useRef } from 'react';
import { 
  Settings2, 
  Trash2, 
  Plus, 
  Layers, 
  Percent, 
  Calendar, 
  DollarSign,
  Edit3,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/finance';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import PageTransition from '../../components/PageTransition';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    interestRate: '',
    maxTenure: '',
    limit: '',
    status: 'Active'
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (!loading && products.length > 0) {
      const tl = gsap.timeline();
      
      tl.to('.header-section', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to('.product-card', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.3');
    }
  }, [loading, products.length]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        interestRate: product.interestRate,
        maxTenure: product.maxTenure,
        limit: product.limit,
        status: product.status
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        interestRate: '',
        maxTenure: '',
        limit: '',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div ref={containerRef} className="space-y-8">
        <div className="header-section flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-0 translate-y-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Product Lifecycle</h1>
          <p className="text-gray-500 text-sm">Configure loan types, rates, and ceiling limits.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((prod) => (
          <div key={prod._id} className="product-card bg-white border border-gray-100 rounded-3xl p-8 relative overflow-hidden group hover:border-primary-600/30 transition-all shadow-xl shadow-gray-200/50 opacity-0 translate-y-8">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-primary-600 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(prod)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-all border border-gray-100"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(prod._id)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl transition-all border border-gray-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tight">{prod.name}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-1 inline-block ${prod.status === 'Active' ? 'text-primary-600' : 'text-gray-400'}`}>
                  {prod.status} Service
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Max Limit</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(prod.limit)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-primary-600/50"><Percent size={14} /></div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Interest Rate</p>
                  <p className="text-xs font-black text-gray-600">{prod.interestRate}% APR</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-primary-600/50"><Calendar size={14} /></div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Max Tenure</p>
                  <p className="text-xs font-black text-gray-600">{prod.maxTenure} Yrs</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interest (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black font-bold"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Tenure (Yrs)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black font-bold"
                    value={formData.maxTenure}
                    onChange={(e) => setFormData({...formData, maxTenure: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Limit ($)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black font-bold"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black font-bold"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 mt-4"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  );
};

export default ProductManagement;
