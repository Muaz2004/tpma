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
      console.log("USER ROLE:", data.login.user.role);

      if (data.login.user.role.toLowerCase() === "manager")
        navigate("/manager-dashboard");
      else navigate("/user-dashboard");

    } catch {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-10 tracking-wide">TPMA</h1>

      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        
        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
        <p className="text-center text-gray-500">Login to continue your journey</p>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
        </form>

        {/* Link */}
        <p className="text-center text-gray-600">
          Don’t have an account?
          <Link to="/register" className="text-blue-600 font-medium ml-1">
            Register here
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">
        © 2025 TPMA. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
