import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      name
      description
      startDate
      endDate
      status
      tasks {
        id
        title
      }
    }
  }
`;

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p className="text-gray-600 text-center mt-12">Loading projects...</p>;
  if (error) return <p className="text-red-500 text-center mt-12">Error: {error.message}</p>;
  if (data.allProjects.length === 0) return <p className="text-gray-500 text-center mt-12">No projects found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-emerald-600 mb-8">Projects</h1>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.allProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">{project.name}</h2>
            <p className="text-gray-700 mb-4">{project.description}</p>

            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Status:</span> {project.status}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              <span className="font-medium">Tasks:</span>{" "}
              {project.tasks.length > 0
                ? project.tasks.map((task) => task.title).join(", ")
                : "No tasks yet"}
            </p>

            <div className="mt-auto flex justify-between items-center text-sm text-gray-400">
              <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
              <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
