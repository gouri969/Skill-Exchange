import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../firebase/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Explore() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [teachersMap, setTeachersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          setUser({ ...userSnap.data(), uid });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsSnap = await getDocs(collection(db, "skills"));
        const usersSnap = await getDocs(collection(db, "users"));

        let skillsArr = [];
        let teacherObj = {};

        skillsSnap.forEach((docSnap) => {
          skillsArr.push({ id: docSnap.id, ...docSnap.data() });
        });

        usersSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.roles?.includes("teacher")) {
            teacherObj[data.uid] = data.name;
          }
        });

        setSkills(skillsArr);
        setTeachersMap(teacherObj);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const sendRequest = async (skillId, teacherId) => {
    try {
      const requestRef = doc(collection(db, "requests"));

      await setDoc(requestRef, {
        learnerId: user.uid,
        teacherId,
        skillId,
        status: "pending",
        createdAt: Date.now(),
      });

      alert("Request sent successfully");
    } catch (error) {
      alert("Failed to send request");
    }
  };

  const categories = [
    "All",
    ...new Set(skills.map((item) => item.category || "General")),
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchSearch =
      skill.title?.toLowerCase().includes(search.toLowerCase()) ||
      skill.description?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" ||
      (skill.category || "General") === selectedCategory;

    return matchSearch && matchCategory;
  });

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="explore-page">
      {user && <Sidebar role="learner" />}

      <div
        className="explore-content"
        style={{ marginLeft: user ? "260px" : "0px" }}
      >
        {/* Header */}
        <div className="top-banner">
          <div>
            <h2>Explore Skills</h2>
            <p>Find the right mentor and grow beautifully.</p>
          </div>

          <div className="counter-box">
            <span>{filteredSkills.length}</span>
            <small>Skills Found</small>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="filter-box">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-select category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {filteredSkills.map((skill) => (
            <div className="col-md-6 col-lg-4" key={skill.id}>
              <div className="skill-card">
                {skill.imageUrl && (
                  <img
                    src={skill.imageUrl}
                    alt={skill.title}
                    className="skill-img"
                  />
                )}

                <div className="p-4">
                  <span className="skill-tag">
                    {skill.category || "General"}
                  </span>

                  <h5>{skill.title}</h5>

                  <p className="desc">
                    {skill.description || "No description available"}
                  </p>

                  <div className="teacher-box">
                    <div className="teacher-avatar">
                      {teachersMap[skill.teacherId]?.charAt(0) || "T"}
                    </div>

                    <div>
                      <small>Teacher</small>
                      <div className="teacher-name">
                        {teachersMap[skill.teacherId] || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <button
                    className="request-btn"
                    onClick={() => sendRequest(skill.id, skill.teacherId)}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="empty-box">
            <h5>No matching skills found</h5>
            <p>Try changing search or category filter.</p>
          </div>
        )}
      </div>

      <style>{`
        .explore-page{
  min-height:100vh;
  background:linear-gradient(135deg,#020617,#0f172a,#111827);
  color:white;
}

.explore-content{
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
  margin-bottom:25px;
  box-shadow:0 12px 30px rgba(99,102,241,0.35);
}

.top-banner h2{
  font-weight:800;
  margin-bottom:6px;
}

.top-banner p{
  color:rgba(255,255,255,0.9);
}

.counter-box{
  background:rgba(255,255,255,0.18);
  padding:16px 24px;
  border-radius:18px;
  text-align:center;
  backdrop-filter:blur(10px);
}

.counter-box span{
  font-size:28px;
  font-weight:700;
  display:block;
}

/* FILTERS */
.filter-box{
  display:flex;
  gap:15px;
  margin-bottom:28px;
}

.search-input,
.category-select{
  border-radius:14px;
  padding:14px;
  border:none;
  background:rgba(255,255,255,0.08);
  color:white;
  backdrop-filter:blur(12px);
}

.search-input::placeholder{
  color:#cbd5e1;
}

.category-select option{
  color:black;
}

/* CARD */
.skill-card{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:24px;
  overflow:hidden;
  backdrop-filter:blur(16px);
  box-shadow:0 12px 30px rgba(0,0,0,0.25);
  transition:0.35s;
  height:100%;
}

.skill-card:hover{
  transform:translateY(-10px);
  box-shadow:0 20px 35px rgba(99,102,241,0.25);
}

.skill-img{
  width:100%;
  height:220px;
  object-fit:cover;
}

/* TAG */
.skill-tag{
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  padding:6px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
}

.skill-card h5{
  color:white;
  margin-top:14px;
  font-weight:700;
}

.desc{
  color:#e2e8f0;
  min-height:60px;
  font-size:14px;
}

/* TEACHER */
.teacher-box{
  display:flex;
  align-items:center;
  gap:12px;
  background:rgba(255,255,255,0.05);
  border-radius:16px;
  padding:12px;
  margin-bottom:18px;
}

.teacher-avatar{
  width:46px;
  height:46px;
  border-radius:50%;
  background:linear-gradient(135deg,#8b5cf6,#06b6d4);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:18px;
}

.teacher-box small{
  color:#94a3b8;
}

.teacher-name{
  color:white;
  font-weight:600;
}

/* BUTTON */
.request-btn{
  width:100%;
  border:none;
  padding:13px;
  border-radius:14px;
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  font-weight:700;
  transition:0.3s;
}

.request-btn:hover{
  transform:scale(1.03);
  box-shadow:0 10px 20px rgba(99,102,241,0.3);
}

/* EMPTY */
.empty-box{
  margin-top:30px;
  padding:40px;
  border-radius:22px;
  text-align:center;
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  color:white;
}

/* MOBILE */
@media(max-width:768px){
  .filter-box{
    flex-direction:column;
  }

  .top-banner{
    flex-direction:column;
    gap:18px;
    align-items:flex-start;
  }

  .explore-content{
    margin-left:0 !important;
  }
}
      `}</style>
    </div>
  );
}