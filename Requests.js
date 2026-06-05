import React, { useEffect, useState } from "react";
import { auth, usersRef, requestsRef, db } from "../../firebase/Firebase";
import {
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Requests() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    schedule: "",
    zoomLink: "",
    message: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const q = query(requestsRef, where("teacherId", "==", currentUser.uid));
        const snapshot = await getDocs(q);

        const allRequests = await Promise.all(
          snapshot.docs.map(async (reqDoc) => {
            const data = reqDoc.data();

            let skillName = "Not Found";
            let learnerName = "Unknown Learner";

            const skillSnap = await getDoc(doc(db, "skills", data.skillId));
            if (skillSnap.exists()) skillName = skillSnap.data().title;

            const learnerSnap = await getDoc(doc(db, "users", data.learnerId));
            if (learnerSnap.exists()) learnerName = learnerSnap.data().name;

            return {
              id: reqDoc.id,
              ...data,
              skillName,
              learnerName,
            };
          })
        );

        setRequests(allRequests);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.learnerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const openForm = (request) => {
    setSelectedRequest(request);
    setFormData({
      schedule: "",
      zoomLink: "",
      message: "",
    });
  };

  const handleAccept = async () => {
    if (!formData.schedule || !formData.zoomLink) {
      alert("Please fill schedule and zoom link");
      return;
    }

    await updateDoc(doc(db, "requests", selectedRequest.id), {
      status: "accepted",
      schedule: formData.schedule,
      zoomLink: formData.zoomLink,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "accepted",
              schedule: formData.schedule,
              zoomLink: formData.zoomLink,
            }
          : r
      )
    );

    setSelectedRequest(null);
  };

  const handleMessage = async () => {
    if (!formData.message) {
      alert("Enter message");
      return;
    }

    await updateDoc(doc(db, "requests", selectedRequest.id), {
      status: "rescheduled",
      message: formData.message,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: "rescheduled",
              message: formData.message,
            }
          : r
      )
    );

    setSelectedRequest(null);
  };

  const getStatusBadge = (status) => {
    if (status === "pending") return "warning";
    if (status === "accepted") return "success";
    if (status === "rescheduled") return "info";
    return "secondary";
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!user) return <p className="text-center mt-5">Please login first.</p>;

  return (
    <div className="d-flex requests-page">
      <Sidebar role="teacher" />

      <div className="requests-layout container-fluid">
        <div className="requests-hero">
          <div>
            <h2 className="fw-bold mb-2">📩 Learner Requests</h2>
            <p className="mb-0 hero-subtitle">
              Manage and track learner session requests easily.
            </p>
          </div>

          <div className="request-badge">
            {filteredRequests.length}
            <span>Requests</span>
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search learner or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

        <div className="row g-4">
          {filteredRequests.map((r) => (
            <div className="col-md-6 col-lg-4" key={r.id}>
              <div className="req-card">
                <h5>{r.skillName}</h5>
                <p>👤 {r.learnerName}</p>

                <span className={`badge bg-${getStatusBadge(r.status)}`}>
                  {r.status}
                </span>

                {r.status === "pending" && (
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={() => openForm(r)}
                  >
                    Manage Request
                  </button>
                )}

                {r.status === "accepted" && (
                  <div className="info-box success-box mt-3">
                    <small>
                      <b>Schedule:</b> {r.schedule}<br />
                      <b>Zoom:</b>{" "}
                      <a href={r.zoomLink} target="_blank" rel="noreferrer">
                        Join Meeting
                      </a>
                    </small>
                  </div>
                )}

                {r.status === "rescheduled" && (
                  <div className="info-box warning-box mt-3">
                    <small><b>Message:</b> {r.message}</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedRequest && (
          <div className="modal-overlay">
            <div className="custom-modal">
              <h5 className="mb-3">Schedule Session</h5>

              <input
                type="datetime-local"
                className="form-control mb-2"
                onChange={(e) =>
                  setFormData({ ...formData, schedule: e.target.value })
                }
              />

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Zoom Link"
                onChange={(e) =>
                  setFormData({ ...formData, zoomLink: e.target.value })
                }
              />

              <textarea
                className="form-control mb-3"
                placeholder="Message"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <button className="btn btn-success w-100 mb-2" onClick={handleAccept}>
                Accept
              </button>

              <button className="btn btn-warning w-100 mb-2" onClick={handleMessage}>
                Reschedule
              </button>

              <button
                className="btn btn-secondary w-100"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <style>{`
          .requests-page{
            min-height:100vh;
            background:linear-gradient(135deg,#020617,#0f172a,#111827);
            color:white;
          }

          .requests-layout{
            margin-left:280px;
            width:100%;
            padding:30px;
          }

          .requests-hero{
            background:linear-gradient(135deg,#6366f1,#06b6d4);
            border-radius:24px;
            padding:28px 30px;
            margin-bottom:28px;
            display:flex;
            justify-content:space-between;
            align-items:center;
          }

          .request-badge{
            width:90px;
            height:90px;
            border-radius:22px;
            background:rgba(255,255,255,0.18);
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            font-size:26px;
            font-weight:800;
          }

          .request-badge span{
            font-size:12px;
          }

          .filter-bar{
            display:flex;
            gap:14px;
            margin-bottom:24px;
          }

          .filter-bar input,.filter-bar select{
            flex:1;
            padding:14px;
            border:none;
            border-radius:14px;
          }

          .req-card{
            background:rgba(255,255,255,0.08);
            padding:24px;
            border-radius:20px;
          }

          .info-box{
            padding:12px;
            border-radius:12px;
          }

          .success-box{background:rgba(34,197,94,.15);}
          .warning-box{background:rgba(245,158,11,.15);}

          .modal-overlay{
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.7);
            display:flex;
            justify-content:center;
            align-items:center;
          }

          .custom-modal{
            background:#111827;
            padding:25px;
            border-radius:20px;
            width:100%;
            max-width:420px;
          }

          @media(max-width:992px){
            .requests-layout{
              margin-left:0;
              padding:20px;
            }

            .requests-hero{
              flex-direction:column;
              align-items:flex-start;
              gap:15px;
            }

            .filter-bar{
              flex-direction:column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}