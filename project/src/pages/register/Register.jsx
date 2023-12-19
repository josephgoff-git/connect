import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import { API_URL } from '../../config';
import lottie from 'lottie-web';
import animationData1 from '../loading-animation.json'; 
import animationData2 from '../loading-animation-black.json'; 

const Register = ({addActivity}) => {

  const [guestEnterText, setGuestEnterText] = useState("Enter as Guest")
  const [loginText, setLoginText] = useState("Register")
  const [hasClicked1, setHasClicked1] = useState(false);
  const [hasClicked2, setHasClicked2] = useState(false);

  function playAnimation(id) {
    if (id === "lottie-container1" && !hasClicked1 && !hasClicked2) {
      const container = document.getElementById(id); 
      if (container) {
        const animation = lottie.loadAnimation({
          container: container,
          animationData: animationData1, 
          renderer: 'svg', 
          loop: true,
          autoplay: true, 
        });
      }
      setHasClicked1(true)
      setLoginText("Registering...")
    }

    if (id === "lottie-container2" && !hasClicked2 && !hasClicked2) {
      const container = document.getElementById(id); 
      if (container) {
        const animation = lottie.loadAnimation({
          container: container,
          animationData: animationData2, 
          renderer: 'svg', 
          loop: true,
          autoplay: true, 
        });
      }
      setHasClicked2(true)
      setGuestEnterText("Connecting...")
    }
  }


  
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    profilePic: "1687901019194-user.png",
    coverPic: "1687901394006-cover.png",
    city: "USA",
    website: "",
    ids: [1,2,3,4]
  });
  
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
  };

  const { login } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    playAnimation("lottie-container1")
    if (inputs.username !== "" && inputs.name !== "" && inputs.email !== "" && inputs.password !== "") {
      try {
        await axios.post(API_URL + "/auth/register", inputs);
        try {
          await login(inputs);
          addActivity({label: "Successfully registered", moment: moment(), link: "/activity"})
          navigate("/")
        } catch (err) {
          console.error(err)
          setErr(err.response.data);
          setHasClicked1(false)
          setLoginText("Register")
        }
      } catch (err) {
        console.error(err)
        setErr(err.response.data);
        setHasClicked1(false)
        setLoginText("Register")
      }
    } else {
      setErr("Fill all inputs!");
      setHasClicked1(false)
      setLoginText("Register")
    }
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    playAnimation("lottie-container2")
    try {
      await login({email: "guest", password: "guest"});
      addActivity({label: "Logged in", moment: moment(), link: "/activity"})
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
      setHasClicked2(false)
      setGuestEnterText("Enter as Guest")
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Welcome</h1>
          <span>Already have account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="First Name" name="username" onChange={handleChange}/>
            <input type="text" placeholder="Last Name" name="name" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <div style={{color: "#666", fontSize: "14px"}}>{err && err}</div>
            <button onClick={handleClick} style={{width: hasClicked1? "140px" : "44%"}}>
              <div style={{marginLeft: hasClicked1? "-30px" : 0}}>{loginText}</div>
              <div id="lottie-container1" style={{display: hasClicked1? "block" : "none", position: "absolute", top: "-31px", right: "-25px", height: "100px", width: "100px", padding: 0, margin: 0}}></div>
            </button>
          </form>

          <Link to="/login" style={{textDecoration: "none"}}>
              <p>Login</p>
          </Link>
        </div>
      </div>

      <div className="enterasguest" 
        onClick={handleGuestLogin}>
        <p style={{whiteSpace: "nowrap", padding: "0 15px"}}>{guestEnterText}</p>
        <div id="lottie-container2" style={{display: hasClicked2? "block" : "none", height: "100px", width: "100px", padding: 0, margin: 0, marginLeft: "-45px", marginRight: "-25px"}}></div>
      </div>
      
    </div>
  );
};

export default Register;
