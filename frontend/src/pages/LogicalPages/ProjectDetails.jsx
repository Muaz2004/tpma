import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Folder, ClipboardList, Calendar } from "lucide-react";

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

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading project...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  const project = data?.project;

  if (!project)
    return (
      <p className="text-center text-gray-400 mt-20">
        Project not found
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 rounded-lg shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          {project.name}
        </h2>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
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
      <p className="text-emerald-600/80 mb-4">
        {project.description}
      </p>

      {/* Dates */}
      <div className="flex items-center gap-4 text-sm text-emerald-600/70 mb-6">
        <Calendar className="w-4 h-4" />
        <span>
          {project.startDate} → {project.endDate}
        </span>
      </div>

      {/* Tasks */}
      <div className="border-t border-emerald-900/50 pt-4">
        <div className="flex items-center gap-2 mb-3 text-emerald-400">
          <ClipboardList className="w-4 h-4" />
          <h3 className="font-medium">
            Tasks ({project.tasks.length})
          </h3>
        </div>

        {project.tasks.length === 0 ? (
          <p className="text-sm text-gray-400">
            No tasks for this project
          </p>
        ) : (
          <ul className="space-y-2">
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded"
              >
                <span className="text-sm text-white">
                  {task.title}
                </span>
                <span className="text-xs text-gray-300">
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
