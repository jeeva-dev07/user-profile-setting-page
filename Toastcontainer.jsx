function ToastContainer({ toasts = [] }) {
  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            backgroundColor:
              toast.type === "success"
                ? "#22c55e"
                : toast.type === "warning"
                ? "#f59e0b"
                : "#ef4444",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

// ================= STYLES =================
const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  toast: {
    color: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    minWidth: "220px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
    fontSize: "14px",
    animation: "fadeIn 0.3s ease-in-out",
  },
};