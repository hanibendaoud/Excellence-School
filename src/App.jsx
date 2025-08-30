import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import ResetPassword from "./pages/resetPassword";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./pages/studentDashboard";
import StudentHome from "./pages/studentHome";
import StudentTimetable from "./pages/studentTimeTable";
import StudentLessons from "./pages/studentLessons";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/unauthorized";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signUp" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<RequireAuth allowedRoles={['student']}/>}>
        <Route path="/student" element={<StudentDashboard />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<StudentHome />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="lessons" element={<StudentLessons />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
