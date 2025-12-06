import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import Layout from "./components/Layout"; 
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manager-dashboard" element={ <Layout> <ManagerDashboard /> </Layout>} />
          <Route path="/user-dashboard" element={<Layout> <UserDashboard /> </Layout>} />
        </Routes>
    
    </Router>
  );
}

export default App;
