import React, { useState, useEffect, useRef } from "react";

const Messages = ({ tutorId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages for this tutor
  useEffect(() => {
    const key = tutorId ? `messages_${tutorId}` : "messages";
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setMessages(stored);
  }, [tutorId]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    const key = tutorId ? `messages_${tutorId}` : "messages";
    localStorage.setItem(key, JSON.stringify(updated));
    setNewMessage("");
  };

  return (
    <div className="messages-root" style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", backgroundColor: "#e5ddd5" }}>
      <div className="messages-container" style={{ width: "100%", maxWidth: 600, height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f0f2f5", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        {/* Header */}
        <div className="messages-header" style={{ background: "#075E54", color: "#fff", padding: "16px", fontWeight: "600", fontSize: "1.1rem", display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="chat" style={{ marginRight: 10 }}>
            💬
          </span>
          {tutorId ? `Tutor ${tutorId}` : "Pakachere Chat"}
        </div>

        {/* Messages */}
        <div className="messages-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px 16px", background: "#efeae2" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", marginTop: "40%" }}>
              No messages yet. Start the chat!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "You" ? "flex-end" : "flex-start", marginBottom: 12, animation: "fadeIn 0.3s ease-in" }}>
                <div className={msg.sender === "You" ? "messages-bubble" : "messages-bubble-other"} style={{ background: msg.sender === "You" ? "#DCF8C6" : "#fff", borderRadius: "18px", padding: "10px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", maxWidth: "75%", wordBreak: "break-word", fontSize: "1rem" }}>
                  {msg.message}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#999",
                      textAlign: "right",
                      marginTop: 4,
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderTop: "1px solid #ddd", background: "#fff", position: "absolute", bottom: 0, width: "100%" }}>
          <input className="messages-input" type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} style={{ flex: 1, borderRadius: 20, padding: "10px 14px", border: "1px solid #ccc", outline: "none", fontSize: "1rem", backgroundColor: "#f7f7f7", marginRight: 8 }} />
          <button className="messages-send-btn" onClick={handleSendMessage} style={{ background: "#25D366", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", border: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
