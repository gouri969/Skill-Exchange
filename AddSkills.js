import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { db, auth } from "../../firebase/Firebase";
import { collection, addDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSkills() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addSkill = async () => {
    if (!title || !description || !category) {
      alert("Fill required fields");
      return;
    }

    try {
      await addDoc(collection(db, "skills"), {
        teacherId: auth.currentUser.uid,
        teacherName: auth.currentUser.displayName || "Teacher",
        title,
        description,
        category,
        level,
        duration,
        imageUrl,
        createdAt: Date.now(),
      });

      alert("Skill Added Successfully");

      setTitle("");
      setDescription("");
      setCategory("");
      setLevel("Beginner");
      setDuration("");
      setImageUrl("");
    } catch (error) {
      alert("Error adding skill");
    }
  };

  return (
    <div className="addskill-page d-flex">
      <Sidebar role="teacher" />

      <div className="addskill-content">
        {/* Top Banner */}
        <div className="top-banner">
          <div>
            <h2>Add New Skill</h2>
            <p>Create and share your knowledge with learners.</p>
          </div>

          <div className="counter-box">
            <span>+</span>
            <small>New Skill</small>
          </div>
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-8">
            <div className="custom-card">
              <h4 className="mb-4">Skill Information</h4>

              <div className="mb-3">
                <label>Skill Title</label>
                <input
                  className="form-control custom-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter skill title"
                />
              </div>

              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control custom-input"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write skill description"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <input
                    className="form-control custom-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Programming / Design"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Level</label>
                  <select
                    className="form-control custom-input"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Duration</label>
                  <input
                    className="form-control custom-input"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 Weeks"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Image URL</label>
                  <input
                    className="form-control custom-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image link"
                  />
                </div>
              </div>

              <button className="publish-btn" onClick={addSkill}>
                Publish Skill
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-4">
            <div className="custom-card">
              <small className="preview-label">LIVE PREVIEW</small>
              <h4>{title || "Skill Title"}</h4>
              <p>{description || "Your skill description appears here."}</p>

              <span className="badge-chip">{category || "Category"}</span>
              <span className="badge-chip ms-2">{level}</span>

              <hr />

              <p><strong>Duration:</strong> {duration || "Not added"}</p>
              <p><strong>Teacher:</strong> {auth.currentUser?.displayName || "Teacher"}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .addskill-page{
  min-height:100vh;
  background:linear-gradient(135deg,#020617,#0f172a,#111827);
  color:white;
}

.addskill-content{
  margin-left:280px;
  width:100%;
  padding:30px;
}

/* HEADER */
.top-banner{
  background:linear-gradient(135deg,#8b5cf6,#06b6d4);
  color:white;
  padding:28px;
  border-radius:24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:28px;
  box-shadow:0 12px 30px rgba(139,92,246,0.30);
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
.custom-card{
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.12);
  padding:28px;
  border-radius:24px;
  backdrop-filter:blur(16px);
  box-shadow:0 10px 25px rgba(0,0,0,0.25);
  color:white;
}

.custom-card h4{
  color:white;
  font-weight:700;
}

.custom-card label{
  color:#cbd5e1;
  font-weight:600;
  margin-bottom:8px;
}

/* INPUT */
.custom-input{
  border:none;
  border-radius:14px;
  padding:14px;
  background:rgba(255,255,255,0.08);
  color:white;
}

.custom-input::placeholder{
  color:#94a3b8;
}

.custom-input:focus{
  background:rgba(255,255,255,0.10);
  color:white;
  box-shadow:none;
  border:none;
}

select.custom-input option{
  color:black;
}

/* BUTTON */
.publish-btn{
  width:100%;
  border:none;
  padding:14px;
  border-radius:14px;
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  font-weight:700;
  margin-top:12px;
  transition:0.3s;
}

.publish-btn:hover{
  transform:scale(1.02);
  box-shadow:0 10px 20px rgba(99,102,241,0.25);
}

/* PREVIEW */
.preview-label{
  color:#94a3b8;
  font-size:12px;
  font-weight:700;
  letter-spacing:1px;
}

.badge-chip{
  background:linear-gradient(135deg,#6366f1,#06b6d4);
  color:white;
  padding:8px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
}

.custom-card p{
  color:#e2e8f0;
}

.custom-card hr{
  border-color:rgba(255,255,255,0.08);
}

/* MOBILE */
@media(max-width:768px){
  .addskill-content{
    margin-left:0;
    padding:20px;
  }

  .top-banner{
    flex-direction:column;
    align-items:flex-start;
    gap:16px;
  }
}
      `}</style>
    </div>
  );
}