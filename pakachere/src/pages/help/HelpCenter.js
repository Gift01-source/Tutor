import React from 'react';

function HelpCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700 dark:text-blue-300 text-center">Help Center</h1>
        <p className="mb-8 text-lg text-center">Welcome to the Help Center! Here you can find answers to common questions and get support.</p>

        <div className="space-y-8">
          {/* FAQ Item */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">How do I book a session?</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Go to the <strong>Find Teacher</strong> page and browse available teachers.</li>
              <li>Click on a tutor’s profile to view their availability.</li>
              <li>Go to the <strong>Booking</strong> page.</li>
              <li>Select a date and time that works for you.</li>
              <li>Click <strong>Book Session</strong> and confirm your booking.</li>
              <li>You’ll receive a confirmation email once the session is scheduled.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">How do I reset my password?</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Click on <strong>Login</strong> and then select <strong>Forgot Password</strong>.</li>
              <li>Enter your registered email address.</li>
              <li>Check your inbox for a password reset link.</li>
              <li>Follow the link to create a new password and log in again.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">How do I contact my tutor?</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Go to the <strong>Messages</strong> section in your dashboard.</li>
              <li>Select your tutor from the list.</li>
              <li>Type your message and click <strong>Send</strong>.</li>
              <li>You’ll be notified when your tutor replies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">How do I update my profile?</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Navigate to your <strong>Profile</strong> page from the dashboard.</li>
              <li>Click <strong>Edit Profile</strong>.</li>
              <li>Update your name, bio, profile picture, or other details.</li>
              <li>Click <strong>Save Changes</strong> to apply your updates.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">How do I pay for a session?</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>After booking a session, go to the <strong>Approved Sessions</strong> section.</li>
              <li>Click on the session you want to pay for.</li>
              <li>Choose your preferred payment method (e.g., credit card, mobile money).</li>
              <li>Follow the prompts to complete the transaction.</li>
              <li>You’ll receive a receipt via email once payment is successful.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-lg font-medium mb-2">Need more help?</h2>
          <p>
            Email us at{' '}
            <a href="mailto:support@myteacherapp.com" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">
              support@myteacherapp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
