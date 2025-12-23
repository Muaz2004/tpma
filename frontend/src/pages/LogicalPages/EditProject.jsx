import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";
import { GET_PROJECT, UPDATE_PROJECT } from "../../graphql/LogicalQueries";

const EditProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // project id from URL

  const { loading, error: queryError, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  const [updateProject, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_PROJECT);

  const allowedStatuses = [
    "Not Started",
    "In Progress",
    "Completed",
    "On Hold",
    "Cancelled",
  ];

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Not Started", // default to valid status
  });

  const [success, setSuccess] = useState(false);
 
  useEffect(() => {
    if (data?.project) {
      setFormState({
        name: data.project.name || "",
        description: data.project.description || "",
        startDate: data.project.startDate || "",
        endDate: data.project.endDate || "",
        status:
          allowedStatuses.includes(data.project.status)
            ? data.project.status
            : "Not Started", // fallback if backend has unexpected value
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
      await updateProject({
        variables: {
          projectId: id, // must match your backend argument
          ...formState,
        },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (queryError) return <p>Error loading project data.</p>;
  if (!user || user.role.toLowerCase() !== "manager")
    return <p>You can’t edit – you are not a manager.</p>;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold text-green-900 mb-2">
          Edit Project
        </h1>
        <p className="text-green-700 text-sm">
          Modify the details of your project below and save the changes.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-green-50/60 backdrop-blur rounded-3xl px-6 py-8"
      >
       

        <div>
          <label className="block text-sm text-green-800 mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm text-green-800 mb-1">Description</label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-green-800 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formState.startDate}
              onChange={handleChange}
              required
              className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-green-800 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formState.endDate}
              onChange={handleChange}
              required
              className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-green-800 mb-1">Status</label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            required
            className="w-full bg-white/70 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {allowedStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
     

              {/* Success message */}
{success && (
  <div className="text-sm text-green-700 bg-green-100/60 rounded-xl px-4 py-2 text-center">
    Project updated successfully. Redirecting…
  </div>
)}

{/* Error message */}
{mutationError && (
  <div className="text-sm text-red-700 bg-red-100/60 rounded-xl px-4 py-2 text-center">
    {mutationError.message}
  </div>
)}

        <div className="pt-2">
          <button
            type="submit"
            disabled={mutationLoading}
            className="w-full py-3 rounded-xl bg-green-500 text-white text-sm hover:bg-green-600 transition active:scale-[0.98]"
          >
            {mutationLoading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
