import styles from "./messageBubble.module.css";

function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
      <p>{message.text}</p>
      <div className={styles.timestamp}>{formattedTime}</div>
    </div>
  );
}

export default MessageBubble;
