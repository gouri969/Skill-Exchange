import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/Firebase";
import {
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditSkills() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const q = query(
          collection(db, "skills"),
          where("teacherId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const allSkills = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setSkills(allSkills);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const startEdit = (skill) => {
    setEditId(skill.id);
    setEditData({
      title: skill.title || "",
      description: skill.description || "",
    });
  };

  const saveEdit = async () => {
    if (!editId) return;

    try {
      await updateDoc(doc(db, "skills", editId), editData);

      setSkills((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...editData } : s))
      );

      setEditId(null);
      alert("Skill updated successfully");
    } catch (error) {
      alert("Failed to update skill");
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await deleteDoc(doc(db, "skills", id));
      setSkills((prev) => prev.filter((s) => s.id !== id));
      alert("Skill deleted");
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading skills...</p>;
  if (!user) return <p className="text-center mt-5">Please login first.</p>;

  return (
    <div className="edit-page d-flex">
      <Sidebar role="teacher" />

      <div className="edit-content">
        {/* Banner */}
        <div className="top-banner">
          <div>
            <h2>Edit Skills</h2>
            <p>Manage your published skills easily.</p>
          </div>

          <div className="counter-box">
            <span>{skills.length}</span>
            <small>Total Skills</small>
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="empty-box">
            <h5>No skills found</h5>
            <p>Add your first skill from Add Skills page.</p>
          </div>
        ) : (
          <div className="row g-4">
            {skills.map((skill) => (
              <div className="col-md-6 col-lg-4" key={skill.id}>
                <div className="skill-card">
                  {editId === skill.id ? (
                    <>
                      <input
                        className="form-control custom-input mb-3"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                      />

                      <textarea
                        className="form-control custom-input mb-3"
                        rows="4"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />

                      <div className="d-flex gap-2">
                        <button className="save-btn" onClick={saveEdit}>
                          Save
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="category-chip">
                        {skill.category || "General"}
                      </span>

                      <h5>{skill.title}</h5>
                      <p>{skill.description}</p>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(skill)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteSkill(skill.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .edit-page{
  min-height:100vh;
  background:linear-gradient(135deg,#020617,#0f172a,#111827);
  color:white;
}

.edit-content{
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
  margin-bottom:30px;
  box-shadow:0 12px 30px rgba(99,102,241,0.28);
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
  backdrop-filter:blur(10px);
}

.counter-box span{
  display:block;
  font-size:24px;
  font-weight:700;
}

/* SKILL CARD */
.skill-card{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.10);
  border-radius:24px;
  padding:24px;
  backdrop-filter:blur(16px);
  box-shadow:0 10px 25px rgba(0,0,0,0.25);
  height:100%;
  transition:0.3s;
}

.skill-card:hover{
  transform:translateY(-8px);
  box-shadow:0 16px 35px rgba(6,182,212,0.15);
}

.skill-card h5{
  margin-top:14px;
  color:#fff;
  font-weight:700;
}

.skill-card p{
  color:#cbd5e1;
  font-size:14px;
  line-height:1.7;
}

/* CATEGORY */
.category-chip{
  background:linear-gradient(135deg,#8b5cf6,#06b6d4);
  color:white;
  padding:7px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
}

/* INPUT */
.custom-input{
  border:none;
  border-radius:14px;
  padding:14px;
  background:rgba(255,255,255,0.08);
  color:white;
}

.custom-input:focus{
  background:rgba(255,255,255,0.10);
  color:white;
  box-shadow:none;
}

.custom-input::placeholder{
  color:#94a3b8;
}

/* BUTTONS */
.save-btn,
.cancel-btn,
.edit-btn,
.delete-btn{
  border:none;
  padding:10px 18px;
  border-radius:12px;
  font-weight:700;
  transition:0.3s;
}

.save-btn{
  background:linear-gradient(135deg,#22c55e,#16a34a);
  color:white;
}

.edit-btn{
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
}

.cancel-btn{
  background:rgba(255,255,255,0.12);
  color:white;
}

.delete-btn{
  background:linear-gradient(135deg,#ef4444,#dc2626);
  color:white;
}

.save-btn:hover,
.edit-btn:hover,
.delete-btn:hover,
.cancel-btn:hover{
  transform:scale(1.04);
}

/* EMPTY */
.empty-box{
  background:rgba(255,255,255,0.08);
  border:1px dashed rgba(255,255,255,0.18);
  padding:50px;
  border-radius:22px;
  text-align:center;
  color:white;
}

.empty-box p{
  color:#cbd5e1;
}

/* MOBILE */
@media(max-width:768px){
  .edit-content{
    margin-left:0;
    padding:20px;
  }

  .top-banner{
    flex-direction:column;
    align-items:flex-start;
    gap:15px;
  }
}
        
      `}</style>
    </div>
  );
}