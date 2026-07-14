import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";


function Cart() {

  const {
    cartItems,
    removeFromCart,
    addToCart,
    decreaseQty,
    clearCart
  } = useCart();


  const navigate = useNavigate();



  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.qty,
    0
  );



  return (

    <div style={styles.page}>


      <h1>Your Cart 🛒</h1>



      {cartItems.length === 0 ? (

        <h3>Cart Empty</h3>

      ) : (

        <>


        {cartItems.map((item)=>(


          <div
            key={item.id}
            style={styles.card}
          >


            <img

              src={
                item.image_url?.startsWith("/static")
                ? `http://127.0.0.1:5000${item.image_url}`
                : item.image_url
              }

              alt={item.name}

              style={styles.img}

            />



            <div>


              <h3>{item.name}</h3>


              <p>
                Price: ₹{item.price}
              </p>



              <div style={styles.qtyBox}>


                <button

                  onClick={() =>
                    decreaseQty(item.id)
                  }

                  style={styles.qtyBtn}

                  disabled={item.qty <= 1}

                >
                  ➖
                </button>



                <span style={styles.qtyText}>
                  {item.qty}
                </span>



                <button

                  onClick={() =>
                    addToCart(item,1)
                  }

                  style={styles.qtyBtn}

                >
                  ➕
                </button>


              </div>




              <button

                onClick={() =>
                  removeFromCart(item.id)
                }

                style={styles.removeBtn}

              >

                Remove

              </button>


            </div>


          </div>


        ))}




        <h2>
          Total: ₹{total.toLocaleString()}
        </h2>



        <button

          onClick={() =>
            navigate("/checkout")
          }

          style={styles.orderBtn}

        >

          Place Order

        </button>




        <button

          onClick={clearCart}

          style={styles.clearBtn}

        >

          Clear Cart

        </button>



        </>

      )}



    </div>

  );

}


export default Cart;




const styles = {


page: {

  padding:"20px",

  background:"var(--bg-primary)",

  color:"var(--text-primary)",

  minHeight:"100vh",

  transition:"0.3s",

},



card: {

  display:"flex",

  gap:"15px",

  padding:"15px",

  marginBottom:"15px",

  border:"1px solid var(--border-color)",

  borderRadius:"10px",

  background:"var(--card-bg)",

  color:"var(--text-primary)",

  boxShadow:"var(--shadow)",

},



img: {

 width:"80px",

 height:"80px",

 objectFit:"cover",

 borderRadius:"8px",

},



qtyBox: {

 display:"flex",

 alignItems:"center",

 marginTop:"8px",

},



qtyBtn: {

 padding:"5px 10px",

 cursor:"pointer",

 border:"1px solid var(--border-color)",

 background:"var(--card-bg)",

 color:"var(--text-primary)",

 borderRadius:"5px",

},



qtyText: {

 margin:"0 10px",

},



removeBtn: {

 background:"#ef4444",

 color:"#ffffff",

 border:"none",

 padding:"8px 12px",

 marginTop:"10px",

 borderRadius:"5px",

 cursor:"pointer",

},



orderBtn: {

 background:"var(--btn-primary)",

 color:"var(--btn-text)",

 border:"none",

 padding:"10px 15px",

 marginTop:"10px",

 marginRight:"10px",

 borderRadius:"6px",

 cursor:"pointer",

},



clearBtn: {

 background:"var(--text-secondary)",

 color:"#ffffff",

 border:"none",

 padding:"10px 15px",

 borderRadius:"6px",

 cursor:"pointer",

},


};