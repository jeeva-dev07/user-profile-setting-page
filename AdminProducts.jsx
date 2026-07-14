import { useEffect, useState } from "react";
import API from "../../api";
import { Link } from "react-router-dom";


const BASE_URL = "http://127.0.0.1:5000";



function AdminProducts() {


  const [products,setProducts] = useState([]);

  const [search,setSearch] = useState("");

  const [category,setCategory] = useState("All");

  const [sort,setSort] = useState("");





  useEffect(()=>{

    fetchProducts();

  },[]);





  const fetchProducts = async()=>{

    try{


      const res = await API.get(
        "/products?page=1&limit=100"
      );


      setProducts(
        res.data.products || []
      );


    }catch(err){

      console.log(
        "FETCH ERROR:",
        err
      );

      setProducts([]);

    }

  };







  const deleteProduct = async(id)=>{


    if(!window.confirm("Delete this product?"))
      return;



    try{


      await API.delete(
        `/admin/products/${id}`
      );


      alert(
        "Product Deleted Successfully"
      );


      fetchProducts();



    }catch(err){


      console.log(
        "DELETE ERROR:",
        err
      );


      alert(
        "Delete Failed"
      );


    }


  };








  let filteredProducts = Array.isArray(products)
    ? [...products]
    : [];




  if(search){


    filteredProducts =
      filteredProducts.filter((p)=>

        p.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      );


  }





  if(category !== "All"){


    filteredProducts =
      filteredProducts.filter(
        (p)=>
          p.category === category
      );


  }






  if(sort==="low"){


    filteredProducts.sort(
      (a,b)=>
        Number(a.price)-Number(b.price)
    );


  }





  if(sort==="high"){


    filteredProducts.sort(
      (a,b)=>
        Number(b.price)-Number(a.price)
    );


  }






  const getImageUrl=(url)=>{


    if(!url){

      return "https://placehold.co/120";

    }



    return url.startsWith("http")
      ? url
      : `${BASE_URL}${url}`;


  };






  return (


    <div style={styles.page}>


      <h1 style={styles.title}>
        🛠 Admin Products
      </h1>





      <Link
        to="/admin/products/add"
        style={styles.addBtn}
      >
        ➕ Add Product
      </Link>






      <div style={styles.filters}>


        <input

          type="text"

          placeholder="Search Product..."

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

          style={styles.input}

        />




        <select

          value={category}

          onChange={(e)=>
            setCategory(e.target.value)
          }

          style={styles.select}

        >


          <option value="All">
            All
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Home">
            Home
          </option>

          <option value="Books">
            Books
          </option>

          <option value="Sports">
            Sports
          </option>


        </select>





        <select

          value={sort}

          onChange={(e)=>
            setSort(e.target.value)
          }

          style={styles.select}

        >


          <option value="">
            Sort By
          </option>

          <option value="low">
            Price Low → High
          </option>

          <option value="high">
            Price High → Low
          </option>


        </select>



      </div>







      {
        filteredProducts.length===0 ? (


          <h3 style={styles.noData}>
            No Products Found
          </h3>



        ) : (



          filteredProducts.map((p)=>(



            <div
              key={p.id}
              style={styles.card}
            >



              <img

                src={
                  getImageUrl(
                    p.image_url
                  )
                }

                alt={p.name}

                style={styles.image}


                onError={(e)=>{

                  e.currentTarget.onerror=null;

                  e.currentTarget.src=
                  "https://placehold.co/120";

                }}

              />





              <div style={{flex:1}}>


                <h3>
                  {p.name}
                </h3>



                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {p.category}
                </p>



                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ₹{Number(p.price).toLocaleString()}
                </p>



                <p>
                  <strong>
                    Stock:
                  </strong>{" "}
                  {p.stock}
                </p>






                <div style={styles.buttonRow}>


                  <Link
                    to={`/admin/products/edit/${p.id}`}
                  >

                    <button style={styles.editBtn}>
                      Edit
                    </button>

                  </Link>




                  <button

                    style={styles.deleteBtn}

                    onClick={()=>
                      deleteProduct(p.id)
                    }

                  >

                    Delete

                  </button>



                </div>


              </div>



            </div>



          ))



        )
      }




    </div>


  );


}


export default AdminProducts;





const styles={



page:{


padding:"20px",

background:"var(--bg-primary)",

color:"var(--text-primary)",

minHeight:"100vh",

transition:"0.3s",

},





title:{


color:"var(--text-primary)",

marginBottom:"20px",

},






addBtn:{


display:"inline-block",

marginBottom:"20px",

textDecoration:"none",

background:"var(--btn-primary)",

color:"var(--btn-text)",

padding:"10px 15px",

borderRadius:"6px",

},






filters:{


display:"flex",

gap:"10px",

marginBottom:"20px",

flexWrap:"wrap",

},






input:{


padding:"10px",

width:"250px",

border:"1px solid var(--border-color)",

borderRadius:"6px",

background:"var(--card-bg)",

color:"var(--text-primary)",

},






select:{


padding:"10px",

border:"1px solid var(--border-color)",

borderRadius:"6px",

background:"var(--card-bg)",

color:"var(--text-primary)",

},






card:{


display:"flex",

gap:"20px",

padding:"15px",

border:"1px solid var(--border-color)",

borderRadius:"10px",

marginBottom:"15px",

alignItems:"center",

background:"var(--card-bg)",

color:"var(--text-primary)",

boxShadow:"var(--shadow)",

},






image:{


width:"120px",

height:"120px",

objectFit:"cover",

borderRadius:"10px",

border:"1px solid var(--border-color)",

},






buttonRow:{


display:"flex",

gap:"10px",

marginTop:"10px",

},






editBtn:{


padding:"8px 14px",

background:"var(--btn-primary)",

color:"var(--btn-text)",

border:"none",

borderRadius:"5px",

cursor:"pointer",

},






deleteBtn:{


padding:"8px 14px",

background:"#ef4444",

color:"#fff",

border:"none",

borderRadius:"5px",

cursor:"pointer",

},






noData:{


color:"var(--text-secondary)",

},


};