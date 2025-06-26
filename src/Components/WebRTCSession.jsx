/* import React, { useRef, useState } from "react";
import styles from "./webrtc.module.css";

const WebRTCSession = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: "You", text: chatInput }]);
      setChatInput("");
      // You'd also send this message over the data channel
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.videoSection}>
        <video ref={localVideoRef} autoPlay muted className={styles.video} />
        <video ref={remoteVideoRef} autoPlay className={styles.video} />
      </div>

      <div className={styles.controls}>
        <button className={styles.btn}>🎤 Mute</button>
        <button className={styles.btn}>🎥 Camera</button>
        <button className={styles.btnEnd}>🚫 End Call</button>
      </div>

      <div className={styles.chatBox}>
        <h4>Live Chat</h4>
        <div className={styles.chatMessages}>
          {chatMessages.map((msg, i) => (
            <p key={i}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <div className={styles.chatInput}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default WebRTCSession;
 */