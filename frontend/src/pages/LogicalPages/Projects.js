
import React, { useContext } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      name
      description
      start_date
      end_date
      creator
      tasks{
        id
        name
      }
    }
  }
`;

 



const Projects = () => {


const { loading, error, data } = useQuery(GET_PROJECTS);
if (loading) return <p>Loading projects...</p>;
if (error) return <p>Error: {error.message}</p>;
if (data.allProjects.length === 0) return <p>No projects found</p>;


  return (
  <div className="projects-grid">
    {data.allProjects.map(project => (
      <div key={project.id} className="project-card">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <p>
          Tasks: {project.tasks.map(task => task.name).join(", ")}
        </p>
      </div>
    ))}
  </div>
);


};

export default Projects;
