import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Review from "./pages/Review";

// Auth pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AddSkills from "./pages/teacher/AddSkills";
import EditSkills from "./pages/teacher/EditSkills";
import TeacherRequests from "./pages/teacher/Requests";

// Learner pages
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import Explore from "./pages/learner/Explore";
import Notifications from "./pages/learner/Notifications";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Shared Chat */}
        <Route
  path="/chat"
  element={
    <ProtectedRoute allowedRoles={["learner", "teacher"]}>
      <Chat />
    </ProtectedRoute>
  }
/>

<Route
  path="/chat/:id"
  element={
    <ProtectedRoute allowedRoles={["learner", "teacher"]}>
      <Chat />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports/:type"
  element={
    <ProtectedRoute allowedRoles={["learner", "teacher"]}>
      <Reports />
    </ProtectedRoute>
  }
/>

<Route
  path="/review"
  element={
    <ProtectedRoute allowedRoles={["teacher", "learner"]}>
      <Review />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["learner", "teacher"]}>
      <Profile />
    </ProtectedRoute>
  }
/>
       <Route
  path="/teacher/dashboard"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/addskill"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <AddSkills />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/editskills"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <EditSkills />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher/requests"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherRequests />
    </ProtectedRoute>
  }
/>

        {/* Learner */}
      <Route
  path="/learner/dashboard"
  element={
    <ProtectedRoute allowedRoles={["learner"]}>
      <LearnerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/learner/explore"
  element={
    <ProtectedRoute allowedRoles={["learner"]}>
      <Explore />
    </ProtectedRoute>
  }
/>

<Route
  path="/learner/notifications"
  element={
    <ProtectedRoute allowedRoles={["learner"]}>
      <Notifications />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;