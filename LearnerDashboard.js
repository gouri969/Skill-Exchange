import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../firebase/Firebase";
import {
  doc,
  collection,
  onSnapshot,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LearnerDashboard() {
  const [user, setUser] = useState(null);
  const [skillsMap, setSkillsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("learner");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("selectedRole");

    if (role !== "learner") {
      navigate("/login");
      return;
    }

    setSelectedRole(role);

    let unsubUser;
    let unsubSkills;

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const uid = currentUser.uid;

      unsubUser = onSnapshot(doc(db, "users", uid), (snap) => {
        if (snap.exists()) {
          setUser(snap.data());
        }
        setLoading(false);
      });

      unsubSkills = onSnapshot(collection(db, "skills"), (snapshot) => {
        const map = {};
        snapshot.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data().title;
        });
        setSkillsMap(map);
      });
    });

    return () => {
      if (unsubUser) unsubUser();
      if (unsubSkills) unsubSkills();
      unsubAuth();
    };
  }, [navigate]);

  const becomeTeacher = async () => {
    const uid = auth.currentUser.uid;

    await updateDoc(doc(db, "users", uid), {
      roles: arrayUnion("teacher")
    });

    localStorage.setItem("selectedRole", "teacher");
    navigate("/teacher/dashboard");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <p>Access Denied</p>;

  const uniqueSkills = [...new Set(user.skillsLearned || [])];

  const learningProgress = Math.min(uniqueSkills.length * 25, 100);

  const profileProgress = Math.min(
    (user?.name ? 25 : 0) +
      (user?.email ? 25 : 0) +
      (uniqueSkills.length > 0 ? 25 : 0) +
      ((user?.learnerCredits || 0) > 0 ? 25 : 0),
    100
  );

  const circleLength = 408;
  const dashOffset =
    circleLength - (circleLength * learningProgress) / 100;

  return (
    <div className="wrapper">
      <Sidebar role={selectedRole} />

      <main className="dashboard">
        <div className="header-card">
          <div>
            <h2>Welcome back, {user.name} 👋</h2>
            <p>Your learning journey at a glance</p>
          </div>

          {!user.roles?.includes("teacher") ? (
            <button className="teacher-btn" onClick={becomeTeacher}>
              Become Teacher
            </button>
          ) : (
            <button
              className="teacher-badge"
              onClick={() => {
                localStorage.setItem("selectedRole", "teacher");
                navigate("/teacher/dashboard");
              }}
            >
              Teacher Mode
            </button>
          )}
        </div>

        <div className="stats">
          <div className="card card1">
            <h2>{user.learnerCredits || 0}</h2>
            <p>Learning Credits</p>
          </div>

          <div className="card card2">
            <h2>{uniqueSkills.length}</h2>
            <p>Skills Learned</p>
          </div>

          <div className="card card3">
            <h2>Active</h2>
            <p>Account Status</p>
          </div>
        </div>

        <div className="grid">
          <div className="card large skill-box">
            <h3>Skills You Learned</h3>

            <div className="circle-progress">
              <svg width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="#06b6d4"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circleLength}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
              </svg>

              <div className="circle-text">
                <h2>{learningProgress}%</h2>
                <p>Completed</p>
              </div>
            </div>

            {uniqueSkills.length ? (
              <div className="chips">
                {uniqueSkills.map((id) => (
                  <span key={id} className="chip">
                    {skillsMap[id] || "Skill"}
                  </span>
                ))}
              </div>
            ) : (
              <button
                className="explore-btn"
                onClick={() => navigate("/learner/explore")}
              >
                Explore Skills
              </button>
            )}
          </div>

          <div className="card large">
            <h3>Progress</h3>

            <p className="progress-text">
              Profile Completion <span>{profileProgress}%</span>
            </p>
            <div className="bar">
              <div className="fill" style={{ width: `${profileProgress}%` }} />
            </div>

            <p className="progress-text">
              Learning Growth <span>{learningProgress}%</span>
            </p>
            <div className="bar">
              <div className="fill" style={{ width: `${learningProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="insight">
          <h3>AI Insight</h3>
          <p>
            {uniqueSkills.length === 0
              ? "Start learning your first skill today 🚀"
              : uniqueSkills.length < 3
              ? "You're progressing well. Keep going 🔥"
              : "Excellent! You're ready to share knowledge 🎯"}
          </p>
        </div>
      </main>

      <style>{`
        .wrapper{
          display:flex;
          min-height:100vh;
          background:linear-gradient(135deg,#020617,#0f172a,#111827);
          color:#fff;
        }

        .dashboard{
          margin-left:280px;
          padding:32px;
          width:100%;
        }

        .header-card{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:30px;
          border-radius:24px;
          background:linear-gradient(135deg,#6366f1,#06b6d4);
        }

        .teacher-btn,.teacher-badge{
          border:none;
          padding:12px 22px;
          border-radius:14px;
          font-weight:700;
          cursor:pointer;
        }

        .teacher-btn{background:#fff;color:#4f46e5;}
        .teacher-badge{background:#22c55e;color:#fff;}

        .stats{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
          margin-top:28px;
        }

        .card{
          padding:28px;
          border-radius:24px;
        }

        .card1{background:linear-gradient(135deg,#8b5cf6,#6366f1);}
        .card2{background:linear-gradient(135deg,#06b6d4,#14b8a6);}
        .card3{background:linear-gradient(135deg,#f97316,#ef4444);}

        .grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:22px;
          margin-top:28px;
        }

        .large{
          background:rgba(255,255,255,0.08);
        }

        .card h2,
        .card h3,
        .card p,
        .progress-text,
        .insight h3,
        .insight p{
          color:#fff;
        }

        .skill-box{text-align:center;}

        .circle-progress{
          position:relative;
          width:160px;
          height:160px;
          margin:20px auto;
        }

        .circle-text{
          position:absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          text-align:center;
        }

        .circle-text h2{
          margin:0;
          font-size:28px;
          color:#fff;
        }

        .circle-text p{
          margin-top:4px;
          color:#cbd5e1;
        }

        .chips{
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          gap:10px;
          margin-top:20px;
        }

        .chip{
          background:linear-gradient(135deg,#6366f1,#06b6d4);
          padding:10px 18px;
          border-radius:999px;
          color:#fff;
          font-weight:600;
        }

        .progress-text span{
          color:#22c55e;
          font-weight:700;
        }

        .bar{
          height:12px;
          background:#1e293b;
          border-radius:999px;
          overflow:hidden;
          margin-bottom:20px;
        }

        .fill{
          height:100%;
          background:linear-gradient(90deg,#8b5cf6,#06b6d4);
          transition:0.5s;
        }

        .explore-btn{
          border:none;
          padding:12px 20px;
          border-radius:12px;
          background:#06b6d4;
          color:#fff;
          font-weight:700;
          cursor:pointer;
        }

        .insight{
          margin-top:28px;
          padding:26px;
          border-radius:22px;
          background:linear-gradient(135deg,#0ea5e9,#6366f1);
        }

        .loading{
          color:#fff;
          text-align:center;
          padding:50px;
        }
      `}</style>
    </div>
  );
}