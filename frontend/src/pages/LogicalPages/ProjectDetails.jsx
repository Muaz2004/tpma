import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Folder, ClipboardList } from 'lucide-react'; // Ensure icons are imported

// 1. Move query outside the component to prevent re-parsing on every render
const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      startDate
      endDate
      status
      tasks {
        id
        title
        status
      }
    }
  }
`;

const ProjectDetails = () => {
  const { id } = useParams();

  // 2. Pass variables as the second argument to useQuery
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading projects...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">Error: {error.message}</p>
    );

  // 3. Extract the project from data
  const project = data?.project;

  if (!project)
    return (
      <p className="text-center text-gray-400 mt-20">Project not found</p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          {project.name}
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            project.status === "Completed"
              ? "bg-green-600 text-white"
              : project.status === "In Progress"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-emerald-600/80 mb-4">{project.description}</p>

      {/* Tasks */}
      <div className="flex items-center gap-3 text-emerald-600/70 border-t border-emerald-900/50 pt-4">
        <ClipboardList className="w-4 h-4" />
        <span className="text-sm">
          {project.tasks.length} Task
          {project.tasks.length !== 1 && "s"}
        </span>
      </div>
    </div>
  );
};

export default ProjectDetails;
