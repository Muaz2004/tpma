import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";
import {
  GET_PROJECTS,
  GET_USERS,
  CREATE_TASK,
} from "../../graphql/LogicalQueries";

const AddTask = () => {
  const { user } = useContext(AuthContext);

  // Queries
  const {
    loading: projectsLoading,
    error: projectsError,
    data: projectsData,
  } = useQuery(GET_PROJECTS, { fetchPolicy: "network-only" });

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS, { fetchPolicy: "network-only" });

  // Mutation
  const [createTask, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_TASK);

  // Form state
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    assignedTo: "",
    project: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        variables: {
          title: formState.title,
          description: formState.description,
          assignedTo: formState.assignedTo,
          project: formState.project,
          dueDate: formState.dueDate,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Loading & error guards
  if (projectsLoading || usersLoading) {
    return <p className="text-center mt-10">Loading…</p>;
  }

  if (projectsError || usersError) {
    return <p className="text-center text-red-500 mt-10">Error loading data</p>;
  }

  // Filters (SAFE)
  const filteredProjects =
    projectsData?.projects.filter(
      (project) => project.creator.id === user.id
    ) || [];

  const filteredUsers =
    usersData?.users.filter(
      (u) => u.role.toLowerCase() !== "manager"
    ) || [];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-green-50/60 backdrop-blur rounded-3xl px-6 py-8"
    >
      {/* Title */}
      <div>
        <label className="block text-sm text-green-800 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleChange}
          required
          className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-green-800 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formState.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm text-green-800 mb-1">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formState.dueDate}
          onChange={handleChange}
          required
          className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Project */}
      <div>
        <label className="block text-sm text-green-800 mb-1">Project</label>
        <select
          name="project"
          value={formState.project}
          onChange={handleChange}
          required
          className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select project</option>
          {filteredProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm text-green-800 mb-1">Assigned To</label>
        <select
          name="assignedTo"
          value={formState.assignedTo}
          onChange={handleChange}
          required
          className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select user</option>
          {filteredUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={mutationLoading}
          className="w-full py-3 rounded-xl bg-green-500 text-white text-sm hover:bg-green-600 transition active:scale-[0.98]"
        >
          {mutationLoading ? "Saving…" : "Create Task"}
        </button>
      </div>

      {mutationError && (
        <p className="text-sm text-red-500 text-center">
          Failed to create task
        </p>
      )}
    </form>
  );
};

export default AddTask;
