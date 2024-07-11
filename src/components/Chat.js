import React, { useState, useEffect, useRef } from "react";
import {
  subscribeToMessages,
  sendMessage,
  socket,
} from "../services/socketService";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    subscribeToMessages(handleMessage);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = inputMessage.trim();
    if (userMessage !== "") {
      // Display user message immediately
      setMessages((prevMessages) => [...prevMessages, `You: ${userMessage}`]);

      // Send message to server
      sendMessage(userMessage);

      // Clear input after sending
      setInputMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>Let's copy-chat 🐱</h1>
      <div className="chat-box">
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
              {msg}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            className="message-input"
            type="text"
            value={inputMessage}
            onChange={handleMessageChange}
            placeholder="Type a message..."
          />
          <button className="send-button" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
