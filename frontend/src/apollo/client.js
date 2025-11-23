import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// HTTP link to backend GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL, // http://backend:8000/graphql/ inside Docker
});

// Auth link to attach JWT token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : null;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
