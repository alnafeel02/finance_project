import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../utils/api';
import PageTransition from '../../components/PageTransition';

const ApplyLoan = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanType: 'Personal',
    amount: '',
    purpose: '',
    tenure: '3',
    annualIncome: '',
    interestRate: 12.5,
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.amount || !formData.purpose || !formData.annualIncome) {
        setError('Please fill in all required fields to continue.');
        return;
      }
    }
    if (step === 2) {
      if (!selectedFile) {
        setError('Please upload your Identity Proof to continue.');
        return;
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (selectedFile) {
        data.append('documents', selectedFile);
      }

      await api.post('/loans/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.step-content', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, [step]); // Re-run animation when step changes

  return (
    <PageTransition>
      <div ref={containerRef} className="max-w-4xl mx-auto space-y-8">
      <input 
        type="file" 
        className="hidden" 
        onChange={handleFileChange} 
        id="identity-upload"
        accept=".jpg,.jpeg,.png,.pdf"
      />

      {!success && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Apply for a New Loan</h1>
            <p className="text-gray-500 mt-2">Complete the steps below to submit your application.</p>
          </div>

          <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle2 size={20} /> : s}
                </div>
                <span className={`text-xs font-bold ${step >= s ? 'text-primary-600' : 'text-gray-400'}`}>
                  {s === 1 ? 'Details' : s === 2 ? 'Documents' : 'Confirm'}
                </span>
              </div>
            ))}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 -z-0">
              <div 
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {!success && step === 1 && (
          <div className="step-content p-8 lg:p-12 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-primary-600" /> Loan Specifics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Loan Type</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black"
                  value={formData.loanType}
                  onChange={(e) => setFormData({...formData, loanType: e.target.value})}
                >
                  <option>Personal</option>
                  <option>Business</option>
                  <option>Home</option>
                  <option>Education</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Loan Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    placeholder="e.g. 10000"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tenure (Years)</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black"
                  value={formData.tenure}
                  onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                >
                  {[1, 2, 3, 5, 7, 10, 15, 20].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Monthly Income ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-semibold text-gray-700">Purpose of Loan</label>
                <textarea 
                  rows="3"
                  placeholder="Tell us why you need this loan..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none text-black"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                ></textarea>
              </div>
            </div>
            <button 
              onClick={nextStep}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
            >
              Continue to Documents <ArrowRight size={20} />
            </button>
          </div>
        )}

        {!success && step === 2 && (
          <div className="step-content p-8 lg:p-12 space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="text-primary-600" /> Upload Documents
            </h2>
            <p className="text-sm text-gray-500">Please provide clear scans of the following documents for verification.</p>
            
            <div className="space-y-4">
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-primary-300 hover:bg-primary-50/20 transition-all group">
                <div>
                  <h3 className="font-bold text-gray-900">Identity Proof</h3>
                  <p className="text-xs text-gray-500">Passport, Driver License, or National ID</p>
                </div>
                <button 
                  onClick={() => document.getElementById('identity-upload').click()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedFile ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border border-gray-200 text-gray-700 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600'
                  }`}
                >
                  {selectedFile ? <><CheckCircle2 size={16} /> Selected</> : <><Upload size={16} /> Upload File</>}
                </button>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-in slide-in-from-top duration-300">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">File Ready: {selectedFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-[2] py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
              >
                Continue to Review <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {!success && step === 3 && (
          <div className="step-content p-8 lg:p-12 space-y-8">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
              <ShieldCheck className="text-emerald-600 shrink-0" size={32} />
              <div>
                <h2 className="text-xl font-bold text-emerald-900">Review & Submit</h2>
                <p className="text-emerald-700 text-sm">Please double-check your application details before final submission.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Loan Detail</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span> <span className="font-bold">{formData.loanType}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span> <span className="font-bold">${formData.amount}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Tenure</span> <span className="font-bold">{formData.tenure} Years</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Applicant Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Monthly Income</span> <span className="font-bold">${formData.annualIncome}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Document</span> <span className="font-bold text-emerald-600">{selectedFile?.name}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-orange-600 mt-0.5" />
              <p className="text-xs text-orange-800 leading-relaxed">
                By submitting this application, you authorize FinanceHub to perform a credit check and verify your documents.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="p-12 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Your loan application has been successfully submitted and is under review by our agents. You'll receive an update via email shortly.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-600 text-sm text-center font-bold mt-4 animate-in fade-in">{error}</p>}
      </div>
    </PageTransition>
  );
};

export default ApplyLoan;
