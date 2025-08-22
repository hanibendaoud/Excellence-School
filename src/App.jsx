import Home from "./pages/home"
import Register from "./pages/register";
import Login from "./pages/login";
import ResetPassword from "./pages/resetPassword";
import { Routes, Route } from "react-router-dom";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signUp" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Routes>
  )
}

export default App
