// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import teacherImg from '../assets/1.jpg';
import AdComponent from './AdComponent';
import './pages.css';

function Home() {
  return (
    <div className="landing-container" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1584697964154-0d94d3f3a940?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1,
          }}
        ></div>

        <div
          className="hero-content"
          style={{
            position: 'relative',
            zIndex: 2,
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
            padding: '32px 24px',
            maxWidth: '400px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            className="hero-title"
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#2563eb',
            }}
          >
            Welcome to MyTeacher App
          </h1>
          <p
            className="hero-subtitle"
            style={{
              marginBottom: '2.5rem',
              color: '#2563eb',
              fontWeight: 'bold',
              fontSize: '1.3rem',
            }}
          >
            Find the perfect tutor or become one — in just a few clicks.
          </p>
          <Link to="/register">
            <button
              className="button"
              style={{
                marginBottom: '0.5rem',
                fontSize: '1.2rem',
                padding: '14px 36px',
                borderRadius: '32px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(37,99,235,0.18)',
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ color: '#1f1a50', marginBottom: '40px' }}>
          Why Choose Us?
        </h2>
        <div className="features-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
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
      <section className="how-section" style={{ background: '#eef2ff', padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ color: '#1f1a50', marginBottom: '40px' }}>
          How It Works
        </h2>
        <div className="steps-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
          <StepCard
            image="https://images.unsplash.com/photo-1611974789857-9c7d53c74f88?auto=format&fit=crop&w=600&q=80"
            title="1. Sign Up"
            description="Create your free account as a student or tutor."
          />
          <StepCard
            image="https://images.unsplash.com/photo-1581093448793-25b9b1ed1573?auto=format&fit=crop&w=600&q=80"
            title="2. Match & Book"
            description="Get matched with tutors and book sessions instantly."
          />
          <StepCard
            image="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=600&q=80"
            title="3. Start Learning"
            description="Join your session and learn with ease online."
          />
        </div>
      </section>

      {/* Ad Section */}
      <section className="ad-section" style={{ textAlign: 'center', padding: '40px 0' }}>
        <AdComponent />
      </section>

      {/* Teachers Section */}
      <section className="teachers-section" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ color: '#1f1a50', marginBottom: '40px' }}>
          Meet Our Teachers
        </h2>
        <div className="teachers-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
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
      <footer className="footer" style={{ background: '#1f1a50', color: '#fff', textAlign: 'center', padding: '20px 0' }}>
        © {new Date().getFullYear()} MyTeacher App. All rights reserved.
      </footer>
    </div>
  );
}

const FeatureCard = ({ image, title, description }) => (
  <div className="feature-card" style={{ width: '280px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
    <img src={image} alt={title} className="feature-photo" style={{ width: '60px', marginBottom: '15px' }} />
    <h3 className="feature-title" style={{ color: '#2563eb', fontSize: '1.2rem' }}>{title}</h3>
    <p className="feature-desc" style={{ color: '#555' }}>{description}</p>
  </div>
);

const StepCard = ({ image, title, description }) => (
  <div className="step-card" style={{ width: '280px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
    <img src={image} alt={title} className="step-photo" style={{ width: '100%', borderRadius: '12px', marginBottom: '15px' }} />
    <h4 className="step-title" style={{ color: '#2563eb', fontSize: '1.1rem' }}>{title}</h4>
    <p className="step-desc" style={{ color: '#555' }}>{description}</p>
  </div>
);

const TeacherCard = ({ image, name, subject, bio }) => (
  <div className="teacher-card" style={{ width: '280px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
    <img src={image} alt={name} className="teacher-photo" style={{ width: '100%', borderRadius: '12px', marginBottom: '15px' }} />
    <h3 className="teacher-name" style={{ color: '#2563eb' }}>{name}</h3>
    <p className="teacher-subject" style={{ color: '#1f1a50', fontWeight: 'bold' }}>{subject}</p>
    <p className="teacher-bio" style={{ color: '#555' }}>{bio}</p>
  </div>
);

export default Home;
