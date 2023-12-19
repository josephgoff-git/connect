import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import moment from "moment";
import lottie from 'lottie-web';
import animationData1 from '../loading-animation.json'; 
import animationData2 from '../loading-animation-black.json'; 

const Login = ({addActivity}) => {
  const [guestEnterText, setGuestEnterText] = useState("Enter as Guest")
  const [loginText, setLoginText] = useState("Login")
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
      setLoginText("Logging in...")
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


  localStorage.clear()
  
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    playAnimation("lottie-container1")
    try {
      await login(inputs);
      addActivity({label: "Logged in", moment: moment(), link: "/activity"})
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
      setHasClicked1(false)
      setLoginText("Login")
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
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome</h1>
          <p>
            
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Email"
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <div style={{color: "#666", fontSize: "14px"}}>{err && err}</div>
            <button onClick={handleLogin} style={{width: hasClicked1? "140px" : "44%"}}>
              <div style={{marginLeft: hasClicked1? "-30px" : 0}}>{loginText}</div>
              <div id="lottie-container1" style={{display: hasClicked1? "block" : "none", position: "absolute", top: "-31px", right: "-25px", height: "100px", width: "100px", padding: 0, margin: 0}}></div>
            </button>
          </form>

          <Link to="/register" style={{textDecoration: "none"}}>
              <p>Create Account</p>
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

export default Login;