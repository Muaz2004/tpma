import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Backend GraphQL URL from environment variable
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL, // http://backend:8000/graphql/ inside Docker
});

// Add JWT token to requests if logged in
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // store JWT in localStorage
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
