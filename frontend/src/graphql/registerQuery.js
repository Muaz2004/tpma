
import { gql } from "@apollo/client";
export const REGISTER_MUTATION = gql`
  mutation Register($firstName: String!, $email: String!, $password: String!) {
    register(firstName: $firstName, email: $email, password: $password) {
      token
      user {
        id
        firstName
        email
        role
      }
    }
  }
`;
