import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { db, auth } from "../firebase/Firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const bottomRef = useRef(null);

  const getChatId = (a, b) => [a, b].sort().join("_");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const selectedRole = localStorage.getItem("selectedRole") || "learner";
      setRole(selectedRole);

      const snap = await getDocs(collection(db, "users"));
      const allUsers = snap.docs.map((doc) => doc.data());

      const filteredUsers = allUsers.filter((x) => x.uid !== u.uid);
      setUsers(filteredUsers);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", getChatId(user.uid, selectedUser.uid)),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setMessages(list);
    });

    return () => unsub();
  }, [user, selectedUser]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const counts = {};

      snap.docs.forEach((doc) => {
        const msg = doc.data();

        if (msg.senderId !== selectedUser?.uid) {
          counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
        }
      });

      setUnreadMap(counts);
    });

    return () => unsub();
  }, [user, selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    await addDoc(collection(db, "messages"), {
      chatId: getChatId(user.uid, selectedUser.uid),
      senderId: user.uid,
      receiverId: selectedUser.uid,
      text,
      createdAt: serverTimestamp()
    });

    setText("");
  };

  if (!user) return <h3>Loading...</h3>;

  return (
    <div className="chat-page">
      <Sidebar role={role} />

      <div className="chat-container">
        {/* LEFT PANEL */}
        <div className="users-panel">
          <h3>Chats</h3>

          {users.map((u) => (
            <div
              key={u.uid}
              className={`user-item ${selectedUser?.uid === u.uid ? "active" : ""}`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="user-info">
                <div className="avatar">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <span>{u.name}</span>
              </div>

              {unreadMap[u.uid] > 0 && (
                <span className="badge">{unreadMap[u.uid]}</span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="chat-panel">
          <div className="chat-header">
            {selectedUser ? `💬 ${selectedUser.name}` : "Select User"}
          </div>

          <div className="messages">
            {!selectedUser ? (
              <p className="empty-chat">Select user to start chat</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`msg-row ${m.senderId === user.uid ? "right" : "left"}`}
                >
                  <div className={m.senderId === user.uid ? "my-msg" : "their-msg"}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef}></div>
          </div>

          {selectedUser && (
            <div className="input-box">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .chat-page{
          display:flex;
          min-height:100vh;
          background:#0f172a;
          color:white;
        }

        .chat-container{
          display:flex;
          flex:1;
          margin-left:280px;
        }

        .users-panel{
          width:320px;
          background:#111827;
          padding:20px;
          border-right:1px solid #1f2937;
          overflow-y:auto;
        }

        .users-panel h3{
          margin-bottom:20px;
        }

        .user-item{
          padding:14px;
          border-radius:14px;
          margin-bottom:12px;
          cursor:pointer;
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#1e293b;
          transition:0.3s;
        }

        .user-item:hover{
          background:#334155;
        }

        .user-item.active{
          background:#4f46e5;
        }

        .user-info{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .avatar{
          width:40px;
          height:40px;
          border-radius:50%;
          background:#6366f1;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:bold;
        }

        .badge{
          background:red;
          border-radius:50%;
          padding:4px 8px;
          font-size:12px;
        }

        .chat-panel{
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .chat-header{
          padding:20px;
          background:#111827;
          font-weight:bold;
          border-bottom:1px solid #1f2937;
        }

        .messages{
          flex:1;
          padding:20px;
          overflow-y:auto;
        }

        .msg-row{
          display:flex;
          margin-bottom:12px;
        }

        .msg-row.left{
          justify-content:flex-start;
        }

        .msg-row.right{
          justify-content:flex-end;
        }

        .my-msg,
        .their-msg{
          padding:12px 16px;
          border-radius:18px;
          max-width:280px;
          word-wrap:break-word;
          font-size:15px;
        }

        .my-msg{
          background:#4f46e5;
        }

        .their-msg{
          background:#334155;
        }

        .input-box{
          display:flex;
          padding:15px;
          background:#111827;
          border-top:1px solid #1f2937;
        }

        .input-box input{
          flex:1;
          padding:12px;
          border:none;
          border-radius:12px;
          outline:none;
        }

        .input-box button{
          margin-left:10px;
          padding:12px 20px;
          border:none;
          border-radius:12px;
          background:#4f46e5;
          color:white;
          font-weight:bold;
        }

        .empty-chat{
          opacity:0.7;
        }
      `}</style>
    </div>
  );
}