import React, { useState } from "react"; 
import { useQuery } from "@apollo/client";
import { ClipboardList, Calendar, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { GET_TASKS } from "../../graphql/LogicalQueries";

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only",
  });
  const { user } = useContext(AuthContext);
  const { id } = useParams();


  const [searchTerm, setSearchTerm] = useState("");

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading tasks...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  if (data.allTasks.length === 0)
    return (
      <p className="text-center text-gray-500 mt-20">
        No tasks found.
      </p>
    );

  const filteredTasks = data.allTasks.filter((task) =>
  task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  task.description?.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="p-6">

      
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />

      {/* Intro message */}
      <p className="text-center text-emerald-600 font-medium mb-8 text-lg md:text-xl">
        Here are all your tasks — track progress and stay on top of your work.
      </p>

      {user?.role.toLowerCase() === "manager" && (
        <Link to="/tasks/add">
          <button
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-4 rounded-full shadow-lg hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center gap-2"
            title="Create Project"
          >
            <Plus size={24} />
            Add Task
          </button>
        </Link>
      )}

      
      <div className="tasks-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => {
          const statusColor =
            task.status === "Done"
              ? "bg-emerald-500"
              : task.status === "InProgress"
              ? "bg-amber-400"
              : "bg-gray-400";

          return (
            <Link to={`/tasks/${task.id}`} key={task.id} className="card-link">
              <div className="task-card border p-4 rounded-xl shadow-md bg-white hover:scale-105 transition-transform duration-300">

                <h2 className="font-semibold text-lg text-emerald-600 mb-1 truncate">
                  {task.title}
                </h2>

                <p className="text-emerald-600/80 text-sm mb-3 truncate">
                  {task.description}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                  <ClipboardList className="w-4 h-4" />
                  <span className="font-medium">Project:</span> {task.project.name}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Assigned to:</span>{" "}
                  {task.assignedTo?.firstName || "Unassigned"}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-2 truncate">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>

                <p className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${statusColor}`}
                  >
                    {task.status}
                  </span>
                </p>

              </div>
            </Link>
          );
        })}
      </div>

      {filteredTasks.length === 0 && searchTerm && (
        <p className="text-center text-gray-400 mt-6">
          No tasks match your search.
        </p>
      )}

    </div>
  );
};

export default Tasks;
