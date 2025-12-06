import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LOGIN_MUTATION } from "../graphql/loginQuery";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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
        variables: { username, password },
      });

      login(data.login.user, data.login.token);

      if (data.login.user.role.toLowerCase() === "manager")
        navigate("/manager-dashboard");
      else navigate("/user-dashboard");

    } catch {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full sm:w-[400px]">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block mb-1 text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
