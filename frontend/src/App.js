import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
