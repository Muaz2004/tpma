import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Import GraphQL mutation
import { REGISTER_MUTATION } from "../graphql/registerQuery";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [firstName, setfirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // optional
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Optional: validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await registerMutation({
        variables: { firstName, email, password },
      });

      // Save user + token in AuthContext
      login(data.register.user, data.register.token);

      // Redirect based on role
      if (data.register.user.role === "MANAGER") navigate("/manager-dashboard");
      else navigate("/user-dashboard");
    } catch (err) {
      // Handle errors (email exists, network error, etc.)
      setError(err.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
