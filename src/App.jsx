import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./Pages/Login&Register/Login";
import Register from "./Pages/Login&Register/Register";
import Unauthorized from "./Pages/Unauthorized";
import "./app.css"
// Layouts
import StudentLayout from "./Pages/Student/LayoutAlumno";
import ProfessorLayout from "./Pages/Profesor/LayoutProfesor";
import AdminLayout from "./Pages/Admin/LayoutAdmin";

// Dashboards y páginas
import RoleDashboard from "./Pages/RoleDashboard";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import ProfessorDashboard from "./Pages/Profesor/ProfesorDashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminUsersPage from "./Pages/Admin/AdminUsersPage";
import AdminCourses from "./Pages/Admin/AdminCourses";
import CourseDetail from "./Pages/Admin/CourseDetail";
import ProfessorCourseDetail from "./Pages/Profesor/ProfesorCourseDetail";
import StudentCourses from "./Pages/Student/CouresAlumno";
import StudentCourseDetail from "./Pages/Student/CourseDetailAlumno";
import MyEnrollments from "./Pages/Student/MyEnrollments";
import Courses from "./Pages/Courses";
import CoursePage from "./Pages/CoursePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Ruta role dashboard */}
          <Route path="/RoleDashboard" element={
            <ProtectedRoute><RoleDashboard /></ProtectedRoute>
          } />

          {/* ==========================
              ADMIN
          ========================== */}
          <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/:id" element={<CourseDetail />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* ==========================
              PROFESOR
          ========================== */}
          <Route element={<ProtectedRoute role="profesor"><ProfessorLayout /></ProtectedRoute>}>
            <Route path="/profesor/courses" element={<ProfessorDashboard />} />
            <Route path="/profesor/courses/:id" element={<ProfessorCourseDetail />} />
          </Route>

          {/* ==========================
              ESTUDIANTE
          ========================== */}
          <Route element={<ProtectedRoute role="alumno"><StudentLayout /></ProtectedRoute>}>
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/course/:id" element={<StudentCourseDetail />} />
            <Route path="/student/enrollments" element={<MyEnrollments />} />
          </Route>

          {/* ==========================
              CURSOS PÚBLICOS
          ========================== */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CoursePage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
