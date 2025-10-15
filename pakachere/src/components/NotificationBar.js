import React from 'react';
import './NotificationBar.css';

function NotificationBar({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`notification-bar notification-${type}`}>
      <span>{message}</span>
      <button className="notification-close" onClick={onClose}>&times;</button>
    </div>
  );
}

export default NotificationBar;
