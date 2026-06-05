import React, { useState } from "react";
import { auth, db } from "../../firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields required!");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          alert("Email already registered. Please login first.");
          navigate("/login");
          return;
        }

        const uid = currentUser.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          if (userData.roles?.includes(role)) {
            alert(`You already have ${role} role`);
            return;
          }

          const updateData = {
            roles: arrayUnion(role),
          };

          if (role === "learner") {
            updateData.learnerCredits = userData.learnerCredits || 10;
          }

          if (role === "teacher") {
            updateData.teacherCredits = userData.teacherCredits || 0;
          }

          await updateDoc(userRef, updateData);

          localStorage.setItem("selectedRole", role);

          alert(`${role} role added successfully`);
          navigate("/login");
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        roles: [role],
        learnerCredits: role === "learner" ? 10 : 0,
        teacherCredits: role === "teacher" ? 0 : 0,
        skillsLearned: [],
        skillsTeaching: [],
      });

      localStorage.setItem("selectedRole", role);

      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="overlay">
        <div className="register-card">
          <h2 className="text-center mb-2">Create Account</h2>
          <p className="text-center text-muted mb-4">
            Join Skill Exchange Platform
          </p>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaUser className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaLock className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Select Role</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaUserTag className="text-muted" />
              </span>
              <select
                className="form-select border-start-0"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="learner">Learner</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-dark w-100 py-2 rounded-pill"
            onClick={handleRegister}
          >
            Register
          </button>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <span
              className="fw-semibold text-decoration-none"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background-image: url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f");
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .overlay {
          width: 100%;
          min-height: 100vh;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .register-card {
          width: 100%;
          max-width: 450px;
          background: rgba(255, 255, 255, 0.96);
          border-radius: 22px;
          padding: 35px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
        }

        .form-control,
        .form-select {
          height: 50px;
          box-shadow: none !important;
        }

        .input-group-text {
          border-radius: 12px 0 0 12px;
        }

        .form-control,
        .form-select {
          border-radius: 0 12px 12px 0;
        }

        .btn-dark {
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .btn-dark:hover {
          opacity: 0.92;
        }
      `}</style>
    </div>
  );
}