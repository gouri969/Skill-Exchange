import React, { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Select User 💬</h2>

      {users.map(u => (
        <div
          key={u.id}
          onClick={() => navigate(`/chat/${u.id}`)}
          style={{
            padding: 15,
            margin: 10,
            background: "#1e293b",
            color: "white",
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          👤 {u.name} ({u.role})
        </div>
      ))}
    </div>
  );
}