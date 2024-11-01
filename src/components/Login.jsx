import React, { useState } from "react";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../hooks/firebaseConfig";
import { useNavigate } from "react-router-dom";
import quiz from "../assets/images/login/login.png";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/quizcard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <section className="login-main">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6 d-none d-md-block">
            <div>
              <img className="img-fluid" src={quiz} alt="Quiz" />
            </div>
          </div>
          <div className="col-lg-4 d-flex justify-content-center align-items-center">
            <div>
              <div className="login-container">
                <div className="text-center mb-3">
                  <h6>Login Here</h6>
                </div>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="input-container">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="input-container">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="password-toggle-icon"
                    >
                      {/* {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />} */}
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-dark">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
