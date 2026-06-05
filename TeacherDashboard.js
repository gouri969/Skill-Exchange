import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/Firebase";
import {
  doc,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar";
import {
  FaCoins,
  FaChalkboardTeacher,
  FaUserCheck,
  FaBell
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skillsCount, setSkillsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubUser = () => {};
    let unsubRequests = () => {};
    let unsubSkills = () => {};

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const uid = currentUser.uid;
      const selectedRole = localStorage.getItem("selectedRole");

      unsubUser = onSnapshot(doc(db, "users", uid), (snap) => {
        if (!snap.exists()) {
          navigate("/login");
          return;
        }

        const userData = snap.data();

        if (
          selectedRole !== "teacher" ||
          !userData.roles?.includes("teacher")
        ) {
          navigate("/learner/dashboard");
          return;
        }

        setUser(userData);
        setLoading(false);
      });

      const skillsQuery = query(
        collection(db, "skills"),
        where("teacherId", "==", uid)
      );

      unsubSkills = onSnapshot(skillsQuery, (snap) => {
        setSkillsCount(snap.size);
      });

      const skillsSnap = await getDocs(collection(db, "skills"));
      const skillsMap = {};

      skillsSnap.forEach((d) => {
        skillsMap[d.id] = d.data().title;
      });

      const reqQuery = query(
        collection(db, "requests"),
        where("teacherId", "==", uid)
      );

      unsubRequests = onSnapshot(reqQuery, async (snap) => {
        const arr = await Promise.all(
          snap.docs.map(async (d) => {
            const data = d.data();
            let learnerName = "User";

            if (data.learnerId) {
              const learnerSnap = await getDoc(doc(db, "users", data.learnerId));
              if (learnerSnap.exists()) {
                learnerName = learnerSnap.data().name;
              }
            }

            return {
              id: d.id,
              ...data,
              learnerName,
              skillName: skillsMap[data.skillId] || "Skill",
              message: `${learnerName} requested ${
                skillsMap[data.skillId] || "a skill"
              }`
            };
          })
        );

        setRequests(arr);
        setNotifications(arr);
      });
    });

    return () => {
      unsubAuth();
      unsubUser();
      unsubRequests();
      unsubSkills();
    };
  }, [navigate]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard-page">
      <Sidebar role="teacher" />

      <div className="dashboard-content">
        <div className="top-banner">
          <div>
            <h2>Welcome back, {user?.name} 👋</h2>
            <p>Manage your teaching activity in real-time</p>
          </div>

          <button
            className="switch-btn"
            onClick={() => {
              localStorage.setItem("selectedRole", "learner");
              navigate("/learner/dashboard");
            }}
          >
            Switch to Learner
          </button>
        </div>

        <div className="stats-grid">
          <div className="card c1">
            <FaCoins />
            <h3>{user?.teacherCredits || 0}</h3>
            <p>Credits Earned</p>
          </div>

          <div className="card c2">
            <FaChalkboardTeacher />
            <h3>{skillsCount}</h3>
            <p>Skills Teaching</p>
          </div>

          <div className="card c3">
            <FaUserCheck />
            <h3>{requests.length}</h3>
            <p>Live Requests</p>
          </div>

          <div className="card c4">
            <FaBell />
            <h3>{notifications.length}</h3>
            <p>Notifications</p>
          </div>
        </div>

        <div className="content-grid">
          <div className="panel">
            <h3>Live Requests</h3>

            {requests.length === 0 ? (
              <p className="empty">No requests yet</p>
            ) : (
              requests.slice(0, 5).map((r) => (
                <div key={r.id} className="row-item">
                  <span>{r.learnerName}</span>
                  <small>{r.skillName}</small>
                </div>
              ))
            )}
          </div>

          <div className="panel">
            <h3>Notifications</h3>

            {notifications.length === 0 ? (
              <p className="empty">No notifications yet</p>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="row-item">
                  <span>{n.message}</span>
                  <small>{n.status}</small>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="profile-panel">
          <h3>Teacher Profile</h3>

          <div className="profile-grid">
            <div className="profile-box">
              <label>Name</label>
              <span>{user?.name}</span>
            </div>

            <div className="profile-box">
              <label>Email</label>
              <span>{user?.email}</span>
            </div>

            <div className="profile-box">
              <label>Role</label>
              <span>Teacher</span>
            </div>

            <div className="profile-box">
              <label>Status</label>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page{
          display:flex;
          min-height:100vh;
          background:#0f172a;
          color:white;
        }

        .dashboard-content{
          margin-left:280px;
          width:100%;
          padding:30px;
        }

        .top-banner{
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:linear-gradient(135deg,#6366f1,#06b6d4);
          padding:28px;
          border-radius:22px;
          margin-bottom:25px;
        }

        .switch-btn{
          border:none;
          padding:12px 20px;
          border-radius:14px;
          background:white;
          color:#4f46e5;
          font-weight:700;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
          margin-bottom:25px;
        }

        .card{
          padding:24px;
          text-align:center;
          border-radius:18px;
        }

        .card svg{
          font-size:22px;
          margin-bottom:8px;
        }

        .c1{background:#f97316;}
        .c2{background:#10b981;}
        .c3{background:#6366f1;}
        .c4{background:#ec4899;}

        .content-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .panel,.profile-panel{
          background:#111827;
          padding:24px;
          border-radius:20px;
          margin-bottom:25px;
        }

        .row-item{
          padding:14px 0;
          border-bottom:1px solid rgba(255,255,255,0.08);
        }

        .row-item span{
          display:block;
          font-weight:600;
        }

        .row-item small{
          color:#94a3b8;
        }

        .profile-grid{
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:16px;
          margin-top:18px;
        }

        .profile-box{
          background:#1e293b;
          padding:18px;
          border-radius:14px;
        }

        .profile-box label{
          display:block;
          color:#94a3b8;
          font-size:13px;
          margin-bottom:6px;
        }

        .profile-box span{
          font-weight:600;
        }

        .empty{
          color:#94a3b8;
          text-align:center;
          padding:20px;
        }

        .loading{
          text-align:center;
          color:white;
          margin-top:40px;
        }

        @media(max-width:900px){
          .dashboard-content{
            margin-left:0;
          }

          .stats-grid{
            grid-template-columns:repeat(2,1fr);
          }

          .content-grid,
          .profile-grid{
            grid-template-columns:1fr;
          }

          .top-banner{
            flex-direction:column;
            gap:15px;
            text-align:center;
          }
        }
      `}</style>
    </div>
  );
}