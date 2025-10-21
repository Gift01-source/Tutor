
import React,{ useState, useEffect, View } from 'react';
//import Navbar from '../components/Navbar.js';
import API from '../api';
import Messages from './Messages.js';
import './pages.css';

function TutorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch registered students from backend
    API.get('/students')
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setStudents([]);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  

  return (
    <div className="tutor-dashboard-page">
     {/*<Navbar role="tutor" />*/}
      <div className="min-h-screen bg-blue-50 p-6 tutor-dashboard-container">
        <div className="dashboard">
                 
          <div className="cards-grid">
            {/* Upcoming Sessions */}
            <div className="card">
              <h2>Upcoming Sessions</h2>
              <p>You have sessions scheduled with students.</p>
            </div>

            {/* Registered Students - with filtered list */}
            {/*<div className="card">
              <h2>Registered Students</h2>
              {loading ? (
                <p>Loading students...</p>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} style={{marginBottom:8}}>
                    <strong>{student.name}</strong>
                    <div style={{color:'#888', fontSize:'0.95rem'}}>{student.email}</div>
                  </div>
                ))
              ) : (
                <p>No students found matching your search.</p>
              )}
            </div>*/}

            {/* My Profile */}
            {/*<div className="card">
              <h2>My Profile</h2>
              <p>View and edit your profile information.</p>
              <button
                className="button"
                style={{marginTop:8, padding:'8px 16px'}}
                onClick={() => {
                  // For demo, use a static tutorId. Replace with actual logged-in tutor id if available.
                  const tutorId = localStorage.getItem('tutor_id') || 'demo-tutor';
                  window.location.href = `/tutor-profile/${tutorId}`;
                }}
              >Go to Profile</button>
            </div>*/}

            {/* Session History - new card */}
            <div className="card">
              <h2>Session History</h2>
              <div style={{textAlign:'left', width:'100%'}}>
                {[{id:1, student:'Alex Kim', date:'2025-09-18', topic:'Geometry'}, {id:2, student:'Sara Lee', date:'2025-09-10', topic:'Poetry'}].map(session => (
                  <div key={session.id} style={{marginBottom:8, borderBottom:'1px solid #eee', paddingBottom:6}}>
                    <strong>{session.student}</strong> <span style={{color:'#888'}}>{session.date}</span>
                    <div style={{fontSize:'0.95rem', color:'#2563eb'}}>{session.topic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/*<div style={{marginTop:32, textAlign:'center'}}>
            <button
              className="button"
              style={{padding:'12px 24px', fontSize:'1rem'}}
              onClick={() => window.location.href = '/tutor-sessions'}
            >
              View All Sessions
            </button>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  messageContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  };
export default TutorDashboard;
