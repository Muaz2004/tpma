import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GET_TASK, DELETE_TASK } from "../../graphql/LogicalQueries";
import {
  ClipboardList,
  Calendar,
  Users,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [deleteTask, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_TASK);

  const [showConfirmation, setShowConfirmation] = useState(false);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading task…
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">{error.message}</p>
    );

  const task = data?.task;

  if (!task)
    return (
      <p className="text-center text-gray-400 mt-20">Task not found</p>
    );

  const assignedToId = task.assignedTo?.id ?? null;
  const projectCreatorId = task.project?.creator?.id ?? null;

  const canUpdateStatus = user.id === assignedToId || user.id === projectCreatorId;
  const canUpdateTask = user.id === projectCreatorId;
  const canAssignOrDelete = user.id === projectCreatorId;

  const statusStyle =
    task.status === "Done"
      ? "bg-emerald-500 text-white"
      : task.status === "InProgress"
      ? "bg-amber-400 text-white"
      : "bg-gray-400 text-white";

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask({ variables: { taskId: id } });

      // SweetAlert success popup
      Swal.fire("Deleted!", "Task has been deleted.", "success");

      // Navigate immediately after deletion
      navigate("/tasks");
    } catch (err) {
      console.error("Error deleting task:", err);
      Swal.fire("Error!", err.message, "error");
    }

    setShowConfirmation(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Page Intro */}
      <div className="mb-8 text-center animate-fade-slide">
        <h1 className="text-3xl font-semibold text-emerald-600 mb-2">
          Task Details
        </h1>
        <p className="text-emerald-600/70 max-w-xl mx-auto">
          View detailed information about this task, including assignment,
          status, and available actions.
        </p>
      </div>

      {/* Card wrapper */}
      <div className="bg-green-50/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-600">
              {task.title}
            </h2>
            <p className="text-emerald-600/70 mt-1 text-sm">
              Task overview & assignment
            </p>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${statusStyle}`}
          >
            {task.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-emerald-700/80 mb-6 leading-relaxed">
          {task.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-4 text-sm text-emerald-600/80 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {task.assignedTo ? (
              <>
                <span>{task.assignedTo.firstName}</span>
                <span className="text-emerald-600/50">
                  ({task.assignedTo.email})
                </span>
              </>
            ) : (
              <span className="text-emerald-600/50">Not assigned yet</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            <span>{task.project?.name ?? "Unknown project"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-emerald-200 pt-6">
          <div className="flex flex-wrap gap-3">
            {canUpdateStatus && (
              <Link to={`/tasks/${task.id}/update-status`}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 text-sm hover:bg-white transition">
                  <RefreshCcw className="w-4 h-4" />
                  Update Status
                </button>
              </Link>
            )}

            {canUpdateTask && (
              <Link to={`/tasks/${task.id}/edit`}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 text-sm hover:bg-white transition">
                  <Edit className="w-4 h-4" />
                  Edit Task
                </button>
              </Link>
            )}

            {canAssignOrDelete && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 text-sm hover:bg-white transition">
                  <UserPlus className="w-4 h-4" />
                  Assign Task
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Deleting..." : "Delete Task"}
                </button>
              </>
            )}
          </div>

          {deleteError && (
            <div className="text-sm text-red-700 bg-red-100/60 rounded-xl px-4 py-2 mt-4 text-center">
              {deleteError.message}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-green-50/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-100 max-w-sm w-full text-center space-y-4">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-emerald-700 text-lg font-medium">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
