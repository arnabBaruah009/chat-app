import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

import styles from "../styles/auth.module.css";
import { auth } from "../firebase";
import { Loader } from "../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter all fields!");
      return;
    }
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome");
      setLoading(false);
      setEmail("");
      setPassword("");
      navigate("/chatRoom");
    } catch (error) {
      toast.error("Invalid credentials");
      setLoading(false);
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formDiv}>
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
      </div>
    </div>
  );
};

export default Login;
