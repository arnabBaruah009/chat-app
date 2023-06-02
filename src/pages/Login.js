import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import styles from "../styles/register.module.css";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chatRoom");
    } catch (error) {
      setErr(true);
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formDiv}>
        {err ? (
          <>
            <span>Something went wrong</span>
          </>
        ) : (
          <>
            <span>Welcome</span>
            <span>Login</span>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button>Login</button>
            </form>
            <p>
              You don't have an account? <Link to="/">Register</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;