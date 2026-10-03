import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./navbar";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import TeacherDashboard from "./teacherDashboard";
import AdminDashboard from "./adminstrationDashbord";
import StudentDashboard from "./studentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;