import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./Pages/Login&Register/Login";
import Register from "./Pages/Login&Register/Register";
import RoleDashboard from "./Pages/RoleDashboard";
import Unauthorized from "./Pages/Unauthorized";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import ProfessorDashboard from "./Pages/Professor/ProfessorDashboard";
import AdminCourses from "./Pages/Admin/AdminCourses";
import CourseDetail from "./Pages/Admin/CourseDetail";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminUsersPage from "./Pages/Admin/AdminUsersPage";
import MyEnrollments from "./Pages/Student/MyEnrollments";
import Courses from "./Pages/Courses";
import CoursePage from "./Pages/CoursePage";
import './App.css';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/RoleDashboard" element={
            <ProtectedRoute><RoleDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/professor/dashboard" element={
            <ProtectedRoute role="profesor"><ProfessorDashboard /></ProtectedRoute>
          } />
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="alumno"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute role="admin"><AdminCourses /></ProtectedRoute>
          } />
          <Route path="/admin/courses/:id" element={
            <ProtectedRoute role="admin"><CourseDetail /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>
          } />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/my enrollments" element={
            <ProtectedRoute><MyEnrollments /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;