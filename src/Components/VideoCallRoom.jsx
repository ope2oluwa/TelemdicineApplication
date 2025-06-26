import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./videocallroom.module.css";
import {
  FaMicrophoneSlash,
  FaVideoSlash,
  FaPhoneSlash,
  FaCommentDots,
} from "react-icons/fa";

const SOCKET_SERVER_URL =
  "https://mentalhealthonlineplatfromforuniversitys.onrender.com";

const VideoCallRoom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const userName = state?.userName || "Guest";
  const navigate = useNavigate();

  const [remoteStream, setRemoteStream] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const startConnection = async () => {
      socketRef.current = io(SOCKET_SERVER_URL);
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStreamRef.current;

      socketRef.current.emit("join", roomId);

      socketRef.current.on("user-joined", (userId) => {
        console.log("User joined:", userId);
        callUser(userId);
      });

      socketRef.current.on("offer", handleReceiveOffer);
      socketRef.current.on("answer", handleReceiveAnswer);
      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      socketRef.current.on("chat-message", handleChatMessage);
    };

    const callUser = async (userId) => {
      peerConnectionRef.current = createPeerConnection(userId);
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localStreamRef.current)
        );
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit("offer", { target: userId, offer });
    };

    const createPeerConnection = (userId) => {
      const pc = new RTCPeerConnection(servers);
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", {
            target: userId,
            candidate: event.candidate,
          });
        }
      };
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      };
      return pc;
    };

    const handleReceiveOffer = async ({ from, offer }) => {
      peerConnectionRef.current = createPeerConnection(from);
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localStreamRef.current)
        );
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit("answer", { target: from, answer });
      setConnected(true);
    };

    const handleReceiveAnswer = async ({ answer }) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
      setConnected(true);
    };

    const handleNewICECandidateMsg = async ({ candidate }) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    };

    const handleChatMessage = ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    };

    startConnection();
    return () => {
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [roomId]);

  const toggleMute = () => {
    localStreamRef.current.getAudioTracks()[0].enabled = isMuted;
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks()[0].enabled = isVideoOff;
    setIsVideoOff((prev) => !prev);
  };

  const leaveCall = () => {
    socketRef.current?.disconnect();
    peerConnectionRef.current?.close();
    navigate("/my-sessions");
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("chat-message", {
        roomId,
        sender: userName,
        message,
      });
      setMessages((prev) => [...prev, { sender: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div className={styles.videoRoom}>
      <div className={styles.videoContainer}>
        <div className={styles.videoBox}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
          <p className={styles.nameTag}>You</p>
        </div>
        <div className={styles.videoBox}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={styles.video}
          />
          <p className={styles.nameTag}>Partner</p>
        </div>
      </div>

      {chatOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>Chat</div>
          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles.chatMessage}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <button onClick={toggleMute}>
          <FaMicrophoneSlash />
        </button>
        <button onClick={toggleVideo}>
          <FaVideoSlash />
        </button>
        <button onClick={() => setChatOpen((prev) => !prev)}>
          <FaCommentDots />
        </button>
        <button className={styles.endBtn} onClick={leaveCall}>
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
};

export default VideoCallRoom;
