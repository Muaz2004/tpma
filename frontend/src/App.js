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
import AddProject from "./pages/LogicalPages/AddProject";
import ProjectDetails from "./pages/LogicalPages/ProjectDetails";
import ProtectedRoute from "./context/ProtectedRoute";
import EditProject from "./pages/LogicalPages/EditProject";
import AddTask from "./pages/LogicalPages/AddTask";
import TaskDetails from "./pages/LogicalPages/TaskDetails";
import UpdateTaskStatus from "./pages/LogicalPages/UpdateTaskStatus";
import EditTask from "./pages/LogicalPages/EditTask";
import AssignTask from "./pages/LogicalPages/AssignTask";
import MyTasks from "./pages/advanced_pages/MyTasks";
import MyProjects from "./pages/advanced_pages/MyProjects";
import ManagersTask from "./pages/advanced_pages/ManagersTask";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <ManagerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <Tasks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
   
         <Route
          path="/projects/add"
          element={
            <ProtectedRoute  role="manager">
              <Layout>
                <AddProject />
              </Layout>
            </ProtectedRoute>
          }
        />


          <Route
          path="/projects/:id/edit"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <EditProject />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
           path="/tasks/add"
           element={
          <ProtectedRoute role="manager">
          <Layout>
           <AddTask />
         </Layout>          
         </ProtectedRoute>
       }
       />
        <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

        <Route
          path="/tasks/:id/update-status"
          element={
            <ProtectedRoute>
              <Layout>
                <UpdateTaskStatus />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <EditTask />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id/assign"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <AssignTask />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <MyTasks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-projects"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <MyProjects />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managed-tasks"
          element={
            <ProtectedRoute role="manager">
              <Layout>
                <ManagersTask />
              </Layout>
            </ProtectedRoute>
          }
        />
        


      </Routes>



    </Router>
  );
}

export default App;
