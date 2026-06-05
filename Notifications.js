import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../firebase/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [skillsMap, setSkillsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return setLoading(false);

      const uid = currentUser.uid;
      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) return setLoading(false);

      setUser({ ...userSnap.data(), uid });

      const skillsSnap = await getDocs(collection(db, "skills"));
      let map = {};
      skillsSnap.forEach((docSnap) => {
        map[docSnap.id] = docSnap.data().title;
      });
      setSkillsMap(map);

      const q = query(collection(db, "requests"), where("learnerId", "==", uid));
      const snap = await getDocs(q);

      const arr = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();

          let teacherName = "Unknown";
          const teacherSnap = await getDoc(doc(db, "users", data.teacherId));

          if (teacherSnap.exists()) {
            teacherName = teacherSnap.data().name;
          }

          return {
            id: docSnap.id,
            ...data,
            teacherName,
          };
        })
      );

      setRequests(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ FIXED REALTIME FUNCTION
  const completeSkill = async (requestId, skillId, teacherId) => {
    if (!user) return;

    // 1. update request
    await updateDoc(doc(db, "requests", requestId), {
      status: "completed",
    });

    // 2. learner update
    await updateDoc(doc(db, "users", user.uid), {
      learnerCredits: increment(-1),
      skillsLearned: arrayUnion(skillId),
    });

    // 3. teacher update (REALTIME +1 CREDIT)
    await updateDoc(doc(db, "users", teacherId), {
      teacherCredits: increment(1),
    });

    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "completed" } : item
      )
    );
  };

  const getStatusClass = (status) => {
    return `status-pill ${status}`;
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="notifications-page">
      <Sidebar role="learner" />

      <div className="notifications-content">

        <div className="top-banner">
          <div>
            <h2>Notifications</h2>
            <p>Track your learning updates beautifully.</p>
          </div>

          <div className="counter-box">
            <span>{requests.length}</span>
            <small>Updates</small>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="empty-box">
            <h5>No notifications found</h5>
            <p>Your updates will appear here.</p>
          </div>
        ) : (
          requests.map((item) => (
            <div className="notify-card" key={item.id}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{skillsMap[item.skillId] || "Skill"}</h5>

                <span className={getStatusClass(item.status)}>
                  {item.status}
                </span>
              </div>

              <p><strong>Teacher:</strong> {item.teacherName}</p>

              {item.schedule && (
                <p><strong>Schedule:</strong> {item.schedule}</p>
              )}

              {item.zoomLink && (
                <p>
                  <strong>Meeting:</strong>{" "}
                  <a href={item.zoomLink} target="_blank" rel="noreferrer">
                    Join Session
                  </a>
                </p>
              )}

              {item.status === "accepted" && (
                <button
                  className="request-btn"
                  onClick={() =>
                    completeSkill(item.id, item.skillId, item.teacherId)
                  }
                >
                  Complete Skill
                </button>
              )}
            </div>
          ))
        )}
      </div>

    
     

      <style>{`
        .notifications-page{
  min-height:100vh;
  display:flex;
  background:linear-gradient(135deg,#020617,#0f172a,#111827);
  color:white;
}

.notifications-content{
  margin-left:280px;
  width:100%;
  padding:30px;
}

/* HEADER */
.top-banner{
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  padding:28px;
  border-radius:24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:28px;
  box-shadow:0 12px 30px rgba(99,102,241,0.35);
}

.top-banner h2{
  margin:0;
  font-weight:800;
}

.top-banner p{
  margin-top:6px;
  color:rgba(255,255,255,0.9);
}

.counter-box{
  background:rgba(255,255,255,0.18);
  padding:14px 22px;
  border-radius:18px;
  text-align:center;
  backdrop-filter:blur(12px);
}

.counter-box span{
  font-size:28px;
  font-weight:700;
  display:block;
}

/* CARD */
.notify-card{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:24px;
  padding:24px;
  margin-bottom:20px;
  backdrop-filter:blur(16px);
  box-shadow:0 10px 25px rgba(0,0,0,0.25);
  transition:0.35s;
}

.notify-card:hover{
  transform:translateY(-8px);
  box-shadow:0 18px 35px rgba(99,102,241,0.20);
}

.notify-card h5{
  color:white;
  font-weight:700;
}

.notify-card p{
  color:#e2e8f0;
  margin-bottom:10px;
}

.notify-card a{
  color:#38bdf8;
  text-decoration:none;
  font-weight:600;
}

/* STATUS */
.status-pill{
  padding:7px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  text-transform:capitalize;
}

.status-pill.pending{
  background:rgba(251,191,36,0.15);
  color:#facc15;
}

.status-pill.accepted{
  background:rgba(34,197,94,0.15);
  color:#4ade80;
}

.status-pill.completed{
  background:rgba(59,130,246,0.15);
  color:#60a5fa;
}

.status-pill.rescheduled{
  background:rgba(239,68,68,0.15);
  color:#f87171;
}

/* BUTTON */
.request-btn{
  border:none;
  padding:12px 20px;
  border-radius:14px;
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  font-weight:700;
  transition:0.3s;
}

.request-btn:hover{
  transform:scale(1.04);
  box-shadow:0 10px 20px rgba(99,102,241,0.25);
}

/* EMPTY */
.empty-box{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  padding:50px;
  text-align:center;
  border-radius:24px;
  color:white;
}

.empty-box p{
  color:#cbd5e1;
}

/* MOBILE */
@media(max-width:768px){
  .notifications-content{
    margin-left:0;
  }

  .top-banner{
    flex-direction:column;
    gap:16px;
    align-items:flex-start;
  }
}
      `}</style>
    </div>
  );
}