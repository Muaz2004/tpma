import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Import GraphQL mutation
import { LOGIN_MUTATION } from "../graphql/loginQuery";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      // Save user + token
      login(data.login.user, data.login.token);

      // Redirect based on role
      if (data.login.user.role === "MANAGER") navigate("/manager-dashboard");
      else navigate("/user-dashboard");
    } catch {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
