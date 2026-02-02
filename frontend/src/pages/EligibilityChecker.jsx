import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, User, Briefcase, CreditCard, Calendar } from 'lucide-react';

const EligibilityChecker = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    creditScore: '',
    employment: 'salaried',
  });
  const [result, setResult] = useState(null);

  const checkEligibility = (e) => {
    e.preventDefault();
    const { age, income, creditScore } = formData;
    
    let isEligible = true;
    let reasons = [];

    if (age < 21 || age > 65) {
      isEligible = false;
      reasons.push('Age must be between 21 and 65.');
    }
    if (income < 2500) {
      isEligible = false;
      reasons.push('Minimum monthly income should be $2,500.');
    }
    if (creditScore < 650) {
      isEligible = false;
      reasons.push('Minimum credit score required is 650.');
    }

    setResult({ isEligible, reasons });
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Eligibility</h1>
          <p className="text-gray-600">Find out if you qualify for our loan products in just a few seconds.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={checkEligibility} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-primary-600" />
                  Your Age
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 30"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase size={16} className="text-primary-600" />
                  Monthly Income ($)
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard size={16} className="text-primary-600" />
                  Credit Score
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 750"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.creditScore}
                  onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase size={16} className="text-primary-600" />
                  Employment Type
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-black"
                  value={formData.employment}
                  onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
                >
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
              Check Eligibility
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-2xl animate-in zoom-in duration-300 ${result.isEligible ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                {result.isEligible ? (
                  <CheckCircle2 className="text-green-600" size={28} />
                ) : (
                  <AlertCircle className="text-red-600" size={28} />
                )}
                <h3 className={`text-xl font-bold ${result.isEligible ? 'text-green-800' : 'text-red-800'}`}>
                  {result.isEligible ? 'Congratulations! You are eligible.' : 'Sorry, you are not eligible yet.'}
                </h3>
              </div>
              
              {!result.isEligible && (
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                </ul>
              )}
              
              {result.isEligible && (
                <p className="text-green-700 mb-6 font-medium">
                  Based on your preliminary information, you qualify for up to $150,000 in financing.
                </p>
              )}
              
              {result.isEligible && (
                <Link 
                  to="/dashboard/apply"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-100 uppercase tracking-widest text-[10px]"
                >
                  Proceed to Application
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
