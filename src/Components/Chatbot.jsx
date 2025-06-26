import React, { useState, useRef, useEffect } from "react";
import styles from "./chatbot.module.css";
import { GoogleGenAI } from "@google/genai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

/*   const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  const modelName = ""; // ✅ Your selected model */

  useEffect(() => {
    setMessages([
      {
        text: "Hi, I’m your mental health assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3000/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_GEMINI_API_KEY`, // Replace with your Gemini API key
        },
        body: JSON.stringify({
          message: input, // Adjust this payload as per Gemini AI's requirements
        }),
      });

      if (!response.ok) {
        console.error("API Error:", response.status, await response.text());
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log("Gemini AI response:", data);

      const botText =
        data.reply ||
        "Sorry, I’m having trouble understanding. Could you try again?";

      setMessages((prev) => [
        ...prev,
        { text: botText, sender: "bot", timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Oops! Something went wrong. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            <div>{msg.text}</div>
            <div className={styles.timestamp}>{formatTime(msg.timestamp)}</div>
          </div>
        ))}

        {isTyping && (
          <div className={styles.typing}>
            <span className={styles.typingDot}></span>
            <span className={styles.typingDot}></span>
            <span className={styles.typingDot}></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
