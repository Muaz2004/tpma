import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String!
    $startDate: Date!
    $endDate: Date!
    $status: String
  ) {
    createProject(
      name: $name
      description: $description
      startDate: $startDate
      endDate: $endDate
      status: $status
    ) {
      project {
        id
      }
    }
  }
`;

const AddProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
  refetchQueries: ["GetProjects"],
});

  // 🔒 Manager only
  if (!user || user.role.toLowerCase() !== "manager") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProject({
      variables: {
        name,
        description,
        startDate,
        endDate,
        status: status || "Not Started",
      },
    });

    setSuccess(true);

    setTimeout(() => {
      navigate("/projects");
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto px-4">

      {/* Page intro */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-green-900">
          Create a new project
        </h1>
        <p className="text-green-700 text-sm mt-1">
          Define your project details and start tracking work effortlessly.
        </p>
      </div>

      {/* Form surface */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-green-50/60 backdrop-blur rounded-3xl px-6 py-8"
      >

        {/* Success message */}
        {success && (
          <div className="text-sm text-green-700 bg-green-100/60 rounded-xl px-4 py-2">
            Project created successfully. Redirecting…
          </div>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-sm text-green-800 mb-1">
            Project name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-green-800 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-green-800 mb-1">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-green-800 mb-1">
              End date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm text-green-800 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Not Started</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-500 text-white text-sm
                       hover:bg-green-600 transition active:scale-[0.98]"
          >
            {loading ? "Creating…" : "Create project"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error.message}
          </p>
        )}

      </form>
    </div>
  );
};

export default AddProject;
