import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "https://tutorbackend-tr3q.onrender.com/api"; // Your backend URL

const Messages = ({ tutorId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    if (!tutorId) return;
    try {
      const res = await fetch(`${BASE_URL}/messages/${tutorId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [tutorId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      sender: "You",
      message: newMessage,
    };

    try {
      const res = await fetch(`${BASE_URL}/messages/${tutorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (msgId) => {
    try {
      await fetch(`${BASE_URL}/messages/${tutorId}/delete/${msgId}`, { method: "DELETE" });
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  // Edit message
  const handleEditMessage = async (msgId) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    const newText = prompt("Edit message:", msg.message);
    if (newText === null) return; // Cancelled

    try {
      const res = await fetch(`${BASE_URL}/messages/${tutorId}/edit/${msgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit message");

      setMessages(prev => prev.map(m => (m.id === msgId ? data.message : m)));
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", backgroundColor: "#e5ddd5" }}>
      <div style={{ width: "100%", maxWidth: 600, height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f0f2f5", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ background: "#075E54", color: "#fff", padding: "16px", fontWeight: "600", fontSize: "1.1rem", display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="chat" style={{ marginRight: 10 }}>💬</span>
          {tutorId ? `Tutor ${tutorId}` : "Pakachere Chat"}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px 16px", background: "#efeae2" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", marginTop: "40%" }}>No messages yet. Start the chat!</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "You" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{ background: msg.sender === "You" ? "#DCF8C6" : "#fff", borderRadius: "18px", padding: "10px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", maxWidth: "75%", wordBreak: "break-word", fontSize: "1rem", position: "relative" }}>
                  {msg.message}
                  <div style={{ fontSize: "0.75rem", color: "#999", textAlign: "right", marginTop: 4 }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  {msg.sender === "You" && (
                    <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 4 }}>
                      <button onClick={() => handleEditMessage(msg.id)} style={{ fontSize: "0.7rem", padding: "2px 4px" }}>✎</button>
                      <button onClick={() => handleDeleteMessage(msg.id)} style={{ fontSize: "0.7rem", padding: "2px 4px" }}>🗑</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderTop: "1px solid #ddd", background: "#fff", position: "absolute", bottom: 0, width: "100%" }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            style={{ flex: 1, borderRadius: 20, padding: "10px 14px", border: "1px solid #ccc", outline: "none", fontSize: "1rem", backgroundColor: "#f7f7f7", marginRight: 8 }}
          />
          <button onClick={handleSendMessage} style={{ background: "#25D366", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", border: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
