// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import ReferralProgram from './pages/ReferralProgram';
import StudentTutorials from './pages/tutorials/StudentTutorials';
import TutorUpload from './pages/tutorials/TutorUpload';
import HelpCenter from './pages/help/HelpCenter';
import TermsAndConditions from './pages/help/TermsAndConditions';
import Login from './pages/Login';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TutorProfile from './pages/TutorProfile';
import StudentProfile from './pages/StudentProfile';
import BookSession from './pages/BookSession';
import TutorSessions from './pages/TutorSessions';
import ResetPassword from './pages/ResetPassword';
import Payment from './pages/Payment';
import Messages from './pages/Messages';
import Home from './pages/Home';
import TutorSearch from './pages/TutorSearch';
import TutorDetailsView from './pages/TutorDetailsView';
import TutorDetails from './pages/TutorAdditionalDetails';
import Book from './pages/Booking'
//import TutorUpload from './pages/tutorials/TutorUpload';
import LiveSession from './pages/video';
import LiveSessionsPage from './pages/LiveSessionsPage';
import NewPassword from './pages/NewPassword';

function BackArrow() {
  return (
    <div style={{ padding: '16px' }}>
      <button
        onClick={() => window.history.back()}
        style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        &larr; Back
      </button>
    </div>
  );
}

function App() {
  useEffect(() => {
    // If you re-enable socket later, import and attach listeners here.
  
    // socket.on('connect', () => console.log('Socket connected'));
    // return () => { socket.off('connect'); };
  }, []);

  const userRole = localStorage.getItem('role') || null;

  return (
    <BrowserRouter>
      {/*<Navbar role={userRole} />*/}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />
        <Route path="/tutordetails" element={<TutorDetails />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password/:token" element={<NewPassword />} />

        <Route path="/student-dashboard" element={<><Navbar role="student" /><StudentDashboard /></>} />
        <Route path="/tutor-dashboard" element={<><Navbar role="tutor" /><TutorDashboard /></>} />

        <Route path="/student-profile" element={<><BackArrow /><StudentProfile /></>} />
        <Route path="/tutor-profile/:tutorId" element={<><BackArrow /><TutorProfile /></>} />

        <Route path="/payment" element={<><BackArrow /><Payment /></>} />
        <Route path="/messages" element={<><BackArrow /><Messages /></>} />
        <Route path="/book-session/:id" element={<BookSession />} />
        <Route path="/book" element={<><BackArrow /><Book/></>}/>
       {/* <Route path="/book-session" element={<Booking />} />*/}
        <Route path="/tutor-sessions" element={<><BackArrow /><TutorSessions /></>} />

        <Route path="/tutor-search" element={<><BackArrow /><TutorSearch /></>} />
        <Route path="/help" element={<><BackArrow /><HelpCenter /></>} />
        <Route path="/terms" element={<TermsAndConditions />} />

        <Route path="/view-tutor-details/:tutorId" element={<><BackArrow /><TutorDetailsView /></>}/>

        <Route path="/student-tutorials" element={<><BackArrow /><StudentTutorials /></>} />
        <Route path="/tutor/:tutorId/upload" element={<><BackArrow /><TutorUpload /></>} />
        {/*<Route path="/tutor/upload" element={<><BackArrow /><TutorUpload /></>} />*/}
        <Route path="/referral" element={<><BackArrow /><ReferralProgram /></>} />
        <Route path="/tutor/:id" element={<><BackArrow /><TutorDetails /></>} />
        <Route path="/video" element={<LiveSession />} />
        <Route path="/live-sessions" element={<><BackArrow /><LiveSessionsPage /></>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
