import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { GET_TASK, UPDATE_TASK } from "../../graphql/LogicalQueries";
import { AuthContext } from "../../context/AuthContext";

const EditTask = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const [updateTask, { error: mutationError, loading: mutationLoading }] =
    useMutation(UPDATE_TASK);

  const [success, setSuccess] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });

  // Prefill form with current task data
  useEffect(() => {
  if (data?.task) {
    const dueDate = data.task.dueDate?.split("T")[0] || "";

    const statusMap = {
      DONE: "Done",
      INPROGRESS: "InProgress",
      TODO: "ToDo",
    };

    setFormState({
      title: data.task.title || "",
      description: data.task.description || "",
      dueDate,
      status: statusMap[data.task.status] || "",
    });
  }
}, [data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask({
        variables: { taskId: id, ...formState },
      });
      setSuccess(true);
      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

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

  const task = data.task;

  // Permission check: only project creator can edit
  if (task && user.id !== task.project.creator.id) {
    return (
      <p className="text-center text-red-500 mt-20">
        You are not authorized to edit this task.
      </p>
    );
  }

  return (
  <div className="max-w-3xl mx-auto px-6 py-10">
    {/* Page Intro */}
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-semibold text-emerald-600 mb-2">
        Edit Task
      </h1>
      <p className="text-emerald-600/70">
        Update task details and keep everything up to date.
      </p>
    </div>

    {/* Card */}
    <div className="bg-green-50/60 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-100">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formState.dueDate}
            onChange={handleChange}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="ToDo">ToDo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Success Message (VISIBLE near button) */}
        {success && (
          <div className="text-sm text-green-700 bg-green-100/60 rounded-xl px-4 py-2 text-center">
            Task updated successfully. Redirecting…
          </div>
        )}

        {/* Error Message (VISIBLE near button) */}
        {mutationError && (
          <div className="text-sm text-red-700 bg-red-100/60 rounded-xl px-4 py-2 text-center">
            {mutationError.message}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition" disabled={mutationLoading} > {mutationLoading ? "Updating..." : "Update Task"} </button>
      </form>
    </div>
  </div>
);


};

export default EditTask;
