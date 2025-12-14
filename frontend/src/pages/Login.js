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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 flex flex-col items-center px-6 py-12">

      {/* HEADER */}
      <header className="w-full py-6 px-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide text-emerald-600">
          TPMA
        </h1>

        <div className="flex items-center gap-4 opacity-80">
          <span className="text-sm">Modern • Simple • Secure</span>
        </div>
      </header>

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>

      {/* SUBTITLE */}
      <p className="text-gray-600 mb-10 text-center">
        Login to continue managing your work.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 flex flex-col"
      >
        <div>
          <label className="text-gray-700 mb-1 block">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="text-gray-700 mb-1 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>

      {/* LINK */}
      <p className="mt-6 text-gray-700">
        Don’t have an account?
        <Link to="/register" className="text-emerald-600 font-medium ml-1 hover:text-emerald-700">
          Register here
        </Link>
      </p>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 mt-12">
        © 2025 TPMA. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
