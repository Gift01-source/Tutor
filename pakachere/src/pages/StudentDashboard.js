import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';
import NotificationBar from '../components/NotificationBar';

function StudentDashboard() {
  const [notification, setNotification] = useState('Welcome to your dashboard!');
  const [popup, setPopup] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [availableTutors, setAvailableTutors] = useState([]);
  const navigate = useNavigate();

  const studentId = localStorage.getItem("student_id"); // replace with actual stored ID

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/student/dashboard?student_id=${studentId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load dashboard");
        }
        const data = await res.json();

        setUpcomingSessions(data.upcoming_sessions || []);
        setSessionHistory(data.session_history || []);
        setGoals(data.goals || []);
        setAvailableTutors(data.available_tutors || []);
      } catch (err) {
        setNotification(err.message);
      }
    };

    if (studentId) fetchDashboard();
    else setNotification("Student ID not found. Please login.");
  }, [studentId]);

  // Notification for upcoming sessions
  useEffect(() => {
    const now = new Date();
    const soonSession = upcomingSessions.find(s => {
      const sessionDate = new Date(`${s.date}T${s.time}`);
      return sessionDate - now < 24 * 60 * 60 * 1000 && sessionDate - now > 0;
    });
    if (soonSession) {
      setNotification(`Reminder: You have a session with ${soonSession.tutor} on ${soonSession.date} at ${soonSession.time}`);
      setPopup(`Upcoming session: ${soonSession.topic} with ${soonSession.tutor} at ${soonSession.time}`);
      setTimeout(() => setPopup(null), 6000);
    }
  }, [upcomingSessions]);

  // Add a new goal
  const handleAddGoal = async () => {
    if (!goalInput.trim()) return;
    try {
      const res = await fetch(`/api/student/goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, text: goalInput })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to add goal");
      }

      const data = await res.json();
      setGoals(data.goals || []);
      setGoalInput('');
    } catch (err) {
      setNotification(err.message);
    }
  };

  // Toggle goal completion
  const handleToggleGoal = idx => {
    const updated = goals.map((g, i) => i === idx ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    // Optional: send updated goal status to backend
  };

  return (
    <div className="dashboard-container">
      {notification && <NotificationBar message={notification} type="info" onClose={() => setNotification('')} />}
      {popup && <div className="popup-notification">{popup}</div>}
      <header className="dashboard-header">Student Dashboard</header>

      <div className="cards-grid">
        {/* Upcoming Sessions */}
        <Card title="Upcoming Sessions">
          {upcomingSessions.length === 0 ? <div className="text-muted">No upcoming sessions.</div> :
            upcomingSessions.map(session => (
              <div key={session.id} className="session-item">
                <div>
                  <strong>{session.tutor}</strong> <span className="text-muted">{session.date} {session.time}</span>
                  <div className="text-accent">{session.topic}</div>
                </div>
                <button className={`small-btn ${session.attended ? 'disabled-btn' : 'mark-btn'}`} disabled={session.attended}>
                  {session.attended ? 'Attended' : 'Mark Attended'}
                </button>
              </div>
            ))
          }
        </Card>

        {/* Available Tutors */}
        <Card title="Available Tutors">
          <button className="full-btn" onClick={() => navigate('/tutor-search')}>Find Tutors</button>
        </Card>

        {/* Progress */}
        <Card title="My Progress">
          {goals.length > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${Math.round(100 * goals.filter(g => g.completed).length / goals.length)}%` }}>
                {Math.round(100 * goals.filter(g => g.completed).length / goals.length)}%
              </div>
            </div>
          )}
          <ul className="goal-list">
            {goals.length === 0 ? <li className="text-muted">No goals yet.</li> :
              goals.map((goal, idx) => (
                <li key={idx}>
                  <input type="checkbox" checked={goal.completed} onChange={() => handleToggleGoal(idx)} />
                  <span className={goal.completed ? 'goal-completed' : ''}>{goal.text}</span>
                </li>
              ))
            }
          </ul>
          <div className="goal-input-container">
            <input type="text" value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="Add a new goal..." />
            <button onClick={handleAddGoal}>Add</button>
          </div>
        </Card>

        {/* Session History */}
        <Card title="Session History">
          {sessionHistory.length === 0 ? <div className="text-muted">No past sessions.</div> :
            sessionHistory.map(session => (
              <div key={session.id} className="history-item">
                <strong>{session.tutor}</strong> <span className="text-muted">{session.date}</span>
                <div className="text-accent">{session.topic}</div>
              </div>
            ))
          }
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
