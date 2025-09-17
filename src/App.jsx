import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import ResetPassword from "./pages/resetPassword";
import { Routes, Route, Navigate } from "react-router-dom";


import StudentDashboard from "./pages/studentDashboard";
import StudentHome from "./pages/studentHome";
import StudentTimetable from "./pages/studentTimeTable";
import StudentLessons from "./pages/studentLessons";
import StudentWaiting from "./pages/StudentWaiting";
import StudentDiscussion from "./pages/studentDiscussion"
import AdminDashboard from "./components/adminDashboard";
import AdminRequests from "./pages/adminRequests";
import AdminStudents from "./pages/AdminStudents";
import AdminTeachers from "./pages/AdminTeachers";
import AdminPublications from "./pages/AdminPublications";
import AdminTeacherAccount from "./pages/AdminTeacherAccount";
import AdminSettings from "./pages/AdminSettings";

import TeacherDashboard from "./components/teacherDashboard";
import TeacherAddCourse from "./pages/teacherAddCourse";
import TeacherStudents from "./pages/teacherStudents";
import TeacherCourses from "./pages/teacherCourses";
import TeacherDiscussion from "./pages/TeacherDiscussion";
import TeacherLogin from "./pages/TeacherLogin";
import ResetPasswordTeacher from "./pages/resetTeacherPassword";

import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/unauthorized";
import LastPage from "./pages/lastPage"
import useAuth from "./hooks/useAuth";

// Admin Route Wrapper Component
const AdminRouteWrapper = ({ children }) => {
  const { auth } = useAuth();
  
  console.log("Admin Route Check:", {
    hasToken: !!auth?.accessToken,
    email: auth?.email,
    role: auth?.role
  });

  // Check if user is authenticated and has admin role
  if (!auth?.accessToken || !auth?.email) {
    console.log("Admin route: Not authenticated, redirecting to teacher login");
    return <Navigate to="/teacherLogin" replace />;
  }

  if (auth?.role !== 'admin') {
    console.log("Admin route: Not admin role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Admin route: Access granted");
  return children;
};

function App() {
  return (
    <Routes>
      {/* Home Route with Smart Redirect */}
      <Route path="/" element={<Home />} />
      
      {/* Public Routes */}
      <Route path="/signUp" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/teacherLogin" element={<TeacherLogin />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/resetPasswordTeacher" element={<ResetPasswordTeacher />} />
      <Route path="/i" element={<LastPage />} />

      {/* Student waiting route - students who haven't been accepted yet */}
      <Route element={<RequireAuth allowedRoles={['student']} />}>
        <Route path="/student/waiting" element={<StudentWaiting />} />
      </Route>

      {/* Student Dashboard - requires acceptance */}
      <Route element={<RequireAuth allowedRoles={['student']} requireAcceptance={true} />}>
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<StudentHome />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="lessons" element={<StudentLessons />} />
          <Route path="discussion" element={<StudentDiscussion />} />
        </Route>
      </Route>

      {/* Admin Dashboard - Using Direct Auth Check */}
      <Route path="/admin" element={
        <AdminRouteWrapper>
          <AdminDashboard />
        </AdminRouteWrapper>
      }>
        <Route index element={<Navigate to="requests" />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="publications" element={<AdminPublications />} />
        <Route path="teacher-account" element={<AdminTeacherAccount />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Teacher Dashboard - Protected Routes */}
      <Route element={<RequireAuth allowedRoles={['teacher']} />}> 
        <Route path="/teacher" element={<TeacherDashboard />}>
          <Route index element={<Navigate to="/teacher/add-course" replace />} />
          <Route path="add-course" element={<TeacherAddCourse />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="discussion" element={<TeacherDiscussion />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;