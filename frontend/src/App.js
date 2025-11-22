import { gql, useQuery } from '@apollo/client';

const GET_PROJECTS = gql`
  query GetProjects {
    allProjects {
      id
      name
      description
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_PROJECTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {data.allProjects.map(project => (
          <li key={project.id}>{project.name}: {project.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
