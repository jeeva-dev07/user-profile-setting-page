import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE_URL = "http://127.0.0.1:5000";


function ProductsCard({ product }) {

  const { addToCart } = useCart();


  if (!product) return null;



  const getImage = () => {

    if (!product.image_url) {

      return "https://dummyimage.com/300x200/ddd/000&text=No+Image";

    }


    if (product.image_url.startsWith("http")) {

      return product.image_url;

    }


    return `${BASE_URL}${product.image_url}`;

  };


  const imageUrl = getImage();



  return (

    <div style={styles.card}>


      <img
        src={imageUrl}
        alt={product.name}
        style={styles.image}
        loading="lazy"

        onError={(e)=>{

          e.currentTarget.onerror = null;

          e.currentTarget.src =
          "https://dummyimage.com/300x200/ddd/000&text=No+Image";

        }}

      />



      <div style={styles.content}>


        <h3 style={styles.title}>
          {product.name}
        </h3>



        <p style={styles.desc}>
          {product.description || "No description"}
        </p>



        <p style={styles.category}>
          📂 {product.category || "Uncategorized"}
        </p>



        <p style={styles.price}>
          ₹{Number(product.price || 0).toLocaleString()}
        </p>



        <button
          style={styles.btn}
          onClick={() => addToCart(product,1)}
        >

          Add To Cart

        </button>



        <Link
          to={`/products/${product.id}`}
          style={styles.link}
        >

          View Details →

        </Link>


      </div>

    </div>

  );

}


export default ProductsCard;



const styles = {


  card: {

    background: "var(--card-bg)",

    borderRadius: "12px",

    overflow: "hidden",

    boxShadow: "var(--shadow)",

    border: "1px solid var(--border-color)",

    transition: "0.3s",

  },



  image: {

    width:"100%",

    height:"200px",

    objectFit:"cover",

    display:"block",

  },



  content: {

    padding:"12px",

  },



  title: {

    margin:"0 0 6px 0",

    fontSize:"16px",

    color:"var(--text-primary)",

  },



  desc: {

    fontSize:"13px",

    color:"var(--text-secondary)",

    height:"35px",

    overflow:"hidden",

  },



  category: {

    fontSize:"12px",

    color:"var(--text-secondary)",

    marginTop:"5px",

  },



  price: {

    fontWeight:"bold",

    color:"#22c55e",

    marginTop:"5px",

  },



  btn: {

    marginTop:"10px",

    width:"100%",

    padding:"8px",

    borderRadius:"6px",

    background:"var(--btn-primary)",

    color:"var(--btn-text)",

    cursor:"pointer",

  },



  link: {

    display:"block",

    marginTop:"10px",

    fontSize:"12px",

    color:"var(--text-primary)",

    textDecoration:"none",

  },


};