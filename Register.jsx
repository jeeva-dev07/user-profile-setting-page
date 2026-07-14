import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      alert("Registered Successfully 🎉");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Register Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>📝 Register</h1>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            required
          />

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.6 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "Arial",
    transition: "0.3s",
  },

  card: {
    width: "340px",
    padding: "25px",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow)",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    outline: "none",
    boxSizing: "border-box",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "var(--btn-primary)",
    color: "var(--btn-text)",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
  },

  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginBottom: "8px",
  },
};