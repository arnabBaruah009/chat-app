import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import styles from "../styles/register.module.css";
import { auth } from "../firebase";
import { Loader } from "../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setEmail("");
      setPassword("");
      navigate("/chatRoom");
    } catch (error) {
      setErr(true);
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formDiv}>
        {err ? (
          <>
            <span>Something went wrong</span>
          </>
        ) : (
          <form className={styles.form}>
            <p className={styles.formTitle}>Sign in to your account</p>
            <div className={styles.inputContainer}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className={styles.submit}
            >
              Sign in
            </button>

            <p className={styles.signupLink}>
              No account?
              <Link to={"/"}>Register</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
