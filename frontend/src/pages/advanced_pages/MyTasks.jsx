import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GET_TASKS_BY_USER } from "../../graphql/LogicalQueries";
import { ClipboardList } from "lucide-react";

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_TASKS_BY_USER, {
    variables: { userId: user.id },
  });

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading your tasks...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  if (!data.tasksByUser || data.tasksByUser.length === 0)
    return (
      <p className="text-center text-gray-500 mt-20">
        You have no tasks assigned.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-500 mb-2 animate-fade-in">
          My Tasks
        </h1>
        <p className="text-emerald-600/80 mb-4">
          View your tasks, check status, and track deadlines.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.tasksByUser.map((task) => {
          const statusStyle =
            task.status === "Done"
              ? "bg-emerald-500 text-white"
              : task.status === "InProgress"
              ? "bg-amber-400 text-white"
              : "bg-gray-400 text-white";

          return (
            <Link to={`/tasks/${task.id}`} key={task.id} className="card-link">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    {task.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-emerald-600/80 mb-4 leading-relaxed">
                  {task.description}
                </p>
                <div className="flex flex-col gap-1 text-sm text-emerald-500">
                  <span>Project: {task.project?.name ?? "Unknown"}</span>
                  <span>
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyTasks;
