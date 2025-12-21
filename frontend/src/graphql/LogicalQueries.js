import { gql } from "@apollo/client";


export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $projectId: ID!
    $name: String
    $description: String
    $startDate: Date!
    $endDate: Date!
    $status: String
  ) {
    updateProject(
      projectId: $projectId
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


export const GET_PROJECT = gql`
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

export const GET_PROJECTS = gql`
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


export const CREATE_PROJECT = gql`
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


export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId) {
      success
    }
  }
`