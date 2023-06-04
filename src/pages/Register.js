import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import styles from "../styles/auth.module.css";
import { auth, storage, db } from "../firebase";
import { Loader } from "../components";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
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
      toast.success("Welcome");
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setFile(null);
      navigate("/chatRoom");
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        toast.error("Email already in use");
      }
      if (error.code == "auth/invalid-email") {
        toast.error("Invalid email");
      }
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
            <input
              type="file"
              onChange={(e) => setFile(e.target.value)}
              id="file"
              style={{ display: "none" }}
            />
            <label htmlFor="file">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                style={{ height: "30px", marginRight: "10px" }}
              >
                <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
              </svg>
              Add an avatar
            </label>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className={styles.submit}
          >
            Register
          </button>

          <p className={styles.signupLink}>
            Have an account?
            <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
