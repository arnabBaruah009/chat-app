import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "../styles/register.module.css";
import { auth, storage, db } from "../firebase";
import { Loader } from "../components";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

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
          <>
            <span>Welcome</span>
            <span>Register</span>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <input style={{ display: "none" }} type="file" id="file" />
              <label htmlFor="file">
                <span>Add an avatar</span>
              </label>
              <button>Sign up</button>
            </form>
            <p>
              You do have an account? <Link to="/login">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
