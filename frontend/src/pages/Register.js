import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { REGISTER_MUTATION } from "../graphql/registerQuery";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setfirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>

      {/* SUBTITLE */}
      <p className="text-gray-600 mb-10 text-center">
        Start your journey with smart project management.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-6 flex flex-col"
      >
        <div>
          <label className="text-gray-700 mb-1 block">Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="text-gray-700 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div>
          <label className="text-gray-700 mb-1 block">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>

      {/* LINK */}
      <p className="mt-6 text-gray-700">
        Already have an account?
        <Link to="/login" className="text-emerald-600 font-medium ml-1 hover:text-emerald-700">
          Login
        </Link>
      </p>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 mt-12">
        © 2025 TPMA. All rights reserved.
      </p>
    </div>
  );
};

export default Register;
