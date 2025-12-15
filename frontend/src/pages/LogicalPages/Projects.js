import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Folder, ClipboardList, CheckCircle } from "lucide-react";

const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      name
      description
      startDate
      endDate
      status
      progress
      tasks {
        id
        title
      }
    }
  }
`;

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading projects...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 mt-20">Error: {error.message}</p>;
  if (data.allProjects.length === 0)
    return <p className="text-center text-gray-400 mt-20">No projects found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-500 mb-2 animate-fade-in">
          Manage Your Projects Efficiently
        </h1>
        <p className="text-gray-300">
          Track progress, view tasks, and stay on top of your team’s workflow.
        </p>
      </div>

      {/* Project Cards Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.allProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            {/* Project Header */}
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
            <p className="text-gray-300 mb-4">{project.description}</p>

            {/* Tasks */}
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-4 h-4 text-gray-200" />
              <span className="text-gray-300 text-sm">
                {project.tasks.length} Task{project.tasks.length !== 1 && "s"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-300 mt-1 block">
                Progress: {project.progress || 0}%
              </span>
            </div>

            {/* Optional completion icon */}
            {project.progress === 100 && (
              <div className="mt-4 flex items-center text-green-400 gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Project Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
