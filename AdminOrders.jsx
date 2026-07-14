import { useEffect, useState } from "react";
import API from "../../api";


function AdminOrders() {

  const [orders, setOrders] = useState([]);



  useEffect(() => {

    fetchOrders();

  }, []);




  const fetchOrders = async () => {

    try {

      const res = await API.get(
        "/admin/orders?page=1&limit=100"
      );


      console.log(
        "ORDERS API:",
        res.data
      );


      setOrders(
        Array.isArray(res.data.orders)
          ? res.data.orders
          : []
      );


    } catch (err) {


      console.log(
        "Fetch Error:",
        err
      );


      setOrders([]);


    }

  };






  const updateStatus = async (
    orderId,
    status
  ) => {


    try {


      await API.put(
        `/admin/orders/${orderId}`,
        {
          status,
        }
      );



      setOrders((prev)=>

        prev.map((order)=>

          order.id === orderId

          ? {
              ...order,
              status
            }

          : order

        )

      );



      alert(
        "Status Updated ✅"
      );



    } catch(err) {


      console.log(
        "Update Error:",
        err
      );


      alert(
        "Update Failed ❌"
      );


    }


  };





  return (

    <div style={styles.page}>


      <h1 style={styles.title}>
        📦 Admin Orders
      </h1>




      {
        orders.length === 0 ? (


          <p style={styles.empty}>
            No Orders Found
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

                <strong>
                  Customer:
                </strong>{" "}

                {order.customer_name || "-"}

              </p>





              <p>

                <strong>
                  Amount:
                </strong>{" "}

                ₹
                {Number(
                  order.total_amount || 0
                ).toLocaleString()}

              </p>





              <p>

                <strong>
                  Address:
                </strong>{" "}

                {order.address || "-"}

              </p>





              <p>

                <strong>
                  Ordered At:
                </strong>{" "}


                {
                  order.ordered_at
                  ? new Date(
                      order.ordered_at
                    ).toLocaleString()
                  : "-"
                }


              </p>







              <div style={styles.statusBox}>


                <strong>
                  Status:
                </strong>



                <select

                  value={order.status}

                  onChange={(e)=>
                    updateStatus(
                      order.id,
                      e.target.value
                    )
                  }

                  style={styles.select}

                >


                  <option value="Pending">
                    Pending
                  </option>


                  <option value="Shipped">
                    Shipped
                  </option>


                  <option value="Delivered">
                    Delivered
                  </option>



                </select>


              </div>




            </div>



          ))


        )
      }





    </div>

  );

}


export default AdminOrders;






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




empty:{


  textAlign:"center",


  color:"var(--text-secondary)",


  fontSize:"18px",


},




card:{


  background:"var(--card-bg)",


  color:"var(--text-primary)",


  border:"1px solid var(--border-color)",


  borderRadius:"10px",


  padding:"15px",


  marginBottom:"15px",


  boxShadow:"var(--shadow)",


},




statusBox:{


  marginTop:"10px",


},




select:{


  marginLeft:"10px",


  padding:"8px",


  borderRadius:"6px",


  border:"1px solid var(--border-color)",


  background:"var(--card-bg)",


  color:"var(--text-primary)",


  outline:"none",


},


};