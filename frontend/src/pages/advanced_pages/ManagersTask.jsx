import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_TASKS } from "../../graphql/LogicalQueries";
import { AuthContext } from "../../context/AuthContext";

const ManagersTask = () => {
  const { user } = React.useContext(AuthContext);
  const managerId = user.id; // logged-in manager

  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading tasks…
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        {error.message}
      </p>
    );

  const allTasks = data?.allTasks || [];

  const tasksForManagerProjects = allTasks.filter(
    (task) => task.project?.creator?.id === managerId
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-500 mb-2 animate-fade-in">
          Tasks for Your Projects
        </h1>
        <p className="text-emerald-600/80">
          Overview of all tasks under your projects.
        </p>
      </div>

      {tasksForManagerProjects.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No tasks found for your projects.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tasksForManagerProjects.map((task) => {
            const statusStyle =
              task.status === "Done"
                ? "bg-emerald-500 text-white"
                : task.status === "InProgress"
                ? "bg-yellow-500 text-white"
                : "bg-gray-400 text-white";

            return (
              <Link key={task.id} to={`/tasks/${task.id}`} className="card-link">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-green-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-emerald-400">
                      {task.title}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-emerald-600/80 mb-4">{task.description}</p>

                  {/* Project Info */}
                  <p className="text-sm text-emerald-500">
                    Project: {task.project?.name || "N/A"}
                  </p>

                  {/* Due Date */}
                  <p className="text-sm text-emerald-500 mt-1">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagersTask;
