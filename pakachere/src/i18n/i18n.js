// translations.js
// Minimal i18n helper used by the component.
// Expand keys as needed or wire to your existing i18n system.

export const translations = {
  en: {
    referral: 'Referral Program',
    referralDescription: 'Invite friends to the platform. When they sign up using your link, you both earn rewards.',
    yourReferralLink: 'Your referral link',
    copy: 'Copy',
    copied: 'Copied!',
    sendEmail: 'Send Email',
    sendEmailNow: 'Send Email',
    howItWorksTitle: 'How it works',
    howItWorks1: 'Share your link or QR code with friends',
    howItWorks2: 'They register using your referral link',
    howItWorks3: 'You both receive rewards when they complete signup',
    scanToRegister: 'Scan to register',
    promoText: 'Share the link and get 2 free tutor sessions when a friend registers using your link!',
    yourReferrals: 'Your referrals',
    addDemoReferral: 'Add demo referral',
    name: 'Name',
    email: 'Email',
    date: 'Date',
    rewarded: 'Rewarded',
    actions: 'Actions',
    noReferrals: 'No referrals yet. Share your link to get started.',
    yes: 'Yes',
    no: 'No',
    markRewarded: 'Mark rewarded',
    sendInvite: 'Send invite',
    sendInviteDescription: 'Write a personal message and open your email client to send the invite.',
    messagePlaceholder: 'Write a short message to your friend...',
    cancel: 'Cancel',
    copiedToClipboard: 'Copied to clipboard',
    shareTweet: 'Join me on this platform!',
    emailSubject: 'Join me on this platform',
    emailBody: 'I thought you might like this platform. Sign up using my link:',
    inviteFriends: 'Invite friends'
  }
  // add other languages as needed
};

export function t(key, lang = 'en') {
  return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
}
