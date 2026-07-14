import { useState } from "react";
import { useCart } from "../context/CartContext";
import API from "../api";
import { useNavigate } from "react-router-dom";


function Checkout() {

  const {
    cartItems,
    clearCart
  } = useCart();


  const [address, setAddress] = useState("");

  const navigate = useNavigate();


  const user = JSON.parse(
    localStorage.getItem("user")
  );



  const total = cartItems.reduce(
    (sum,item)=>
      sum + Number(item.price) * item.qty,
    0
  );




  const getImage = (item)=>{

    if(!item.image_url){

      return "https://dummyimage.com/300x200/ddd/000&text=No+Image";

    }


    if(item.image_url.startsWith("http")){

      return item.image_url;

    }


    return `http://127.0.0.1:5000${item.image_url}`;

  };





  const placeOrder = async()=>{


    try{


      if(!user){

        alert("Please Login First");

        navigate("/login");

        return;

      }



      if(!address.trim()){

        alert("Please Enter Address");

        return;

      }



      if(cartItems.length===0){

        alert("Cart Empty");

        return;

      }





      const payload={

        user_id:user.id,

        address,

        items:cartItems.map(item=>({

          product_id:item.id,

          quantity:item.qty

        }))

      };




      const res = await API.post(
        "/orders",
        payload
      );



      alert(
        `Order Placed Successfully 🎉 Order ID: ${res.data.order_id}`
      );



      clearCart();


      navigate("/orders");



    }catch(err){


      console.log(
        err.response?.data || err.message
      );


      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Order Failed"
      );


    }


  };





  return (

    <div style={styles.page}>


      <h1>
        🧾 Checkout
      </h1>



      <div style={styles.box}>


        <h3>
          👤 Customer Details
        </h3>


        <p>
          <strong>Name:</strong>{" "}
          {user?.name || "Guest"}
        </p>


        <p>
          <strong>Email:</strong>{" "}
          {user?.email || "-"}
        </p>


      </div>






      <div style={styles.box}>


        <h3>
          🛒 Order Summary
        </h3>




        {
          cartItems.length===0 ? (

            <p>
              Cart Empty
            </p>


          ) : (


            cartItems.map(item=>(


              <div
                key={item.id}
                style={styles.item}
              >



                <img

                  src={getImage(item)}

                  alt={item.name}

                  style={styles.img}


                  onError={(e)=>{

                    e.currentTarget.onerror=null;

                    e.currentTarget.src=
                    "https://dummyimage.com/300x200/ddd/000&text=No+Image";

                  }}

                />




                <div>

                  <h4>
                    {item.name}
                  </h4>


                  <p>
                    Qty: {item.qty}
                  </p>


                  <p>
                    Price: ₹{item.price}
                  </p>


                  <p>
                    Total: ₹
                    {Number(item.price)*item.qty}
                  </p>


                </div>



              </div>


            ))


          )

        }


      </div>





      <div style={styles.box}>


        <h3>
          📍 Delivery Address
        </h3>



        <textarea

          placeholder="Enter Full Address"

          value={address}

          onChange={(e)=>setAddress(e.target.value)}

          style={styles.input}

        />


      </div>






      <div style={styles.totalBox}>

        <h2>
          💰 Grand Total: ₹{total}
        </h2>

      </div>




      <button

        onClick={placeOrder}

        style={styles.btn}

      >

        Place Order

      </button>




    </div>

  );

}


export default Checkout;