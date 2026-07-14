import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

const BASE_URL = "http://127.0.0.1:5000";

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toasts, showToast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar_url: "",
    created_at: "",
  });

  const [profileError, setProfileError] = useState("");

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Fix duplicate URL issue
  const getImageUrl = (url) => {
    if (!url) return "";

    return url.startsWith("http")
      ? url
      : `${BASE_URL}${url}`;
  };


  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    try {
      const res = await API.get("/me");

      setProfile(res.data);

      if (res.data.avatar_url) {
        setPreview(getImageUrl(res.data.avatar_url));
      }

    } catch (err) {
      console.log(err);
    }
  };


  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };


  const saveProfile = async (e) => {
    e.preventDefault();

    setProfileError("");

    try {
      await API.put("/me", {
        name: profile.name,
        email: profile.email,
      });


      updateUser({
        name: profile.name,
        email: profile.email,
      });


      showToast(
        "Profile updated",
        "success"
      );

    } catch (err) {

      if (err.response?.status === 409) {
        setProfileError(
          "Email already exists"
        );
      } else {
        showToast(
          "Update failed",
          "error"
        );
      }

    }
  };


  const handleFile = (e) => {

    const file = e.target.files[0];

    if (!file) return;


    setSelectedFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };



  const uploadAvatar = async () => {

    if (!selectedFile) return;


    const formData = new FormData();

    formData.append(
      "image",
      selectedFile
    );


    try {

      const upload = await API.post(
        "/upload",
        formData
      );


      await API.put(
        "/me",
        {
          name: profile.name,
          email: profile.email,
          avatar_url: upload.data.image_url,
        }
      );


      setProfile({
        ...profile,
        avatar_url: upload.data.image_url,
      });


      setPreview(
        getImageUrl(upload.data.image_url)
      );


      updateUser({
        avatar_url: upload.data.image_url,
      });


      showToast(
        "Photo updated",
        "success"
      );


    } catch {

      showToast(
        "Upload failed",
        "error"
      );

    }
  };


  return (

    <div style={styles.container}>

      <ToastContainer toasts={toasts} />


      <h2>
        My Profile
      </h2>



      <div style={styles.card}>

        <h3>
          Profile Picture
        </h3>


        {preview ? (

          <img
            src={preview}
            alt="Avatar"
            style={styles.avatar}
          />

        ) : (

          <div style={styles.placeholder}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

        )}



        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
        />


        <button
          onClick={uploadAvatar}
          style={styles.button}
        >
          Upload
        </button>
        {profile.created_at && (
  <p style={styles.memberSince}>
    Member since{" "}
    {new Date(profile.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}
  </p>
)}


      </div>





      <div style={styles.card}>

        <h3>
          Edit Profile
        </h3>


        <form onSubmit={saveProfile}>


          <input
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
            style={styles.input}
          />


          <input
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email"
            style={styles.input}
          />



          {profileError && (

            <p style={styles.error}>
              {profileError}
            </p>

          )}



          <button
            style={styles.button}
          >
            Save Changes
          </button>


        </form>


      </div>





      <div style={styles.card}>

        <h3>
          Change Password
        </h3>


        <form
          onSubmit={async (e)=>{

            e.preventDefault();

            setPasswordError("");


            if(
              passwords.new_password !==
              passwords.confirm_password
            ){
              setPasswordError(
                "Passwords do not match"
              );
              return;
            }


            if(
              passwords.new_password.length < 6
            ){
              setPasswordError(
                "Minimum 6 characters"
              );
              return;
            }


            try{

              await API.put(
                "/me/password",
                passwords
              );


              showToast(
                "Password changed successfully",
                "success"
              );


              setPasswords({
                current_password:"",
                new_password:"",
                confirm_password:"",
              });


            }catch(err){


              if(
                err.response?.status === 401
              ){

                setPasswordError(
                  "Current password incorrect"
                );

              }else{

                showToast(
                  "Password update failed",
                  "error"
                );

              }

            }

          }}
        >


          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current_password}
            onChange={(e)=>
              setPasswords({
                ...passwords,
                current_password:e.target.value
              })
            }
            style={styles.input}
          />


          <input
            type="password"
            placeholder="New Password"
            value={passwords.new_password}
            onChange={(e)=>
              setPasswords({
                ...passwords,
                new_password:e.target.value
              })
            }
            style={styles.input}
          />


          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirm_password}
            onChange={(e)=>
              setPasswords({
                ...passwords,
                confirm_password:e.target.value
              })
            }
            style={styles.input}
          />



          {passwordError && (

            <p style={styles.error}>
              {passwordError}
            </p>

          )}



          <button style={styles.button}>
            Change Password
          </button>


        </form>


      </div>


    </div>

  );
}


export default ProfilePage;



const styles = {

  container:{
    maxWidth:"700px",
    margin:"30px auto",
    padding:"20px",
  },


  card:{
    background:"var(--card-bg)",
    padding:"20px",
    marginBottom:"20px",
    borderRadius:"10px",
    border:"1px solid var(--border-color)",
  },


  avatar:{
    width:"120px",
    height:"120px",
    borderRadius:"50%",
    objectFit:"cover",
    marginBottom:"15px",
  },


  placeholder:{
    width:"120px",
    height:"120px",
    borderRadius:"50%",
    background:"#2563eb",
    color:"#fff",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"42px",
    fontWeight:"bold",
    marginBottom:"15px",
  },


  input:{
    width:"100%",
    padding:"10px",
    marginBottom:"12px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    boxSizing:"border-box",
  },


  button:{
    padding:"10px 18px",
    background:"#2563eb",
    color:"#fff",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer",
  },


  error:{
    color:"red",
    marginBottom:"10px",
  },
  memberSince: {
  marginTop: "12px",
  fontSize: "14px",
  color: "var(--text-primary)",
},

};