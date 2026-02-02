const LegalPage = ({ title, content }) => {
  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-sm italic">Last Updated: January 28, 2026</p>
          {content.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">{section.heading}</h2>
              <p className="leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <LegalPage 
    title="Privacy Policy" 
    content={[
      { heading: '1. Information We Collect', body: 'We collect information that you provide directly to us when you apply for a loan, create an account, or contact us for support.' },
      { heading: '2. How We Use Your Information', body: 'We use the information we collect to process your loan applications, provide customer support, and improve our services.' },
      { heading: '3. Data Security', body: 'We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure.' }
    ]} 
  />
);

export const TermsOfService = () => (
  <LegalPage 
    title="Terms of Service" 
    content={[
      { heading: '1. Acceptance of Terms', body: 'By accessing or using FinanceHub services, you agree to be bound by these Terms of Service.' },
      { heading: '2. Eligibility', body: 'You must be at least 18 years old and a resident of the supported jurisdictions to use our services.' },
      { heading: '3. Loan Approvals', body: 'All loan applications are subject to credit approval and verification of provided information.' }
    ]} 
  />
);

export const RiskDisclosure = () => (
  <LegalPage 
    title="Risk Disclosure" 
    content={[
      { heading: '1. Financial Risk', body: 'Borrowing money involves financial risk. You should only borrow what you can afford to repay.' },
      { heading: '2. Interest Rates', body: 'Interest rates may vary based on your credit profile and market conditions.' },
      { heading: '3. Default Consequences', body: 'Failure to make timely repayments may result in additional charges and a negative impact on your credit score.' }
    ]} 
  />
);
