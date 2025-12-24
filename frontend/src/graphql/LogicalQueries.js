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
      creator {
        id
        firstName
      }
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



export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $assignedTo: ID!
    $project: ID!
    $dueDate: Date!
  ) {
    createTask(
      title: $title
      description: $description
      assignedTo: $assignedTo
      project: $project
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        dueDate
        assignedTo {
          id
          firstName
          email
        }
        project {
          id
          name
        }
      }
    }
  }
`;




export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
    }
  }
`;


export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      dueDate
      assignedTo {
        id
        firstName
        email
      }
      project {
        id
        name
        creator {
          id
        }
      }
    }
  }
`;



export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      task {
        id
        status
      }
    }
  }
`;



export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $title: String
    $description: String
    $dueDate: Date
    $status: String
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      description: $description
      dueDate: $dueDate
      status: $status
    ) {
      task {
        id
        title
        description
        dueDate
        status
      }
    }
  }
`;




export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      success
    }
  }
`;




export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $userId: ID!) {
    assignTask(taskId: $taskId, userId: $userId) {
      task {
        id
        assignedTo {
          id
          firstName
          email
        }
      }
    }
  }
`;
