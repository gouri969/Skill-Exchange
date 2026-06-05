import React, { useState } from "react";
import { auth, db } from "../../firebase/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  const navigate = useNavigate();

  const goToDashboard = (role) => {
    localStorage.setItem("selectedRole", role); // ✅ save active role

    setTimeout(() => {
      if (role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/learner/dashboard");
      }
    }, 150);
  };

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    goToDashboard(role);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;
      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) {
        alert("User not found!");
        return;
      }

      const userData = userSnap.data();
      const roles = userData.roles || [];

      if (roles.length > 1) {
        setAvailableRoles(roles);
        setShowRoleModal(true);
      } else if (roles.includes("teacher")) {
        goToDashboard("teacher");
      } else if (roles.includes("learner")) {
        goToDashboard("learner");
      } else {
        alert("Invalid role");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <div className="login-card">
          <h2 className="text-center mb-2">Welcome Back</h2>
          <p className="text-center text-muted mb-4">
            Sign in to your account
          </p>

          <div className="mb-3">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label>Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-dark w-100" onClick={handleLogin}>
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {showRoleModal && (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <h4>Select Role</h4>

            {availableRoles.map((role) => (
              <button
                key={role}
                className="btn btn-dark w-100 mb-2"
                onClick={() => handleRoleSelect(role)}
              >
                Continue as {role}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .login-page {
          min-height: 100vh;
          background-image: url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3");
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .overlay {
          width: 100%;
          min-height: 100vh;
          background: rgba(0,0,0,0.35);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.18);
        }

        .input-group-text {
          border-radius: 12px 0 0 12px;
        }

        .form-control {
          border-radius: 0 12px 12px 0;
          height: 50px;
        }

        .role-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .role-modal {
          width: 100%;
          max-width: 350px;
          background: white;
          border-radius: 18px;
          padding: 25px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}