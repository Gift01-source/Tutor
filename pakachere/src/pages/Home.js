import React from 'react';
import teacherImg from '../assets/1.jpg';
import { Link } from 'react-router-dom';
import './pages.css';



function Home() {
  return (
    <div className="landing-container" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', backgroundImage: `url('https://images.unsplash.com/photo-1584697964154-0d94d3f3a940?auto=format&fit=crop&w=1600&q=80')` }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'white',
          zIndex: 1
        }}></div>
        <div className="hero-content" style={{ position: 'relative', zIndex: 2, background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px rgba(37,99,235,0.10)', padding: '32px 24px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title" style={{fontSize:'2.5rem', fontWeight:'bold', marginBottom: '1rem', color:'#2563eb'}}>Welcome to MyTeacher App</h1>
          <p className="hero-subtitle" style={{marginBottom: '2.5rem', color:'#2563eb', fontWeight:'bold', fontSize:'1.3rem'}}>Find the perfect tutor or become one — in just a few clicks.</p>
          <Link to="/register">
            <button className="button" style={{marginBottom: '0.5rem', fontSize:'1.2rem', padding:'14px 36px', borderRadius:'32px', background:'#2563eb', color:'#fff', boxShadow:'0 4px 24px rgba(37,99,235,0.18)'}}>Get Started</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-list">
          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            title="Qualified Tutors"
            description="We handpick the best instructors across every subject."
          />
          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
            title="Flexible Scheduling"
            description="Book sessions that fit your schedule, anytime."
          />
          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            title="Secure Payments"
            description="Simple, secure payment options built into the platform."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-list">
          <StepCard
            image="https://images.unsplash.com/photo-1611974789857-9c7d53c74f88?auto=format&fit=crop&w=600&q=80"
            title="1. Sign Up"
            description="Create your free account as a student or tutor."
          />
          <StepCard
            image="https://images.unsplash.com/photo-1611974789857-9c7d53c74f88?auto=format&fit=crop&w=600&q=80"
            title="2. Match & Book"
            description="Get matched with tutors and book sessions instantly."
          />
          <StepCard
            image="https://images.unsplash.com/photo-1581093448793-25b9b1ed1573?auto=format&fit=crop&w=600&q=80"
            title="3. Start Learning"
            description="Join your session and learn with ease online."
          />
        </div>
      </section>

      {/* Teachers Section */}
      <section className="teachers-section">
        <h2 className="section-title">Meet Our Teachers</h2>
        <div className="teachers-list">
          <TeacherCard
            image={teacherImg}
            name="Mr. Gift Chimwaza"
            subject="Mathematics"
            bio="Passionate about making math fun and accessible for all ages."
          />
          <TeacherCard
            image={teacherImg}
            name="Mr. John Banda"
            subject="English Literature"
            bio="Bringing stories to life and helping students find their voice."
          />
          <TeacherCard
            image={teacherImg}
            name="Mrs. Emily Waya"
            subject="Science"
            bio="Exploring the wonders of the world through hands-on learning."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} MyTeacher App. All rights reserved.
      </footer>
    </div>
  );
}

const FeatureCard = ({ image, title, description }) => (
  <div className="feature-card">
    <img src={image} alt={title} className="feature-photo" />
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </div>
);

const StepCard = ({ image, title, description }) => (
  <div className="step-card">
    <img src={image} alt={title} className="step-photo" />
    <h4 className="step-title">{title}</h4>
    <p className="step-desc">{description}</p>
  </div>
);

const TeacherCard = ({ image, name, subject, bio }) => (
  <div className="teacher-card">
    <img src={image} alt={name} className="teacher-photo" />
    <h3 className="teacher-name">{name}</h3>
    <p className="teacher-subject">{subject}</p>
    <p className="teacher-bio">{bio}</p>
  </div>
);

export default Home;
