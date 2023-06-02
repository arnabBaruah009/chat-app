import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "../styles/register.module.css";
import { auth, storage, db } from "../firebase";
import { Loader } from "../components";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(res.user, {
        displayName: name,
        photoURL: downloadURL,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setFile(null);
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
            <p className={styles.formTitle}>Register your account</p>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className={styles.inputContainer}>
              <input type="file" onChange={(e) => setFile(e.target.value)} />
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className={styles.submit}
            >
              Register
            </button>

            <p className={styles.signupLink}>
              Have account?
              <Link to={"/login"}>Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
