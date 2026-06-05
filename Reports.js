import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Reports() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState(type || "users");
  const [reportData, setReportData] = useState([]);
  const [generatedAt, setGeneratedAt] = useState("");

  useEffect(() => {
    setReportType(type || "users");
  }, [type]);

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not Available";
    return new Date(timestamp).toLocaleString();
  };

  const loadReport = async () => {
    try {
      let data = [];

      const usersSnap = await getDocs(collection(db, "users"));
      const skillsSnap = await getDocs(collection(db, "skills"));
      const requestsSnap = await getDocs(collection(db, "requests"));

      const usersMap = {};
      const teacherMap = {};

      usersSnap.forEach((doc) => {
        usersMap[doc.id] = doc.data().name || "Unknown";

        if (doc.data().roles?.includes("teacher")) {
          teacherMap[doc.id] = {
            teacherName: doc.data().name || "Unknown",
            email: doc.data().email || "",
            learners: new Set(),
          };
        }
      });

      if (reportType === "users") {
        data = usersSnap.docs.map((doc) => ({
          Name: doc.data().name || "",
          Email: doc.data().email || "",
          Roles: doc.data().roles?.join(", ") || "",
        }));
      }

      else if (reportType === "requests") {
        data = requestsSnap.docs.map((doc) => {
          const req = doc.data();
          return {
            Learner: usersMap[req.learnerId] || "",
            Teacher: usersMap[req.teacherId] || "",
            Status: req.status || "",
            Date: formatDate(req.createdAt),
          };
        });
      }

      // ✅ NEW TEACHER LEARNERS REPORT
      else if (reportType === "teacherLearners") {
        requestsSnap.forEach((doc) => {
          const req = doc.data();

          if (teacherMap[req.teacherId]) {
            teacherMap[req.teacherId].learners.add(req.learnerId);
          }
        });

        data = Object.values(teacherMap).map((teacher) => ({
          Teacher: teacher.teacherName,
          Email: teacher.email,
          TotalLearners: teacher.learners.size,
        }));
      }

      setReportData(data);
      setGeneratedAt(new Date().toLocaleString());
    } catch (error) {
      console.error("Report loading error:", error);
    }
  };

  const handleChange = (e) => {
    navigate(`/reports/${e.target.value}`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}-report.xlsx`);
  };

  const exportPDF = () => {
    const pdf = new jsPDF();

    pdf.text(`${reportType.toUpperCase()} REPORT`, 14, 15);
    pdf.text(`Generated On: ${generatedAt}`, 14, 24);

    autoTable(pdf, {
      head: [Object.keys(reportData[0] || {})],
      body: reportData.map((row) => Object.values(row)),
      startY: 32,
    });

    pdf.save(`${reportType}-report.pdf`);
  };

  return (
    <div className="report-page">
      <Sidebar role="teacher" />

      <div className="report-content">
        <div className="top">
          <div>
            <h2>Reports Dashboard</h2>
            <p>Generated On: {generatedAt}</p>
          </div>

          <div className="controls">
            <select value={reportType} onChange={handleChange}>
              <option value="users">Users</option>
              <option value="requests">Requests</option>
              <option value="teacherLearners">Teacher Learners</option>
            </select>

            <button onClick={exportExcel}>Excel</button>
            <button onClick={exportPDF}>PDF</button>
          </div>
        </div>

        <div className="table-box">
          {reportData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">No data found</p>
          )}
        </div>
      </div>

      <style>{`
        .report-page{
          display:flex;
          min-height:100vh;
          background:#0f172a;
          color:white;
        }
        .report-content{
          flex:1;
          margin-left:280px;
          padding:30px;
        }
        .top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          margin-bottom:20px;
        }
        .controls{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }
        select,button{
          padding:10px 16px;
          border:none;
          border-radius:10px;
          background:#1e293b;
          color:white;
        }
        button{
          background:#2563eb;
          cursor:pointer;
        }
        .table-box{
          background:#111827;
          padding:20px;
          border-radius:18px;
          overflow:auto;
        }
        table{
          width:100%;
          border-collapse:collapse;
        }
        th,td{
          padding:14px;
          border-bottom:1px solid #334155;
          text-align:left;
        }
        th{
          color:#38bdf8;
        }
        .empty{
          text-align:center;
          padding:30px;
          color:#94a3b8;
        }
      `}</style>
    </div>
  );
}