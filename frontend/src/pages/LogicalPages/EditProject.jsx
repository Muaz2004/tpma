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


}; export default EditProject;