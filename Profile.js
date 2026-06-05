import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { auth, db } from "../firebase/Firebase";
import {
  updatePassword,
  sendPasswordResetEmail
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

export default function Profile() {
  const user = auth.currentUser;

  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not Available";

    if (dateValue?.toDate) {
      return dateValue.toDate().toLocaleDateString();
    }

    return new Date(dateValue).toLocaleDateString();
  };

  const loadProfile = async () => {
    try {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setName(data.name || "");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updateProfile = async () => {
    try {
      if (!name.trim()) {
        setMessage("Name cannot be empty");
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim()
      });

      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const changePassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        setMessage("Please fill both password fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        setMessage("Password must be at least 6 characters");
        return;
      }

      await updatePassword(user, newPassword);

      setMessage("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const sendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage("Reset email sent successfully");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar
        role={userData.roles?.includes("teacher") ? "teacher" : "learner"}
      />

      <div className="profile-content">
        <div className="profile-card">
          <h2>My Profile</h2>

          {message && <p className="message">{message}</p>}

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div className="field">
            <label>Role</label>
            <input
              type="text"
              value={userData.roles?.join(", ") || ""}
              disabled
            />
          </div>

          <div className="field">
            <label>Learner Credits</label>
            <input
              type="text"
              value={userData.learnerCredits || 0}
              disabled
            />
          </div>

          <div className="field">
            <label>Teacher Credits</label>
            <input
              type="text"
              value={userData.teacherCredits || 0}
              disabled
            />
          </div>

          

          <button onClick={updateProfile}>
            Save Profile
          </button>

          <hr />

          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={changePassword}>
            Change Password
          </button>

          <button className="reset-btn" onClick={sendResetEmail}>
            Send Reset Email
          </button>
        </div>
      </div>

      <style>{`
        .profile-page{
          display:flex;
          min-height:100vh;
          background:#0f172a;
          color:white;
        }

        .profile-content{
          flex:1;
          margin-left:280px;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:30px;
        }

        .profile-card{
          width:500px;
          background:#111827;
          padding:30px;
          border-radius:20px;
          box-shadow:0 0 25px rgba(0,0,0,0.3);
        }

        h2{
          text-align:center;
          margin-bottom:20px;
        }

        .message{
          text-align:center;
          color:#22c55e;
          margin-bottom:15px;
        }

        .field{
          margin-bottom:18px;
        }

        label{
          display:block;
          margin-bottom:8px;
          color:#94a3b8;
        }

        input{
          width:100%;
          padding:12px;
          border:none;
          border-radius:10px;
          background:#1e293b;
          color:white;
          outline:none;
        }

        button{
          width:100%;
          padding:12px;
          border:none;
          border-radius:10px;
          background:#2563eb;
          color:white;
          margin-top:12px;
          cursor:pointer;
          font-weight:600;
        }

        .reset-btn{
          background:#7c3aed;
        }

        hr{
          margin:25px 0;
          border:1px solid #334155;
        }
      `}</style>
    </div>
  );
}