import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import "./App.css";
import AdminPortal from "./Pages/TeacherAdmin/AdminPortal";
import StudentPortal from "./Pages/Student/StudentPortal";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              Name={"Hello Student!!"}
              Description={
                "Enter your enrollment number to access your dashboard."
              }
              Form={"Student"}
            />
          }
        />
        <Route
          path="/teacherlogin"
          element={
            <Login
              Name={"Hello Teacher!!"}
              Description={"Please Enter Your Details"}
              Form={"Teacher"}
            />
          }
        />
        <Route
          path="/AdminPortal/*"
          element={
            <PrivateRoute>
              <AdminPortal />
            </PrivateRoute>
          }
        />
        <Route
          path="/StudentPortal/*"
          element={
            <PrivateRoute>
              <StudentPortal />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
