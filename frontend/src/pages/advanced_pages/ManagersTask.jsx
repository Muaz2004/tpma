
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-emerald-600 mb-6 text-center">
        Tasks for Your Projects
      </h1>

      {tasksForManagerProjects.length === 0 ? (
        <p className="text-center text-gray-400">
          No tasks found for your projects.
        </p>
      ) : (
        <ul className="space-y-4">
          {tasksForManagerProjects.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="block"
            >
              <li className="bg-emerald-50/70 rounded-xl p-4 shadow border border-emerald-100 hover:bg-emerald-100 transition cursor-pointer">
                <h2 className="text-lg font-medium text-emerald-700">
                  {task.title}
                </h2>

                <p className="text-emerald-600/80">
                  {task.description}
                </p>

                <p className="text-sm text-emerald-500 mt-2">
                  Project: {task.project?.name || "N/A"}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagersTask;
