import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { GET_TASK, UPDATE_TASK_STATUS } from "../../graphql/LogicalQueries";
import { RefreshCcw, ClipboardList, Calendar } from "lucide-react";

const UpdateTaskStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [updateTaskStatus, { error: mutationError, loading: mutationLoading }] =
    useMutation(UPDATE_TASK_STATUS);

  const [newStatus, setNewStatus] = useState("");
  const [success, setSuccess] = useState(false);

  const task = data?.task;

  useEffect(() => {
    if (task) setNewStatus(task.status);
  }, [task]);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading task…
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error loading task: {error.message}
      </p>
    );
  if (!task)
    return (
      <p className="text-center text-gray-400 mt-20">
        Task not found
      </p>
    );

  // Determine status color
  const statusColor =
    task.status === "Done"
      ? "bg-emerald-500"
      : task.status === "InProgress"
      ? "bg-amber-400"
      : "bg-gray-400";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTaskStatus({
        variables: { taskId: id, status: newStatus },
      });
      setSuccess(true);
      setTimeout(() => navigate(`/tasks/${id}`), 1500);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-emerald-600 mb-2">
          Update Task Status
        </h1>
        <p className="text-emerald-600/70 max-w-xl mx-auto">
          Change the status of this task quickly.
        </p>
      </div>

      {/* Single Card */}
      <div className="bg-green-50/60 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-100 space-y-6">
        
        {/* Task Info */}
        <div className="space-y-2">
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p>
            <strong>Current Status:</strong>{" "}
            <span className={`px-2 py-1 rounded-full text-white text-sm ${statusColor}`}>
              {task.status}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm text-emerald-600/70">
            <ClipboardList className="w-4 h-4" />
            <span>Project: {task.project?.name ?? "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600/70">
            <Calendar className="w-4 h-4" />
            <span>
              Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-emerald-700">
            New Status
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mt-1 block w-full border border-green-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="ToDo">ToDo</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>

          {/* Success & Error messages near button */}
          {success && (
            <div className="text-sm text-green-700 bg-green-100/60 rounded-xl px-4 py-2 text-center">
              Task status updated successfully. Redirecting…
            </div>
          )}

          {mutationError && (
            <div className="text-sm text-red-700 bg-red-100/60 rounded-xl px-4 py-2 text-center">
              {mutationError.message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={mutationLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            {mutationLoading ? "Updating…" : "Update Status"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskStatus;
