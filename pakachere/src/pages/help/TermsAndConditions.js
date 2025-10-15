import React from 'react';

function TermsAndConditions() {
  const sections = [
    {
      title: '1. Accurate Information',
      content:
        'You agree to provide truthful, complete, and up-to-date information during registration and while using the platform.',
    },
    {
      title: '2. Account Security',
      content:
        'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
    },
    {
      title: '3. Professional Conduct',
      content:
        'All sessions must be conducted respectfully, ethically, and professionally. Harassment, discrimination, or inappropriate behavior will not be tolerated.',
    },
    {
      title: '4. Payment & Refunds',
      content:
        'Payments for sessions must be made through approved methods. Refunds are subject to platform policies and may require review by the support team.',
    },
    {
      title: '5. Platform Misuse',
      content:
        'Any misuse of the app—including spamming, impersonation, or fraudulent activity—may result in suspension or termination of your account.',
    },
    {
      title: '6. Legal Compliance',
      content:
        'All communication and content shared on the platform must comply with applicable laws, including data protection, copyright, and anti-harassment regulations.',
    },
    {
      title: '7. Session Cancellations',
      content:
        'Tutors and students must adhere to the cancellation policy. Late cancellations or no-shows may incur penalties or affect your reputation score.',
    },
    {
      title: '8. Intellectual Property',
      content:
        'Content uploaded or shared by tutors (e.g., tutorials, notes) remains their intellectual property unless otherwise agreed. Unauthorized use is prohibited.',
    },
    {
      title: '9. Platform Updates',
      content:
        'MyTeacher App reserves the right to update features, policies, or terms at any time. Continued use of the app implies acceptance of these changes.',
    },
    {
      title: '10. Support & Disputes',
      content:
        'For any issues, users should contact support. Disputes will be handled in accordance with platform procedures and may involve mediation or review.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-6 sm:px-6 sm:py-10">
      <div className="max-w-md sm:max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 sm:p-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-6 text-center">
          Terms and Conditions
        </h1>

        <p className="mb-4 sm:mb-6 text-base sm:text-lg text-center">
          By registering and using <strong>MyTeacher App</strong>, you agree to the following terms and conditions. These terms govern your use of the platform as a tutor or student and ensure a safe, respectful, and professional learning environment.
        </p>

        <div className="space-y-4 sm:space-y-6 text-sm sm:text-base leading-relaxed">
          {sections.map(({ title, content }, index) => (
            <div key={index}>
              <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
              <p className="mt-1">{content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <h2 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Need assistance?</h2>
          <p className="text-sm sm:text-base">
            Email us at{' '}
            <a
              href="mailto:support@myteacherapp.com"
              className="underline hover:opacity-80 transition-opacity"
            >
              support@myteacherapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
