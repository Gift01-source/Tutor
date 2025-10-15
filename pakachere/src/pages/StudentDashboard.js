import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';
import NotificationBar from '../components/NotificationBar';

function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('Welcome to your dashboard!');
  const [popup, setPopup] = useState(null);
  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem('student_goals') || '[]'));
  const [goalInput, setGoalInput] = useState('');
  const navigate = useNavigate();

  const upcomingSessions = [
    {id:1, tutor:'Ms. Jane Doe', date:'2025-10-03', time:'10:00', topic:'Algebra', attended: false},
    {id:2, tutor:'Mr. John Smith', date:'2025-10-05', time:'14:00', topic:'Essay Writing', attended: false}
  ];

  const handleAddGoal = () => {
    if (!goalInput.trim()) return;
    const updated = [...goals, { text: goalInput, completed: false }];
    setGoals(updated);
    localStorage.setItem('student_goals', JSON.stringify(updated));
    setGoalInput('');
  };

  const handleToggleGoal = idx => {
    const updated = goals.map((g, i) => i === idx ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    localStorage.setItem('student_goals', JSON.stringify(updated));
  };

  // Notification for upcoming sessions
  useEffect(() => {
  const now = new Date();
  const soonSession = upcomingSessions.find(s => {
    const sessionDate = new Date(`${s.date}T${s.time}`);
    return sessionDate - now < 24*60*60*1000 && sessionDate - now > 0;
  });
  if (soonSession) {
    setNotification(`Reminder: You have a session with ${soonSession.tutor} on ${soonSession.date} at ${soonSession.time}`);
    setPopup(`Upcoming session: ${soonSession.topic} with ${soonSession.tutor} at ${soonSession.time}`);
    setTimeout(() => setPopup(null), 6000);
  }
}, []); // eslint warning here


  return (
    <div className="dashboard-container">
      {notification && (
        <NotificationBar message={notification} type="info" onClose={() => setNotification('')} />
      )}
      {popup && (
        <div className="popup-notification">
          {popup}
        </div>
      )}
      <header className="dashboard-header">Student Dashboard</header>

      <div className="cards-grid">
        {/* Upcoming Sessions */}
        <Card title="Upcoming Sessions">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="session-item">
              <div>
                <strong>{session.tutor}</strong> <span className="text-muted">{session.date} {session.time}</span>
                <div className="text-accent">{session.topic}</div>
              </div>
              <button
                className={`small-btn ${session.attended ? 'disabled-btn' : 'mark-btn'}`}
                disabled={session.attended}
              >
                {session.attended ? 'Attended' : 'Mark Attended'}
              </button>
            </div>
          ))}
        </Card>

        {/* Available Tutors */}
        <Card title="Available Tutors">
          <button className="full-btn" onClick={() => navigate('/tutor-search')}>Find Tutors</button>
        </Card>

        {/* Progress */}
        <Card title="My Progress">
          {goals.length > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{width: `${Math.round(100 * goals.filter(g => g.completed).length / goals.length)}%`}}>
                {Math.round(100 * goals.filter(g => g.completed).length / goals.length)}%
              </div>
            </div>
          )}
          <ul className="goal-list">
            {goals.length === 0 ? (
              <li className="text-muted">No goals yet.</li>
            ) : (
              goals.map((goal, idx) => (
                <li key={idx}>
                  <input type="checkbox" checked={goal.completed} onChange={() => handleToggleGoal(idx)} />
                  <span className={goal.completed ? 'goal-completed' : ''}>{goal.text}</span>
                </li>
              ))
            )}
          </ul>
          <div className="goal-input-container">
            <input type="text" value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="Add a new goal..." />
            <button onClick={handleAddGoal}>Add</button>
          </div>
        </Card>

        {/* Session History */}
        <Card title="Session History">
          {[{id:1, tutor:'Ms. Jane Doe', date:'2025-09-20', topic:'Algebra'}, {id:2, tutor:'Mr. John Smith', date:'2025-09-15', topic:'Essay Writing'}].map(session => (
            <div key={session.id} className="history-item">
              <strong>{session.tutor}</strong> <span className="text-muted">{session.date}</span>
              <div className="text-accent">{session.topic}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* Reusable Card */
const Card = ({ title, children }) => (
  <div className="dashboard-card">
    <h2>{title}</h2>
    {children}
  </div>
);

export default StudentDashboard;
