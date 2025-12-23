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
    let normalizedStatus = data.task.status;
    if (data.task.status === "To Do") normalizedStatus = "ToDo";
    if (data.task.status === "In Progress") normalizedStatus = "InProgress";

    setFormState({
      title: data.task.title || "",
      description: data.task.description || "",
      dueDate,
      status: normalizedStatus || "",
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
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold mb-2">Edit Task</h1>
        <p className="text-gray-600">Modify the details of your task below.</p>
      </div>

      {/* Success Message */}
      {success && (
        <p className="text-green-600 mb-4">Task updated successfully!</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formState.dueDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Status</label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
             <option value="ToDo">ToDo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          disabled={mutationLoading}
        >
          {mutationLoading ? "Updating..." : "Update Task"}
        </button>

        {mutationError && (
          <p className="text-red-500 mt-4">{mutationError.message}</p>
        )}
      </form>
    </div>
  );
};

export default EditTask;
