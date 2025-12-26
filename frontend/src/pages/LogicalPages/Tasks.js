import React from "react";
import { gql, useQuery } from "@apollo/client";
import { ClipboardList, Calendar, Users,Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { GET_TASKS } from "../../graphql/LogicalQueries";






const Tasks = () => {
  const { loading, error, data } = useQuery(GET_TASKS , { fetchPolicy: "network-only" });
  const { user } = useContext(AuthContext);
  const { id } = useParams();

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

  return (
    <div className="p-6">
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
        {data.allTasks.map((task) => {
          const statusColor =
            task.status === "Done"
              ? "bg-emerald-500"
              : task.status === "InProgress"
              ? "bg-amber-400"
              : "bg-gray-400"; // ToDo

          return (
             <Link to={`/tasks/${task.id}`} key={task.id} className="card-link">
            <div
              key={task.id}
              className="task-card border p-4 rounded-xl shadow-md bg-white hover:scale-105 transition-transform duration-300"
            >
              {/* Title */}
              <h2 className="font-semibold text-lg text-emerald-600 mb-1 truncate">
                {task.title}
              </h2>

              {/* Description */}
              <p className="text-emerald-600/80 text-sm mb-3 truncate">
                {task.description}
              </p>

              {/* Project */}
              <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                <ClipboardList className="w-4 h-4" />
                <span className="font-medium">Project:</span> {task.project.name}
              </p>

              {/* Assigned to */}
              <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                <Users className="w-4 h-4" />
                <span className="font-medium">Assigned to:</span>{" "}
                {task.assignedTo?.firstName || "Unassigned"}
              </p>

              {/* Due date */}
              <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-2 truncate">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Due:</span>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>

              {/* Status badge */}
              <p className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-white text-sm ${statusColor}`}
                >
                  {task.status}
                </span>
              </p>
            </div>   </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
