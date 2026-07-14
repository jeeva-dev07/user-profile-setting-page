import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      const user = res.data.user;
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      login(
        user,
        accessToken,
        refreshToken
      );

      alert("Login Successful 🎉");

      if (user.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err.response);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>

        <form onSubmit={handleLogin}>
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
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

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

  title: {
    marginBottom: "15px",
    color: "var(--text-primary)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
  },

  button: {
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