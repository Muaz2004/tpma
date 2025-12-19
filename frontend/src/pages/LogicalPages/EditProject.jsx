import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";
import { Folder } from "lucide-react";


const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      startDate
      endDate
      status
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String!
    $description: String!
    $startDate: Date!
    $endDate: Date!
    $status: String!
  ) {
    updateProject(
      id: $id
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


const EditProject=()=>{
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { loading, error, data } = useQuery(GET_PROJECT, {variables: { id }});
  const [updateProject] = useMutation(UPDATE_PROJECT);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: ""
  });
  useEffect(() => {
    if (data && data.project) {
      setFormState({
        name: data.project.name,
        description: data.project.description,
        startDate: data.project.startDate,
        endDate: data.project.endDate,
        status: data.project.status
      });
    } }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject({ variables: { id, ...formState } 
      });
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error("Error updating project:", err);
    } };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading project data.</p>;
  if (user.role.toLowwerCase() === "manager") {
    return <p>You cant edit u are not manager.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 text-center animate-fade-slide">
        <h1 className="text-3xl font-semibold text-emerald-600 mb-2">
          Edit Project
        </h1>
        <p className="text-emerald-600/70 max-w-xl mx-auto">
          Modify the details of your project below and save the changes.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-emerald-700 font-medium mb-2">

            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-emerald-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formState.description}
            onChange={handleChange}
            className="w-full border border-emerald-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required

          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-emerald-700 font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formState.startDate}
              onChange={handleChange}
              className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-emerald-700 font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formState.endDate}
              onChange={handleChange}
              className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-emerald-700 font-medium mb-2">
            Status
          </label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all shadow hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

          

  


}; export default EditProject;