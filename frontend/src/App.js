import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';


// Pages
import Home from './pages/Home';
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentMonitoring from './pages/Student/StudentMonitoring';
import StudentRating from './pages/Student/StudentRating';

import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerClasses from './pages/lecturer/LecturerClasses';
import LecturerReports from './pages/lecturer/LecturerReports';
import LecturerMonitoring from './pages/lecturer/LecturerMonitoring';
import LecturerRating from './pages/lecturer/LecturerRating';

import PLDashboard from './pages/principalLecturer/PLDashboard';
import PLCourses from './pages/principalLecturer/PLCourses';
import PLReports from './pages/principalLecturer/PLReports';
import PLMonitoring from './pages/principalLecturer/PLMonitoring';
import PLRating from './pages/principalLecturer/PLRating';

import ProgramLeaderDashboard from './pages/programLeader/ProgramLeaderDashboard';
import PLCoursesPL from './pages/programLeader/ProgramLeaderCourses';
import PLReportsPL from './pages/programLeader/ProgramLeaderReports';
import PLMonitoringPL from './pages/programLeader/ProgramLeaderMonitoring';
import PLLecturers from './pages/programLeader/ProgramLeaderLecturers';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/monitoring" element={<StudentMonitoring />} />
            <Route path="/student/rating" element={<StudentRating />} />
            
            {/* Lecturer Routes */}
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer/classes" element={<LecturerClasses />} />
            <Route path="/lecturer/reports" element={<LecturerReports />} />
            <Route path="/lecturer/monitoring" element={<LecturerMonitoring />} />
            <Route path="/lecturer/rating" element={<LecturerRating />} />
            
            {/* Principal Lecturer Routes */}
            <Route path="/principal/dashboard" element={<PLDashboard />} />
            <Route path="/principal/courses" element={<PLCourses />} />
            <Route path="/principal/reports" element={<PLReports />} />
            <Route path="/principal/monitoring" element={<PLMonitoring />} />
            <Route path="/principal/rating" element={<PLRating />} />
            
            {/* Program Leader Routes */}
            <Route path="/program-leader/dashboard" element={<ProgramLeaderDashboard />} />
            <Route path="/program-leader/courses" element={<PLCoursesPL />} />
            <Route path="/program-leader/reports" element={<PLReportsPL />} />
            <Route path="/program-leader/monitoring" element={<PLMonitoringPL />} />
            <Route path="/program-leader/lecturers" element={<PLLecturers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;