import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import Layout from "./components/Layout"; 
import Logout from "./pages/Logout";
import Profile from "./pages/LogicalPages/Profile";
import Projects from "./pages/LogicalPages/Projects";
import Tasks from "./pages/LogicalPages/Tasks";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manager-dashboard" element={ <Layout> <ManagerDashboard /> </Layout>} />
          <Route path="/user-dashboard" element={<Layout> <UserDashboard /> </Layout>} />
          <Route path="/projects" element={ <Layout> <Projects /> </Layout>} />
          <Route path="/tasks" element={ <Layout><Tasks /> </Layout>} />
          <Route path="/profile" element={ <Layout> <Profile /> </Layout>} />
        </Routes>
    
    </Router>
  );
}

export default App;
