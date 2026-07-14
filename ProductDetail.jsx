import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext";

const BASE_URL = "http://localhost:5000";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError("");

    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError("Product not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2 style={styles.center}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={styles.center}>{error}</h2>;
  }

  if (!product) {
    return <h2 style={styles.center}>No Product</h2>;
  }

  // ================= IMAGE FIX =================
  const getImageSrc = () => {
    if (!product.image_url) {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }

    if (product.image_url.startsWith("http")) {
      return product.image_url;
    }

    return `${BASE_URL}${product.image_url}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* IMAGE */}
        <img
          src={getImageSrc()}
          alt={product.name}
          style={styles.img}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />

        {/* CONTENT */}
        <div style={styles.content}>
          <h1>{product.name}</h1>

          <p style={styles.desc}>{product.description}</p>

          <h2 style={styles.price}>
            ₹{Number(product.price).toLocaleString()}
          </h2>

          <p>📦 Stock: {product.stock}</p>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            style={{
              ...styles.btn,
              background:
                product.stock === 0 ? "#aaa" : "#3498db",
              cursor:
                product.stock === 0 ? "not-allowed" : "pointer",
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

// ================= STYLES =================
const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s",
  },

  card: {
    display: "flex",
    gap: "20px",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "var(--shadow)",
    maxWidth: "700px",
    transition: "0.3s",
  },

  img: {
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  content: {
    flex: 1,
    color: "var(--text-primary)",
  },

  desc: {
    color: "var(--text-secondary)",
    margin: "10px 0",
  },

  price: {
    color: "#22c55e",
  },

  btn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    color: "var(--btn-text)",
    marginTop: "10px",
    cursor: "pointer",
  },

  center: {
    textAlign: "center",
    marginTop: "50px",
    color: "var(--text-primary)",
  },
};