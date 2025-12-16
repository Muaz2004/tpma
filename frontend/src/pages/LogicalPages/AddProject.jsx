import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";

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
        name
        description
        startDate
        endDate
        status
      }
    }
  }
`;

const AddProject = () => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

  // 🔒 Manager-only access (matches backend logic)
  

  if (!user || user.role.toLowerCase() !== "manager") {
    return null;
  }

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

    // optional reset
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setStatus("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5BC0BE] text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default AddProject;
