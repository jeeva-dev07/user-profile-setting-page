import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const BASE_URL = "http://127.0.0.1:5000";

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const totalItems =
    cartItems?.reduce(
      (sum, item) => sum + Number(item.quantity || item.qty || 1),
      0
    ) || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getAvatarUrl = () => {
    if (!user?.avatar_url) return null;

    return user.avatar_url.startsWith("http")
      ? user.avatar_url
      : `${BASE_URL}${user.avatar_url}`;
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🛒 ShopMart
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {user && (
          <>
            <Link to="/orders" style={styles.link}>
              Orders
            </Link>

            <Link to="/profile" style={styles.link}>
              My Profile
            </Link>

            <Link to="/cart" style={styles.cart}>
              Cart 🛒
              {totalItems > 0 && (
                <span style={styles.badge}>
                  {totalItems}
                </span>
              )}
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/products" style={styles.link}>
              Admin Products
            </Link>

            <Link to="/admin/orders" style={styles.link}>
              Admin Orders
            </Link>
          </>
        )}

        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {!user ? (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        ) : (
          <div style={styles.userBox}>
            <Link
              to="/profile"
              style={styles.profileLink}
            >
              {user.avatar_url ? (
                <img
                  src={getAvatarUrl()}
                  alt="Avatar"
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.initials}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <span style={styles.user}>
                {user.name}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "var(--navbar-bg)",
    borderBottom: "1px solid var(--border-color)",
  },

  logo: {
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  link: {
    textDecoration: "none",
    color: "var(--text-primary)",
    fontSize: "14px",
  },

  cart: {
    textDecoration: "none",
    position: "relative",
    color: "var(--text-primary)",
  },

  badge: {
    background: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: "12px",
    marginLeft: "5px",
  },

  themeBtn: {
    background: "var(--btn-primary)",
    color: "var(--btn-text)",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: "var(--text-primary)",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  initials: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "15px",
  },

  user: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "var(--text-primary)",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};