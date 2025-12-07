import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { REGISTER_MUTATION } from "../graphql/registerQuery";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setfirstName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await registerMutation({
        variables: { firstName, email, password },
      });

      login(data.register.user, data.register.token);

      if (data.register.user.role === "MANAGER")
        navigate("/manager-dashboard");
      else navigate("/user-dashboard");

    } catch (err) {
      setError(err.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-10 tracking-wide">TPMA</h1>

      {/* Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
        <p className="text-center text-gray-500">Start managing tasks smarter</p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={firstName}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setfirstName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
        </form>

        {/* Link */}
        <p className="text-center text-gray-600">
          Already have an account?
          <Link to="/login" className="text-blue-600 font-medium ml-1">
            Login
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

export default Register;
