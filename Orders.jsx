import { useEffect, useState } from "react";
import API from "../api";


function Orders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("access_token");



  useEffect(() => {


    const fetchOrders = async () => {


      try {


        if (!token) {

          setLoading(false);

          return;

        }



        const res = await API.get("/orders/my", {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });



        setOrders(res.data || []);



      } catch (err) {


        console.log(
          "Orders API Error:",
          err.response?.data || err.message
        );


        setOrders([]);



      } finally {


        setLoading(false);


      }


    };



    fetchOrders();



  }, [token]);





  return (


    <div style={styles.page}>


      <h1 style={styles.title}>
        📦 My Orders
      </h1>




      {
        loading ? (


          <p style={styles.empty}>
            Loading orders...
          </p>



        ) : orders.length === 0 ? (


          <p style={styles.empty}>
            No Orders Found 😢
          </p>



        ) : (


          orders.map((order)=>(



            <div
              key={order.id}
              style={styles.card}
            >



              <h3>
                Order #{order.id}
              </h3>




              <p>

                <strong>Status:</strong>{" "}

                <span style={styles.status}>
                  {order.status}
                </span>

              </p>





              <p>

                <strong>Total:</strong>{" "}

                ₹{Number(order.amount).toLocaleString()}

              </p>





              <p>

                <strong>Address:</strong>{" "}

                {order.address}

              </p>





              <p>

                <strong>Time:</strong>{" "}

                {
                  order.ordered_at
                  ? new Date(
                      order.ordered_at
                    ).toLocaleString()
                  : "-"
                }

              </p>







              {
                order.items &&
                order.items.length > 0 && (


                  <>


                    <hr style={styles.line}/>




                    <h4>
                      Products
                    </h4>





                    {
                      order.items.map((item)=>(


                        <div
                          key={item.id}
                          style={styles.item}
                        >



                          <p>
                            {item.name}
                          </p>



                          <p>
                            Qty: {item.quantity}
                          </p>



                          <p>
                            Price: ₹{item.unit_price}
                          </p>



                        </div>



                      ))
                    }



                  </>


                )
              }





            </div>



          ))


        )
      }



    </div>


  );

}


export default Orders;





const styles = {



  page: {


    padding:"20px",


    background:"var(--bg-primary)",


    color:"var(--text-primary)",


    minHeight:"100vh",


    transition:"0.3s",


  },




  title:{


    textAlign:"center",


    marginBottom:"20px",


    color:"var(--text-primary)",


  },





  card:{


    background:"var(--card-bg)",


    color:"var(--text-primary)",


    padding:"15px",


    marginBottom:"15px",


    borderRadius:"10px",


    border:"1px solid var(--border-color)",


    boxShadow:"var(--shadow)",


    transition:"0.3s",


  },





  status:{


    background:"var(--btn-primary)",


    color:"var(--btn-text)",


    padding:"3px 8px",


    borderRadius:"5px",


    fontSize:"13px",


  },





  line:{


    border:"1px solid var(--border-color)",


    margin:"10px 0",


  },





  item:{


    marginBottom:"8px",


    color:"var(--text-primary)",


    padding:"5px",


  },





  empty:{


    textAlign:"center",


    color:"var(--text-secondary)",


  },


};