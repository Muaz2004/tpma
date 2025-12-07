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
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // optional
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
            if (data.register.user.role.toUpperCase() === "MANAGER")
                navigate("/manager-dashboard");
            else navigate("/user-dashboard");
        } catch (err) {
            // Handle errors (email exists, network error, etc.)
            setError(err.message || "Registration failed");
        }
        setLoading(false);
    };

    const styles = {
        page: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem',
            // PAGE BACKGROUND: single color or soft gradient.
            background: 'linear-gradient(135deg, #f0f9ff 0%, #c9e8ff 100%)',
            fontFamily: 'sans-serif',
        },
        header: {
            // HEADER: optional, just app name or logo at top center.
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '4rem', // Generous vertical spacing
        },
        container: {
            // CENTER: form block in the middle
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
        },
        title: {
            // Title
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: '#0056b3',
        },
        subtitle: {
            // Subtitle
            fontSize: '1rem',
            color: '#666',
            marginBottom: '2rem', // Generous vertical spacing
        },
        formGroup: {
            marginBottom: '1.5rem',
            textAlign: 'left',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#333',
        },
        input: {
            // LOGIN/REGISTER FORM: clean, full-width inputs, rounded edges
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
        },
        button: {
            // Modern button
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#28a745', // Use a slightly different color for Register
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '1.5rem', // Generous vertical spacing
        },
        buttonDisabled: {
            backgroundColor: '#9be1a7',
            cursor: 'not-allowed',
        },
        error: {
            color: 'red',
            marginTop: '1rem',
        },
        footer: {
            // FOOTER: centered small text.
            marginTop: '4rem', // Generous vertical spacing
            fontSize: '0.85rem',
            color: '#999',
        }
    };

    return (
        <div style={styles.page}>
             <div style={styles.header}>
                My App Logo/Name
            </div>
            <div style={styles.container}>
                <h2 style={styles.title}>Create Your Account</h2>
                <p style={styles.subtitle}>Join us today and start managing your tasks.</p>

                <form onSubmit={handleRegister}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Name:</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={firstName}
                            onChange={(e) => setfirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            style={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password:</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
                 {/* Optional Links (e.g., Login link) */}
                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    <a href="/login" style={{ color: '#28a745', textDecoration: 'none' }}>
                        Already have an account? Login
                    </a>
                </p>
            </div>
            <div style={styles.footer}>
                © 2025 MyApp. All rights reserved.
            </div>
        </div>
    );
};

export default Register;