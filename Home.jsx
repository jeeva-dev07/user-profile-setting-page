import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/Pagination";

const BASE_URL = "http://127.0.0.1:5000";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  const { addToCart } = useCart();

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // fetch products
  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, category, sort]);

  const fetchProducts = async () => {
    try {
      const res = await API.get(
        `/products?page=${currentPage}&limit=8&search=${debouncedSearch}`
      );

      const data = res.data;

      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.log("Products API Error:", err);
      setProducts([]);
    }
  };

  // frontend filter + sort (safe now)
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === category
    );
  }

  if (sort === "low") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 ShopMart</h1>

      {/* FILTERS */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Sports">Sports</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.select}
        >
          <option value="">Sort By Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        Showing {filteredProducts.length} of {total} products
      </p>

      {/* PRODUCTS GRID */}
      <div style={styles.grid}>
        {filteredProducts.map((p) => {
          const imageUrl = p.image_url
            ? p.image_url.startsWith("http")
              ? p.image_url
              : `${BASE_URL}${p.image_url}`
            : "";

          return (
            <div key={p.id} style={styles.card}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={p.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}

              <div style={styles.content}>
                <h3>{p.name}</h3>
                <p>{p.description}</p>

                <p>
                  <strong>Category:</strong> {p.category}
                </p>

                <p style={styles.price}>₹{p.price}</p>

                <p>
                  <strong>Stock:</strong> {p.stock}
                </p>

                <button
                  style={styles.btn}
                  onClick={() => addToCart(p, 1)}
                >
                  Add To Cart
                </button>

                <Link to={`/products/${p.id}`} style={styles.link}>
                  View Product
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Home;

const styles = {
  page: {
    padding: "20px",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    minHeight: "100vh",
    transition: "0.3s",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "var(--text-primary)",
  },

  filters: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  input: {
    padding: "10px",
    width: "220px",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
  },

  select: {
    padding: "10px",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    background: "var(--card-bg)",
    color: "var(--text-primary)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },

  noImage: {
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    fontWeight: "bold",
  },

  content: {
    padding: "15px",
    color: "var(--text-primary)",
  },

  price: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "18px",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "var(--btn-primary)",
    color: "var(--btn-text)",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },

  link: {
    display: "block",
    marginTop: "10px",
    textAlign: "center",
    textDecoration: "none",
    color: "var(--btn-primary)",
    fontWeight: "bold",
  },
};